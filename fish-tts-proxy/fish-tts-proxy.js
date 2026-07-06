#!/usr/bin/env node
/**
 * VNM Fish Audio TTS 本地代理（独立小进程，不依赖酒馆）
 *
 * 为什么需要它：Fish Audio 的 /v1/tts 接口不支持浏览器直接跨域调用
 * （不返回 Access-Control-Allow-Origin，预检请求会被浏览器拦下）。
 * 之前尝试借用 SillyTavern 自己的 /proxy/ 转发，但那条路由要求酒馆
 * 的登录会话 cookie 才能通过，环境不同表现不一致，容易失败。
 *
 * 这个脚本是完全独立的小 HTTP 服务器，只做一件事：接收前端发来的
 * Fish Audio 请求参数，在这台电脑本地转发给 https://api.fish.audio/v1/tts，
 * 再把音频原样传回来，并且自己加上允许跨域的响应头。不经过酒馆的任何
 * 鉴权逻辑，也不经过任何第三方服务器。
 *
 * 用法：
 *   node fish-tts-proxy.js
 * 或者直接双击同目录下的 启动.bat（Windows）。
 * 默认监听 127.0.0.1:8765，可用环境变量 PORT 换端口。
 *
 * 需要 Node.js 18 及以上版本（用到内置的全局 fetch）。
 */

const http = require('http');

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 8765;

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

const server = http.createServer((req, res) => {
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
        // 直接把上游的流原样转发下去，不等全部生成完再发，减少多一趟缓冲的延迟
        const { Readable } = require('stream');
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
});

server.listen(PORT, '127.0.0.1', () => {
  console.log('[vnm-fish-tts-proxy] 已启动，监听 http://127.0.0.1:' + PORT);
  console.log('[vnm-fish-tts-proxy] 这个窗口需要保持打开状态，关闭窗口代理就会停止。');
});
