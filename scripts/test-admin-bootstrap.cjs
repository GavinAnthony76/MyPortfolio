// Dependency-injected checks: no Clerk calls, environment secrets, or database.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const ts = require("typescript");
const compiled = ts.transpileModule(
  fs.readFileSync("server/auth/adminBootstrap.ts", "utf8"),
  { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } },
).outputText;
const exportsObject = {};
vm.runInNewContext(compiled, { exports: exportsObject });
const { bootstrapAdminIdentity } = exportsObject;
const email = "owner@example.invalid";
const identity = (address = email, status = "verified") => ({
  primaryEmailAddress: { emailAddress: address, verification: { status } },
});
const noCreation = async () => { throw new Error("Unexpected account creation"); };

(async () => {
  let reads = 0;
  assert.equal(await bootstrapAdminIdentity("development", email, {
    find: async () => { reads++; throw new Error("Unexpected provider access"); },
    create: noCreation,
  }), "skipped-development");
  assert.equal(reads, 0);
  await assert.rejects(() => bootstrapAdminIdentity("production", "", {
    find: async () => { throw new Error("Unexpected lookup"); }, create: noCreation,
  }), /ADMIN_EMAIL/);

  for (const [user, expected] of [
    [identity(), "existing"],
    [identity(email, "unverified"), "existing-needs-review"],
    [identity("other@example.invalid"), "existing-needs-review"],
  ]) {
    assert.equal(await bootstrapAdminIdentity("production", email, {
      find: async () => ({ data: [user] }), create: noCreation,
    }), expected);
  }

  let creations = 0;
  assert.equal(await bootstrapAdminIdentity("production", ` ${email.toUpperCase()} `, {
    find: async (value) => {
      assert.equal(value, email);
      return { data: [] };
    },
    create: async (options) => {
      creations++;
      assert.equal(JSON.stringify(options), JSON.stringify({
        emailAddress: [email], skipPasswordRequirement: true,
      }));
      return identity();
    },
  }), "created");
  assert.equal(creations, 1);

  await assert.rejects(() => bootstrapAdminIdentity("production", email, {
    find: async () => { throw new Error("Provider unavailable"); },
    create: noCreation,
  }), /Provider unavailable/);
  await assert.rejects(() => bootstrapAdminIdentity("production", email, {
    find: async () => ({ data: [identity(), identity()] }), create: noCreation,
  }), /ambiguous/);

  let raceReads = 0;
  assert.equal(await bootstrapAdminIdentity("production", email, {
    find: async () => ({ data: ++raceReads === 1 ? [] : [identity()] }),
    create: async () => { throw new Error("Created by another instance"); },
  }), "existing");
  await assert.rejects(() => bootstrapAdminIdentity("production", email, {
    find: async () => ({ data: [] }),
    create: async () => { throw new Error("Creation failed"); },
  }), /creation failed/);
  console.log("PASS: 10 admin bootstrap cases; no real accounts, provider requests, or database writes.");
})().catch((error) => { console.error(error); process.exitCode = 1; });
