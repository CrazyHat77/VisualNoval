/**
 * Visual Novel by白桃 — 酒馆助手自动更新 loader
 *
 * 这是一个"导入一次、之后自动更新"的酒馆助手脚本。
 * 它在启动时从 GitHub(经 jsDelivr CDN) 拉取最新的正则定义
 *   app/dist/vn_visual_novel-by白桃.json
 * 把它映射成酒馆正则(TavernRegex)，并用 replaceTavernRegexes 装到全局正则。
 *
 * 这样：作者更新 GitHub 上的源码并 build 后，用户端下次启动会自动拿到新版，
 * 不需要重新手动导入正则。
 *
 * 通过 window.VNLG_LOADER_REF / window.VNLG_LOADER_CONFIG 可手动锁版本或换源。
 */
(function () {
  'use strict';

  // === 配置（build-loader.js 会注入仓库名）=================================
  const REPOSITORY = '__REPOSITORY__';          // e.g. "owner/vn_visual_novel-by-baitao"
  const DEFAULT_REF = 'main';
  const REGEX_PATH = 'app/dist/vn_visual_novel-by白桃.json';
  const REGEX_ID_FALLBACK = 'vn-by-baitao-managed';
  const LOG = '[VN-LG Loader]';
  // =========================================================================

  const root = resolveRoot();
  const cfg = resolveConfig();

  main().catch((err) => {
    console.error(LOG, '启动失败：', err);
    toast('Visual Novel 自动更新失败：' + (err && err.message || err), 'error');
  });

  async function main() {
    const helper = getHelper();
    if (!helper || typeof helper.replaceTavernRegexes !== 'function') {
      throw new Error('未找到 TavernHelper.replaceTavernRegexes，请确认已安装并启用酒馆助手。');
    }
    const source = await fetchLatestRegex();
    const tavernRegex = mapToTavernRegex(source);
    await installRegex(helper, tavernRegex);
    console.info(LOG, '已安装/更新正则：', tavernRegex.script_name);
    toast('Visual Novel 已更新到最新版：' + tavernRegex.script_name, 'success');
    if (cfg.apps !== false) await installApps();
  }

  // 预装/更新功能系统 App(缺失或版本落后才拉取, 保留玩家已有设置)
  async function installApps() {
    try {
      const fetchFn = getFetch();
      if (!fetchFn) return;
      const ref = cfg.ref || DEFAULT_REF;
      const base = cfg.base || `https://cdn.jsdelivr.net/gh/${REPOSITORY}@${ref}`;
      const manifest = await fetchJson(fetchFn, `${base}/app/dist/apps-manifest.json?vnlg_t=${Date.now()}`);
      if (!manifest || !Array.isArray(manifest) || !manifest.length) return;
      let sbRaw = null;
      try { sbRaw = root.localStorage.getItem('vnm-statusbar-v2'); } catch (e) {}
      let sbS = {};
      try { sbS = JSON.parse(sbRaw || '{}') || {}; } catch (e) {}
      const apps = Array.isArray(sbS.vnmApps) ? sbS.vnmApps : [];
      let changed = false, installed = 0, updated = 0;
      for (const item of manifest) {
        if (!item || !item.id || !item.file) continue;
        const curIdx = apps.findIndex(a => a && a.id === item.id);
        const cur = curIdx >= 0 ? apps[curIdx] : null;
        if (cur && !verNewer(item.version, cur.version || '0')) continue;
        const p = await fetchJson(fetchFn, `${base}/app/src/apps/${item.file}?vnlg_t=${Date.now()}`);
        if (!p || !p.vnmPlugin || !p.id) continue;
        const entry = {
          id: p.id, name: p.name, version: p.version || '1.0', description: p.description || '',
          icon: p.icon || '<circle cx="12" cy="12" r="5"/>', enabled: true,
          settingsTitle: p.settingsTitle || p.name, settingsFields: p.settingsFields || [],
          settingsValues: cur && cur.settingsValues ? cur.settingsValues : {},
          pageCode: p.pageCode || '', injectCode: p.injectCode || '', injectEnabled: !!(p.injectEnabled)
        };
        (p.settingsFields || []).forEach(f => {
          if (entry.settingsValues[f.key] === undefined && f.default !== undefined) entry.settingsValues[f.key] = f.default;
        });
        if (curIdx >= 0) { apps[curIdx] = entry; updated++; }
        else { apps.push(entry); installed++; }
        changed = true;
      }
      if (changed) {
        sbS.vnmApps = apps;
        try { root.localStorage.setItem('vnm-statusbar-v2', JSON.stringify(sbS)); } catch (e) {}
      }
      if (installed || updated) toast('功能系统 App 已就绪：新增 ' + installed + ' 个，更新 ' + updated + ' 个', 'info');
      else console.info(LOG, 'App 均为最新');
    } catch (e) {
      console.warn(LOG, 'App 预装失败(不影响正则更新)：', e && e.message || e);
    }
  }

  async function fetchJson(fetchFn, url) {
    try {
      const r = await fetchFn(url, { cache: 'no-store' });
      if (!r || !r.ok) return null;
      return r.json();
    } catch (e) { return null; }
  }

  // 版本比较: a > b ?
  function verNewer(a, b) {
    const pa = String(a || '0').split('.'), pb = String(b || '0').split('.');
    for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
      const x = parseInt(pa[i] || '0', 10), y = parseInt(pb[i] || '0', 10);
      if (x !== y) return x > y;
    }
    return false;
  }

  // 拉取最新正则 JSON（带 main 提交哈希以绕过 CDN 缓存）
  async function fetchLatestRegex() {
    const fetchFn = getFetch();
    if (!fetchFn) throw new Error('当前环境不支持 fetch。');
    const ref = cfg.ref || (await fetchLatestCommit(fetchFn)) || DEFAULT_REF;
    const base = cfg.base || `https://cdn.jsdelivr.net/gh/${REPOSITORY}@${ref}`;
    const url = `${base}/${REGEX_PATH}?vnlg_t=${Date.now()}`;
    const resp = await fetchFn(url, { cache: 'no-store' });
    if (!resp || !resp.ok) {
      // 回退 @main
      const fb = `https://cdn.jsdelivr.net/gh/${REPOSITORY}@main/${REGEX_PATH}?vnlg_t=${Date.now()}`;
      const r2 = await fetchFn(fb, { cache: 'no-store' });
      if (!r2 || !r2.ok) throw new Error('远程正则拉取失败：' + url);
      return r2.json();
    }
    return resp.json();
  }

  async function fetchLatestCommit(fetchFn) {
    try {
      const u = `https://api.github.com/repos/${REPOSITORY}/branches/main?vnlg_t=${Date.now()}`;
      const r = await fetchFn(u, { cache: 'no-store' });
      if (!r || !r.ok) return '';
      const j = await r.json();
      const sha = j && j.commit && j.commit.sha;
      return /^[a-f0-9]{40}$/i.test(sha || '') ? sha : '';
    } catch (e) {
      return '';
    }
  }

  // SillyTavern 正则导出格式 -> 酒馆助手 TavernRegex
  function mapToTavernRegex(s) {
    const placement = Array.isArray(s.placement) ? s.placement : [];
    return {
      id: s.id || REGEX_ID_FALLBACK,
      script_name: s.scriptName || 'Visual Novel by白桃',
      enabled: !s.disabled,
      find_regex: s.findRegex || '',
      replace_string: s.replaceString || '',
      trim_strings: Array.isArray(s.trimStrings) ? s.trimStrings : [],
      source: {
        user_input: placement.includes(1),
        ai_output: placement.includes(2),
        slash_command: placement.includes(5),
        world_info: placement.includes(6),
      },
      destination: {
        // markdownOnly = 仅格式显示; promptOnly = 仅格式提示词
        display: s.markdownOnly === true || s.promptOnly !== true,
        prompt: s.promptOnly === true,
      },
      run_on_edit: s.runOnEdit !== false,
      min_depth: s.minDepth == null ? null : s.minDepth,
      max_depth: s.maxDepth == null ? null : s.maxDepth,
    };
  }

  // 按 id/名称 upsert 到全局正则
  async function installRegex(helper, reg) {
    const option = { type: 'global' };
    if (typeof helper.updateTavernRegexesWith === 'function') {
      await helper.updateTavernRegexesWith((regexes) => {
        const list = Array.isArray(regexes) ? regexes.slice() : [];
        const idx = list.findIndex(
          (r) => r.id === reg.id || r.script_name === reg.script_name
        );
        if (idx >= 0) list[idx] = reg;
        else list.push(reg);
        return list;
      }, option);
      return;
    }
    // 退路：getTavernRegexes + replaceTavernRegexes
    const cur = helper.getTavernRegexes ? helper.getTavernRegexes(option) : [];
    const list = Array.isArray(cur) ? cur.slice() : [];
    const idx = list.findIndex((r) => r.id === reg.id || r.script_name === reg.script_name);
    if (idx >= 0) list[idx] = reg; else list.push(reg);
    await helper.replaceTavernRegexes(list, option);
  }

  // === 小工具 ===============================================================
  function resolveRoot() {
    try { if (window.parent && window.parent.document) return window.parent; } catch (e) {}
    return window;
  }
  function resolveConfig() {
    const u = (root.VNLG_LOADER_CONFIG && typeof root.VNLG_LOADER_CONFIG === 'object') ? root.VNLG_LOADER_CONFIG : {};
    return {
      ref: String(u.ref || root.VNLG_LOADER_REF || '').trim(),
      base: String(u.base || root.VNLG_LOADER_BASE || '').replace(/\/+$/, ''),
      apps: u.apps !== false,
    };
  }
  function getHelper() {
    return root.TavernHelper || (typeof TavernHelper !== 'undefined' ? TavernHelper : null) ||
      (typeof window !== 'undefined' ? window.TavernHelper : null);
  }
  function getFetch() {
    return root.fetch ? root.fetch.bind(root) : (typeof fetch === 'function' ? fetch : null);
  }
  function toast(msg, kind) {
    try {
      if (root.toastr && root.toastr[kind || 'info']) { root.toastr[kind || 'info'](msg, 'Visual Novel'); return; }
    } catch (e) {}
    console.info(LOG, msg);
  }
})();
