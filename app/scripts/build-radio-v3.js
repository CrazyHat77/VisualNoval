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

const coreAnchor = '    function _setApiStatus(state, type, label, error, note) {';
const uiAnchor = '        function renderMain() {';
if (page.indexOf(coreAnchor) < 0) throw new Error('Radio v3 core anchor not found');
if (page.indexOf(uiAnchor) < 0) throw new Error('Radio v3 UI anchor not found');

const core = fs.readFileSync(corePath, 'utf8').trim();
const ui = fs.readFileSync(uiPath, 'utf8').trim();
page = page.replace(coreAnchor, '    ' + CORE_START + '\n' + core + '\n    ' + CORE_END + '\n\n' + coreAnchor);
page = page.replace(uiAnchor, '        ' + UI_START + '\n' + ui + '\n        ' + UI_END + '\n\n' + uiAnchor);

data.pageCode = page;
data.version = '3.0.0-playlist-studio';
data.description = '多主持人私人电台 · 本地多歌单 · 推荐/歌单/陪伴三模式 · 连续台本与高级背景音 · iOS 灰阶圆角 UI';
fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2) + '\n');
console.log('[build-radio-v3] injected core/UI into', jsonPath);
