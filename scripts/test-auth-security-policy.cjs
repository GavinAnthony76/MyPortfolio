// Exercise the actual Helmet configuration without starting the app or auth.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const ts = require("typescript");
const helmet = require("helmet");
const source = ts.createSourceFile(
  "routes.ts",
  fs.readFileSync("server/routes.ts", "utf8"),
  ts.ScriptTarget.Latest,
  true,
);
let options;
function visit(node) {
  if (ts.isCallExpression(node) && node.expression.getText(source) === "helmet") {
    options = node.arguments[0].getText(source);
  }
  ts.forEachChild(node, visit);
}
visit(source);
assert.ok(options, "Helmet configuration must be present");

for (const environment of ["production", "development"]) {
  const middleware = vm.runInNewContext(`helmet(${options})`, {
    helmet,
    process: { env: { NODE_ENV: environment } },
  });
  const headers = new Map();
  let continued = false;
  middleware({ headers: {} }, {
    setHeader: (name, value) => headers.set(name.toLowerCase(), value),
    removeHeader: (name) => headers.delete(name.toLowerCase()),
    getHeader: (name) => headers.get(name.toLowerCase()),
  }, (error) => {
    assert.ifError(error);
    continued = true;
  });
  assert.ok(continued);
  const csp = headers.get("content-security-policy");
  if (environment === "development") {
    assert.equal(csp, undefined);
    continue;
  }
  assert.match(csp, /(?:^|;)worker-src 'self' blob:(?:;|$)/);
  assert.match(csp, /(?:^|;)frame-src 'self' /);
  assert.match(csp, /(?:^|;)frame-src [^;]*https:\/\/challenges\.cloudflare\.com/);
  assert.doesNotMatch(csp, /(?:^|;)script-src [^;]*blob:/);
  assert.match(csp, /(?:^|;)object-src 'none'(?:;|$)/);
}
console.log("PASS: production auth workers/frames permitted, script restrictions retained, preview policy unchanged.");
