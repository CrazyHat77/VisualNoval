#!/usr/bin/env node
/**
 * VNM Fish Audio TTS 本地代理 —— 独立进程入口（手动运行）
 *
 * 双击同目录下的 启动.bat，或者命令行 `node fish-tts-proxy.js` 启动。
 * 默认监听所有网络接口的 8765 端口，可用环境变量 PORT/HOST 修改。
 * 需要 Node.js 18 及以上版本（用到内置的全局 fetch）。
 *
 * 如果你不想每次都手动启动，也可以改用 index.js 那种方式，把这个文件夹
 * 整个放进酒馆的 plugins/ 目录，让它随酒馆自动启动，见同目录 README。
 */

const { startServer } = require('./server-core');

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 8765;
const HOST = process.env.HOST || '0.0.0.0';

startServer(PORT, HOST);
console.log('[vnm-fish-tts-proxy] 这个窗口需要保持打开状态，关闭窗口代理就会停止。');
