const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const jsonPath = path.join(root, 'src', 'apps', 'vnm-radio.json');
const corePath = path.join(root, 'src', 'apps', 'vnm-radio-v3-core.js');
const uiPath = path.join(root, 'src', 'apps', 'vnm-radio-v3-ui.js');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

const CORE_START = '/*__VNR3_CORE_BEGIN__*/';
const CORE_END = '/*__VNR3_CORE_END__*/';
const UI_START = '/*__VNR3_UI_BEGIN__*/';
const UI_END = '/*__VNR3_UI_END__*/';

function stripBlock(source, start, end) {
  const a = source.indexOf(start);
  if (a < 0) return source;
  const b = source.indexOf(end, a);
  if (b < 0) throw new Error('Found ' + start + ' without ' + end);
  const lineStart = source.lastIndexOf('\n', a) + 1;
  let cursor = b + end.length;
  while (cursor < source.length) {
    const lineEnd = source.indexOf('\n', cursor);
    if (lineEnd < 0) {
      cursor = source.length;
      break;
    }
    if (source.slice(cursor, lineEnd).trim()) break;
    cursor = lineEnd + 1;
  }
  return source.slice(0, lineStart) + source.slice(cursor);
}

let page = String(data.pageCode || '');
page = stripBlock(page, CORE_START, CORE_END);
page = stripBlock(page, UI_START, UI_END);

function replaceRequired(source, from, to, label) {
  if (source.includes(to)) return source;
  if (!source.includes(from)) throw new Error('Radio base patch anchor not found: ' + label);
  return source.replace(from, to);
}

page = replaceRequired(
  page,
  "var script=E('div','vnr2-host-script');script.appendChild(E('div','vnr2-host-live','主持人台本 · 正在播出'));var scriptList=script;var rows=[],seen={};if(eng.current&&eng.current.say){",
  "var script=E('div','vnr2-host-script');var companionLine=eng.v3&&eng.v3.currentContinuousLine?eng.v3.currentContinuousLine():null;script.appendChild(E('div','vnr2-host-live',companionLine?'陪伴台本 · 正在播出':'主持人台本 · 正在播出'));var scriptList=script;var rows=[],seen={};if(companionLine&&companionLine.text){hostName=companionLine.host||hostName;rows.push({item:null,text:(companionLine.host?companionLine.host+'：':'')+companionLine.text});}else if(eng.current&&eng.current.say){",
  'studio live companion sentence'
);
page = replaceRequired(
  page,
  "if(!rows.length)scriptList.appendChild(E('div','vnr2-script-empty','等待当前歌曲的台本…'));",
  "if(!rows.length)scriptList.appendChild(E('div','vnr2-script-empty',companionLine?(companionLine.waiting?'正在准备下一份陪伴台本…':(companionLine.finished?'陪伴台本已播放完毕':'正在准备当前朗读句…')):'等待当前歌曲的台本…'));",
  'studio companion empty state'
);
page = replaceRequired(
  page,
  "return [it.id || '', song.title || '', song.artist || '', it.say || '', it.needsScript ? 'pending' : '', it.scriptFresh ? 'fresh' : ''].join('|');",
  "var companionLine=eng.v3&&eng.v3.currentContinuousLine?eng.v3.currentContinuousLine():null;return [it.id || '', song.title || '', song.artist || '', it.say || '', it.needsScript ? 'pending' : '', it.scriptFresh ? 'fresh' : '', companionLine?JSON.stringify(companionLine):''].join('|');",
  'studio live refresh key'
);
page = replaceRequired(
  page,
  "var h = eng.store.chatHistory || [];\n            if (!h.length) {\n                chatBox.appendChild(E('div', 'vnr2-empty', '还没有连线记录。Enter 只发出消息，右侧按钮才请求回复；按住麦克风说话。'));\n                return;\n            }",
  "var h = eng.store.chatHistory || [];\n            var liveCompanion=eng.v3&&eng.v3.currentContinuousLine?eng.v3.currentContinuousLine():null;\n            if(liveCompanion&&liveCompanion.text){var liveRow=E('div','vnr2-mrow ai');var liveHead=E('div','vnr2-mhead');liveHead.appendChild(E('span','',liveCompanion.host||liveCompanion.versionTitle||'陪伴台本'));liveRow.appendChild(liveHead);liveRow.appendChild(E('div','vnr2-mtext',liveCompanion.text));chatBox.appendChild(liveRow);}\n            if (!h.length) {\n                if(!liveCompanion)chatBox.appendChild(E('div', 'vnr2-empty', '还没有连线记录。Enter 只发出消息，右侧按钮才请求回复；按住麦克风说话。'));\n                return;\n            }",
  'studio companion live chat row'
);

// The v3 core reads FIELDS and wraps the final eng.request/eng.next methods.
// It must run after both the settings table and the engine have been initialized,
// but before ensureShell() creates the radio UI.
const coreAnchor = '    function ensureShell() {';
const uiAnchor = '        function renderMain() {';
if (page.indexOf(coreAnchor) < 0) throw new Error('Radio v3 core anchor not found');
if (page.indexOf(uiAnchor) < 0) throw new Error('Radio v3 UI anchor not found');

const core = fs.readFileSync(corePath, 'utf8').trim();
const ui = fs.readFileSync(uiPath, 'utf8').trim();
page = page.replace(coreAnchor, function() {
  return '    ' + CORE_START + '\n' + core + '\n    ' + CORE_END + '\n\n' + coreAnchor;
});
page = page.replace(uiAnchor, function() {
  return '        ' + UI_START + '\n' + ui + '\n        ' + UI_END + '\n\n' + uiAnchor;
});

data.pageCode = page;
data.version = '3.9.2-optional-radio-history';
data.description = '多主持人私人电台 · 可关闭最近主播对话注入 · 请求路由与返回解析诊断 · 主持人话轮语音缓存';
fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2) + '\n');
console.log('[build-radio-v3] injected core/UI into', jsonPath);
