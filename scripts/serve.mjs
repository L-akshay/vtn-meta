import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { gzipSync } from 'node:zlib';
const root = path.resolve('out');
const types = { '.html':'text/html; charset=utf-8', '.txt':'text/plain', '.js':'text/javascript', '.css':'text/css', '.svg':'image/svg+xml', '.png':'image/png', '.webp':'image/webp', '.avif':'image/avif', '.woff2':'font/woff2', '.json':'application/json' };
http.createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    let file = path.resolve(root, '.' + pathname);
    if (file !== root && !file.startsWith(root + path.sep)) { res.writeHead(403); res.end(); return; }
    try { if ((await fs.stat(file)).isDirectory()) file = path.join(file, 'index.html'); }
    catch { if (!path.extname(file)) file = path.join(file, 'index.html'); }
    const data = await fs.readFile(file);
    const headers = {'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'X-Robots-Tag':'noindex, nofollow', 'X-Content-Type-Options':'nosniff'};
    if (pathname.startsWith('/_next/static/')) headers['Cache-Control'] = 'public, max-age=31536000, immutable';
    if (/\.(html|js|css|svg|txt|json)$/.test(file) && req.headers['accept-encoding']?.includes('gzip')) {
      headers['Content-Encoding'] = 'gzip'; headers.Vary = 'Accept-Encoding';
      res.writeHead(200, headers); res.end(gzipSync(data));
    } else { res.writeHead(200, headers); res.end(data); }
  } catch { res.writeHead(404, {'Content-Type':'text/html'}); res.end(await fs.readFile(path.join(root,'404.html')).catch(()=>'Not found')); }
}).listen(4173, '0.0.0.0', () => console.log('Static preview: http://localhost:4173'));
