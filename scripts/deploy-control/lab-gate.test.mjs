import test from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import { createLabGate } from "./lab-gate.mjs";

test("lab gate starts closed, drains an in-flight write, blocks new writes and reopens", async () => {
  let finish, signalStarted;
  const started = new Promise(resolve => { signalStarted = resolve; });
  let writes = 0;
  const backend = http.createServer((req, res) => {
    req.resume();
    if (req.url === "/slow") { finish = () => { writes++; res.end("saved"); }; signalStarted(); }
    else { if (req.method === "PUT") writes++; res.end("ok"); }
  });
  await new Promise(resolve => backend.listen(0, "127.0.0.1", resolve));
  const gate = await createLabGate({ port: 0, backendPort: backend.address().port });
  const url = `http://127.0.0.1:${gate.port}`;
  try {
    let r = await fetch(url, { method: "PUT" }); assert.equal(r.status, 503); await r.text(); assert.equal(writes, 0);
    gate.thaw();
    const pending = fetch(url + "/slow", { method: "PUT" }); await started;
    let drained = false;
    const freezing = gate.freeze().then(() => { drained = true; });
    r = await fetch(url, { method: "PUT" }); assert.equal(r.status, 503); await r.text(); assert.equal(drained, false);
    finish(); await (await pending).text(); await freezing;
    assert.deepEqual(gate.state(), { open: false, active: 0, uncertain: false }); assert.equal(writes, 1);
    gate.thaw(); r = await fetch(url, { method: "PUT" }); assert.equal(r.status, 200); await r.text(); assert.equal(writes, 2);
  } finally { await gate.close(); await new Promise(resolve => backend.close(resolve)); }
});
