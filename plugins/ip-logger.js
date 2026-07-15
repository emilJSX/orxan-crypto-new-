// Vite-плагин: записывает IPv4-адрес устройства в отдельный файл при логине.
// Работает и в `npm run dev`, и в `npm run preview`.
// Никаких дополнительных npm-зависимостей не требует.

import fs from 'node:fs';
import path from 'node:path';

// Куда пишем лог. Файл создаётся автоматически в корне проекта.
const LOG_FILE = path.resolve(process.cwd(), 'ip-log.txt');

const IPV4_RE =
  /^(25[0-5]|2[0-4]\d|1?\d?\d)(\.(25[0-5]|2[0-4]\d|1?\d?\d)){3}$/;

// Приводим адрес к чистому виду: берём первый адрес из цепочки прокси
// и убираем IPv6-обёртку вида "::ffff:1.2.3.4".
function normalizeIp(raw) {
  if (!raw) return null;
  let ip = String(raw).split(',')[0].trim();
  if (ip.startsWith('::ffff:')) ip = ip.slice('::ffff:'.length);
  return ip;
}

// Обработчик POST /api/log-ip
function handleLogIp(req, res) {
  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
    if (body.length > 10_000) req.destroy(); // защита от слишком больших тел
  });

  req.on('end', () => {
    let clientIp = null;
    let username = null;
    const ua = req.headers['user-agent'] || '';

    try {
      const data = JSON.parse(body || '{}');
      clientIp = data.ip || null;         // публичный IPv4, определённый на клиенте
      username = data.username || null;
    } catch {
      /* тело не JSON — игнорируем */
    }

    // IP из самого сетевого соединения (или из заголовка прокси).
    const connIp = normalizeIp(
      req.headers['x-forwarded-for'] || req.socket.remoteAddress
    );

    // Выбираем настоящий IPv4: сначала то, что прислал клиент, потом соединение.
    const ipv4 =
      [clientIp, connIp].find((x) => x && IPV4_RE.test(x)) ||
      clientIp ||
      connIp ||
      'unknown';

    const line = `${new Date().toISOString()}\t${ipv4}\t${username || '-'}\t${ua}\n`;

    fs.appendFile(LOG_FILE, line, (err) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ ok: false }));
        return;
      }
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ ok: true, ip: ipv4 }));
    });
  });
}

// Регистрируем middleware и в dev-, и в preview-сервере Vite.
function attach(server) {
  server.middlewares.use('/api/log-ip', (req, res, next) => {
    if (req.method !== 'POST') return next();
    handleLogIp(req, res);
  });
}

export default function ipLogger() {
  return {
    name: 'ip-logger',
    configureServer(server) {
      attach(server);
    },
    configurePreviewServer(server) {
      attach(server);
    },
  };
}
