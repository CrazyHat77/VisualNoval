# vnm-fish-tts（Fish Audio 本地代理插件）

## 这是什么 / 为什么需要它

Fish Audio 的 `/v1/tts` 接口只支持服务器端调用，浏览器直接请求会被 CORS
拦下（Fish Audio 不返回 `Access-Control-Allow-Origin`）。"Visual Novel
by白桃" 扩展如果想用 Fish Audio 语音，就需要这个小插件跑在酒馆自己的
Node 服务器里，帮忙把请求转发给 Fish Audio，再把音频传回来。全程只经过
你自己的电脑，不会经过任何第三方服务器，也没有额外的限流。

不装这个插件的话，全局设置里把语音源切到 Fish Audio 会直接报错提示你
"未检测到本地代理插件"；MiniMax 语音不受影响，MiniMax 服务器本身支持
浏览器直连。

## 安装步骤

1. 找到你的 SillyTavern 安装目录（有 `config.yaml`、`public/` 那个目录）。
2. 把这个 `vnm-fish-tts` 整个文件夹复制到 `<SillyTavern 目录>/plugins/` 下面，
   变成 `<SillyTavern 目录>/plugins/vnm-fish-tts/`。
3. 打开 `<SillyTavern 目录>/config.yaml`，找到（或新增）：
   ```yaml
   enableServerPlugins: true
   ```
4. 完全重启酒馆（不是刷新网页，是重启 Node 进程/重启 start.bat）。
5. 重启后控制台应该能看到一行日志：`[vnm-fish-tts] Fish Audio TTS 本地代理已加载`。
6. 回到浏览器，在 VN 插件设置里把语音源切到 Fish Audio、填好 API Key，
   就能正常调用了。

## 自检

浏览器访问 `http://127.0.0.1:8000/api/plugins/vnm-fish-tts/status`
（把端口换成你酒馆实际监听的端口），能看到 `{"ok":true,...}` 就说明插件已生效。
