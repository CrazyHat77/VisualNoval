/**
 * VNM Fish Audio TTS Proxy — SillyTavern 服务端插件
 *
 * 作用：Fish Audio 的 /v1/tts 接口不支持浏览器跨域调用（服务器不返回
 * Access-Control-Allow-Origin，预检请求会被浏览器直接拦下），所以
 * "Visual Novel by白桃" 扩展无法从浏览器里直接请求 api.fish.audio。
 *
 * 这个插件运行在酒馆自己的 Node 服务器里（同源，不受 CORS 限制），
 * 由前端把 Fish Audio 的请求参数发到这里，插件在服务器端转发给
 * https://api.fish.audio/v1/tts，再把返回的音频原样传回前端。
 * 全程只经过你自己的电脑，不经过任何第三方中转。
 *
 * 安装：把整个 vnm-fish-tts 文件夹复制到酒馆安装目录下的 plugins/ 里
 * （即 <SillyTavern>/plugins/vnm-fish-tts/），确保酒馆 config.yaml 里
 * enableServerPlugins: true，然后重启酒馆。
 */

const FISH_TTS_URL = 'https://api.fish.audio/v1/tts';

async function init(router) {
  router.post('/tts', async (req, res) => {
    try {
      const { apiKey, model, payload } = req.body || {};
      if (!apiKey) {
        return res.status(400).json({ error: '缺少 Fish Audio API Key' });
      }
      if (!payload || typeof payload !== 'object') {
        return res.status(400).json({ error: '缺少请求体 payload' });
      }

      const upstream = await fetch(FISH_TTS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + apiKey,
          'model': model || 's2-pro',
        },
        body: JSON.stringify(payload),
      });

      if (!upstream.ok) {
        const text = await upstream.text().catch(() => '');
        let msg = text || ('Fish Audio HTTP ' + upstream.status);
        try {
          const j = JSON.parse(text);
          if (j && j.message) msg = j.message;
        } catch (e) { /* not json, keep raw text */ }
        return res.status(upstream.status).json({ error: msg });
      }

      const buf = Buffer.from(await upstream.arrayBuffer());
      res.setHeader('Content-Type', 'audio/mpeg');
      res.send(buf);
    } catch (e) {
      console.error('[vnm-fish-tts]', e);
      res.status(500).json({ error: (e && e.message) || String(e) });
    }
  });

  router.get('/status', (req, res) => {
    res.json({ ok: true, plugin: 'vnm-fish-tts' });
  });

  console.log('[vnm-fish-tts] Fish Audio TTS 本地代理已加载');
}

async function exit() {}

module.exports = {
  init,
  exit,
  info: {
    id: 'vnm-fish-tts',
    name: 'VNM Fish Audio TTS Proxy',
    description: 'Visual Novel by白桃 扩展的 Fish Audio TTS 本地转发代理，规避浏览器 CORS 限制。',
  },
};
