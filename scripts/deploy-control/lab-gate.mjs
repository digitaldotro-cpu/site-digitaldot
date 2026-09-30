// Laboratory ingress only. Not an OS boundary against direct backend access.
import http from "node:http";
import { setTimeout as delay } from "node:timers/promises";

export async function createLabGate({ port, backendPort }) {
  for (const value of [port, backendPort]) if (!Number.isInteger(value) || value < 0 || value > 65535) throw new Error("invalid-port");
  let open = false, active = 0, uncertain = false;
  const server = http.createServer((req, res) => {
    if (!open) { res.writeHead(503, { "Connection": "close", "Cache-Control": "no-store" }); res.end("Laboratory maintenance"); req.resume(); return; }
    if (!req.url?.startsWith("/") || req.url.startsWith("//")) { res.writeHead(400); res.end(); return; }
    active++;
    let finished = false;
    const done = (failed = false) => { if (finished) return; finished = true; active--; if (failed) { uncertain = true; open = false; } };
    const upstream = http.request({ hostname: "127.0.0.1", port: backendPort, path: req.url, method: req.method,
      headers: { ...req.headers, host: `127.0.0.1:${backendPort}`, connection: "close" }, agent: false }, incoming => {
      res.writeHead(incoming.statusCode, incoming.headers);
      incoming.pipe(res);
      incoming.once("end", () => done());
      incoming.once("error", () => { done(true); res.destroy(); });
      incoming.once("aborted", () => { done(true); res.destroy(); });
    });
    upstream.setTimeout(15000, () => upstream.destroy(new Error("lab-upstream-timeout")));
    upstream.once("error", () => { done(true); if (!res.headersSent) res.writeHead(502); res.end(); });
    req.once("aborted", () => upstream.destroy(new Error("lab-client-aborted")));
    req.pipe(upstream);
  });
  server.requestTimeout = 15000;
  server.headersTimeout = 10000;
  server.on("clientError", (_error, socket) => socket.end("HTTP/1.1 400 Bad Request\r\nConnection: close\r\n\r\n"));
  await new Promise((resolve, reject) => { server.once("error", reject); server.listen(port, "127.0.0.1", resolve); });
  return {
    port: server.address().port,
    state: () => ({ open, active, uncertain }),
    async freeze() {
      open = false;
      const deadline = Date.now() + 20000;
      while (active && Date.now() < deadline) await delay(20);
      if (active || uncertain) throw new Error("lab-drain-uncertain");
    },
    thaw() { if (active || uncertain) throw new Error("lab-gate-not-ready"); open = true; },
    async close() { await this.freeze(); await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve())); },
  };
}
