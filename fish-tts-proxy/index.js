/**
 * VNM Fish Audio TTS 本地代理 —— 酒馆服务端插件入口（自动启动）
 *
 * 把这个 fish-tts-proxy 文件夹整个放进 <酒馆目录>/plugins/ 里，
 * 并在酒馆 config.yaml 打开 enableServerPlugins: true，重启酒馆，
 * 这个代理就会跟着酒馆一起自动启动，不用每次手动双击 启动.bat 了。
 *
 * 注意：这里没有把请求挂在酒馆给的 router 上，而是自己另开一个原始的
 * http.Server 监听独立端口（默认 8765）。这是刻意的：酒馆自身的路由
 * （包括 /api/plugins/... 和 /proxy/...）都要求带上酒馆的登录会话
 * cookie 才能通过，环境不同容易出问题（之前踩过这个坑）。自己开一个
 * 完全独立的端口，不经过酒馆的任何鉴权逻辑，最稳。
 *
 * 性能上和手动运行 fish-tts-proxy.js 完全一样，都是同一份转发代码、
 * 同一个端口，只是换成由酒馆在启动时自动帮你跑起来。
 */

const { startServer } = require('./server-core');

let server = null;

async function init(router) {
  const port = process.env.VNM_FISH_PROXY_PORT
    ? parseInt(process.env.VNM_FISH_PROXY_PORT, 10)
    : 8765;
  server = startServer(port);
}

async function exit() {
  if (server) {
    try { server.close(); } catch (e) { /* ignore */ }
    server = null;
  }
}

module.exports = {
  init,
  exit,
  info: {
    id: 'vnm-fish-tts-proxy',
    name: 'VNM Fish Audio TTS Proxy (auto-start)',
    description: 'Visual Novel by白桃 扩展用的 Fish Audio TTS 本地转发代理，随酒馆自动启动，不需要每次手动双击运行。',
  },
};
