@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo 正在启动 Fish Audio 语音本地代理...
echo 这个窗口需要一直保持打开，用 Fish Audio 语音的时候不要关它。
echo.
node fish-tts-proxy.js
pause
