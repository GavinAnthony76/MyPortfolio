#!/usr/bin/env node

const url = process.argv[process.argv.indexOf("--url") + 1];
if (!url) {
  console.error("Usage: npm run diag:objects -- --url https://...");
  process.exit(1);
}

async function diagnose() {
  console.log(`Diagnosing: ${url}\n`);

  try {
    // HEAD request
    const head = await fetch(url, { method: "HEAD" });
    console.log("HEAD", head.status, head.headers.get("content-length"), head.headers.get("content-type"));

    // GET request
    const getRes = await fetch(url);
    const getBuf = Buffer.from(await getRes.arrayBuffer());
    console.log("GET", getRes.status, "bytes:", getBuf.length);

    // Range request
    const r = await fetch(url, { headers: { Range: "bytes=0-0" } });
    const rBuf = Buffer.from(await r.arrayBuffer());
    console.log("RANGE", r.status, "bytes:", rBuf.length);

    // Additional diagnostics
    console.log("\nAdditional Headers:");
    console.log("Cache-Control:", getRes.headers.get("cache-control"));
    console.log("ETag:", getRes.headers.get("etag"));
    console.log("Content-Encoding:", getRes.headers.get("content-encoding"));

    if (getBuf.length > 0 && getBuf.length < 100) {
      console.log("\nFirst bytes (as text):", getBuf.toString('utf8').substring(0, 50));
      console.log("First bytes (as hex):", getBuf.subarray(0, Math.min(20, getBuf.length)).toString('hex'));
    }

  } catch (error) {
    console.error("Error during diagnosis:", error);
    process.exit(1);
  }
}

diagnose();