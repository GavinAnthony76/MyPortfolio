// Isolated authorization regression checks. No network, secrets, or database.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const ts = require("typescript");
const source = fs.readFileSync("server/middlewares/clerkAuth.ts", "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;

async function check({ signedIn = true, configured = true, email = "owner@example.invalid", verified = true, unavailable = false, expected, privileged = false, existingAdmin = false }) {
  let dbCalls = 0;
  let nextCalls = 0;
  const exports = {};
  const context = {
    exports,
    console: { error() {} },
    process: { env: configured ? { ADMIN_EMAIL: "owner@example.invalid" } : {} },
    require(name) {
      if (name === "@clerk/express") return {
        getAuth: () => ({ userId: signedIn ? "isolated-user" : null }),
        clerkClient: { users: { getUser: async () => {
          if (unavailable) throw new Error("simulated provider outage");
          return { primaryEmailAddress: { emailAddress: email, verification: { status: verified ? "verified" : "unverified" } } };
        } } },
      };
      if (name === "../db") return { db: new Proxy({}, { get(_target, prop) {
        dbCalls++;
        if (existingAdmin && prop === "select") {
          return () => ({ from: () => ({ where: () => ({ limit: async () => [{ id: "isolated-user", username: "isolated-admin" }] }) }) });
        }
        throw new Error("Database writes and unexpected reads are forbidden in this test");
      } }) };
      if (name === "drizzle-orm") return { eq() {} };
      if (name === "@shared/schema") return { users: {} };
      throw new Error(`Unexpected dependency: ${name}`);
    },
  };
  vm.runInNewContext(compiled, context);
  const response = {
    statusCode: 200, locals: {}, headers: {},
    setHeader(name, value) { this.headers[name] = value; },
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; },
  };
  let resolveNext;
  const finished = new Promise((resolve) => { resolveNext = resolve; });
  const request = {};
  await exports[privileged ? "requireAdmin" : "requireAdminAccess"](request, response, () => { nextCalls++; resolveNext(); });
  if (existingAdmin) {
    await Promise.race([finished, new Promise((_, reject) => setTimeout(() => reject(new Error("Admin handler did not continue")), 1000))]);
    assert.equal(request.dbUser.id, "isolated-user");
  }
  assert.equal(response.statusCode, expected);
  assert.equal(nextCalls, expected === 200 ? 1 : 0);
  assert.equal(dbCalls, existingAdmin ? 1 : 0, "Only the privileged existing-admin case may read the database stub");
  assert.equal(response.headers["Cache-Control"], "no-store");
}

(async () => {
  await check({ signedIn: false, expected: 401 });
  await check({ email: "visitor@example.invalid", expected: 403 });
  await check({ verified: false, expected: 403 });
  await check({ configured: false, expected: 503 });
  await check({ unavailable: true, expected: 503 });
  await check({ email: "OWNER@example.invalid", expected: 200 });
  await check({ email: "visitor@example.invalid", expected: 403, privileged: true });
  await check({ signedIn: false, expected: 401, privileged: true });
  await check({ expected: 200, privileged: true, existingAdmin: true });
  console.log("PASS: 9 authorization cases, including an existing authorized admin; no network or real database access.");
})().catch((error) => { console.error(error); process.exitCode = 1; });
