/**
 * 共用逻辑：创建一个只做 Fish Audio TTS 转发的原始 http.Server。
 * 被两个入口复用：
 *   - fish-tts-proxy.js（手动双击 启动.bat 运行的独立进程）
 *   - index.js（作为酒馆服务端插件，随酒馆自动启动）
 *
 * 两种用法跑的是完全一样的这段代码、监听同一个端口，性能没有任何区别，
 * 区别只在于"谁来启动这个进程"。
 */

const http = require('http');
const { Readable } = require('stream');

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function requestHandler(req, res) {
  setCors(res);

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === 'GET' && req.url === '/status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true, proxy: 'vnm-fish-tts-proxy' }));
    return;
  }

  if (req.method === 'POST' && req.url === '/tts') {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', async () => {
      try {
        const raw = Buffer.concat(chunks).toString('utf8');
        let parsed;
        try {
          parsed = JSON.parse(raw);
        } catch (e) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: '请求体不是合法 JSON' }));
          return;
        }
        const { apiKey, model, payload } = parsed || {};
        if (!apiKey) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: '缺少 Fish Audio API Key' }));
          return;
        }
        if (!payload || typeof payload !== 'object') {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: '缺少请求体 payload' }));
          return;
        }

        const upstream = await fetch('https://api.fish.audio/v1/tts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + apiKey,
            'model': model || 's2.1-pro',
          },
          body: JSON.stringify(payload),
        });

        if (!upstream.ok) {
          const text = await upstream.text().catch(() => '');
          let msg = text || ('Fish Audio HTTP ' + upstream.status);
          try {
            const j = JSON.parse(text);
            if (j && j.message) msg = j.message;
          } catch (e2) { /* not json */ }
          res.writeHead(upstream.status, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: msg }));
          return;
        }

        res.writeHead(200, { 'Content-Type': 'audio/mpeg' });
        Readable.fromWeb(upstream.body).pipe(res);
      } catch (e) {
        console.error('[vnm-fish-tts-proxy]', e);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: (e && e.message) || String(e) }));
      }
    });
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'not found' }));
}

/**
 * 启动服务器。返回 http.Server 实例（可以自己 .close() 掉）。
 * 端口被占用（比如手动开了一份，插件又想再开一份）时不会报错崩掉整个进程，
 * 只是打一行日志说明已经有一个在跑了。
 */
function startServer(port) {
  const server = http.createServer(requestHandler);
  server.on('error', (e) => {
    if (e && e.code === 'EADDRINUSE') {
      console.log('[vnm-fish-tts-proxy] 端口 ' + port + ' 已经有进程在监听了（可能你手动开了一份），跳过，不重复启动。');
    } else {
      console.error('[vnm-fish-tts-proxy] 启动失败:', e);
    }
  });
  server.listen(port, '127.0.0.1', () => {
    console.log('[vnm-fish-tts-proxy] 已启动，监听 http://127.0.0.1:' + port);
  });
  return server;
}

module.exports = { startServer };
