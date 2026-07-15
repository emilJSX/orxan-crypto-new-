// Продакшен-сервер без внешних зависимостей.
// Раздаёт собранный фронтенд из папки dist/ и пишет IPv4 в ip-log.txt.
//
// Как запустить:
//   npm run build
//   node server.js
// затем откройте http://localhost:3000
//
// Если сервер стоит за прокси/nginx — убедитесь, что проксируется
// заголовок X-Forwarded-For, иначе IP будет адресом самого прокси.

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.join(__dirname, 'dist');
const LOG_FILE = path.join(__dirname, 'ip-log.txt');
const PORT = process.env.PORT || 3000;

const IPV4_RE =
  /^(25[0-5]|2[0-4]\d|1?\d?\d)(\.(25[0-5]|2[0-4]\d|1?\d?\d)){3}$/;

const MIME = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
};

function normalizeIp(raw) {
  if (!raw) return null;
  let ip = String(raw).split(',')[0].trim();
  if (ip.startsWith('::ffff:')) ip = ip.slice('::ffff:'.length);
  return ip;
}

function logIp(req, res) {
  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
    if (body.length > 10_000) req.destroy();
  });
  req.on('end', () => {
    let clientIp = null;
    let username = null;
    const ua = req.headers['user-agent'] || '';
    try {
      const data = JSON.parse(body || '{}');
      clientIp = data.ip || null;
      username = data.username || null;
    } catch {}

    const connIp = normalizeIp(
      req.headers['x-forwarded-for'] || req.socket.remoteAddress
    );
    const ipv4 =
      [clientIp, connIp].find((x) => x && IPV4_RE.test(x)) ||
      clientIp ||
      connIp ||
      'unknown';

    const line = `${new Date().toISOString()}\t${ipv4}\t${username || '-'}\t${ua}\n`;
    fs.appendFile(LOG_FILE, line, (err) => {
      res.writeHead(err ? 500 : 200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(err ? { ok: false } : { ok: true, ip: ipv4 }));
    });
  });
}

function serveStatic(req, res) {
  let urlPath = decodeURIComponent(req.url.split('?')[0]);
  if (urlPath === '/') urlPath = '/index.html';

  let filePath = path.join(DIST_DIR, urlPath);
  // защита от выхода за пределы dist/
  if (!filePath.startsWith(DIST_DIR)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.readFile(filePath, (err, content) => {
    if (err) {
      // SPA fallback — всё, что не найдено, отдаём как index.html
      fs.readFile(path.join(DIST_DIR, 'index.html'), (e2, html) => {
        if (e2) {
          res.writeHead(404);
          res.end('Not found. Сначала выполните: npm run build');
          return;
        }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(html);
      });
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(content);
  });
}

http
  .createServer((req, res) => {
    if (req.method === 'POST' && req.url.startsWith('/api/log-ip')) {
      logIp(req, res);
      return;
    }
    serveStatic(req, res);
  })
  .listen(PORT, () => {
    console.log(`Сервер запущен: http://localhost:${PORT}`);
    console.log(`IPv4-адреса пишутся в: ${LOG_FILE}`);
  });
