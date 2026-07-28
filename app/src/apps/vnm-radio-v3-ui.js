/* vnm-radio v3 UI augmentation.
 * Inserted inside ensureShell(), where E/ib/icon2/renderMain helpers exist.
 */
(function vnr3InstallUi() {
    if (!eng.v3 || shell.__v3UiInstalled) return;
    shell.__v3UiInstalled = true;
    var v3 = eng.v3;

    st.textContent += [
        '.vnr3-btn{appearance:none;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.07);color:inherit;border-radius:14px;padding:10px 14px;font:inherit;cursor:pointer;transition:.18s ease}',
        '.vnr3-btn:hover{background:rgba(255,255,255,.12);transform:translateY(-1px)}',
        '.vnr3-btn.primary{background:rgba(255,255,255,.17);border-color:rgba(255,255,255,.2)}',
        '.vnr3-btn.danger{background:rgba(0,0,0,.18)}',
        '.vnr3-btn.icon{width:36px;height:36px;padding:0;border-radius:50%;font-size:20px}',
        '.vnr3-btn.choice{width:100%;display:flex;flex-direction:column;align-items:flex-start;gap:4px;text-align:left}',
        '.vnr3-choice-note,.vnr3-hint,.vnr3-sub,.vnr3-card-sub,.vnr3-detail-sub{opacity:.58;font-size:12px}',
        '.vnr3-shade{position:absolute;inset:0;z-index:80;background:rgba(8,9,12,.48);backdrop-filter:blur(14px);display:flex;align-items:center;justify-content:center;padding:20px}',
        '.vnr3-modal{width:min(560px,94vw);max-height:min(760px,88vh);overflow:auto;border:1px solid rgba(255,255,255,.12);border-radius:26px;background:rgba(40,43,50,.94);box-shadow:0 28px 90px rgba(0,0,0,.38);padding:18px;color:#f2f2f3}',
        '.vnr3-modal-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px}.vnr3-modal-title{font-size:18px;font-weight:650}',
        '.vnr3-choice-list,.vnr3-advanced{display:grid;gap:9px}.vnr3-field{display:grid;gap:7px;margin:11px 0}.vnr3-label{font-size:12px;opacity:.65}',
        '.vnr3-input,.vnr3-search,.vnr3-node-text{box-sizing:border-box;width:100%;border:1px solid rgba(255,255,255,.1);border-radius:14px;background:rgba(0,0,0,.16);color:inherit;padding:11px 13px;outline:none;font:inherit}',
        '.vnr3-input:focus,.vnr3-search:focus,.vnr3-node-text:focus{border-color:rgba(255,255,255,.3);background:rgba(0,0,0,.22)}',
        'textarea.vnr3-input,.vnr3-node-text{min-height:92px;resize:vertical}',
        '.vnr3-ops,.vnr3-inline-ops{display:flex;flex-wrap:wrap;gap:8px;justify-content:flex-end;margin-top:15px}.vnr3-inline-ops{justify-content:flex-start}',
        '.vnr3-toggle-row{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:11px 0}',
        '.vnr3-toolbar{display:flex;align-items:end;justify-content:space-between;gap:14px;margin:8px 0 18px}.vnr3-title{font-size:20px;font-weight:650}.vnr3-search{max-width:240px}',
        '.vnr3-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(142px,1fr));gap:18px}',
        '.vnr3-pl-card{min-width:0;cursor:pointer;border-radius:20px;padding:10px;background:rgba(255,255,255,.035);transition:.18s ease}',
        '.vnr3-pl-card:hover{background:rgba(255,255,255,.08);transform:translateY(-2px)}',
        '.vnr3-pl-cover,.vnr3-add-cover,.vnr3-detail-cover{position:relative;aspect-ratio:1/1;overflow:hidden;border-radius:17px;background:linear-gradient(145deg,rgba(255,255,255,.12),rgba(0,0,0,.15));box-shadow:0 12px 30px rgba(0,0,0,.18)}',
        '.vnr3-pl-cover img,.vnr3-detail-cover img{width:100%;height:100%;object-fit:cover}.vnr3-default-cover,.vnr3-add-cover{height:100%;display:grid;place-items:center;color:rgba(255,255,255,.52);font-size:34px}',
        '.vnr3-current-chip{position:absolute;left:8px;bottom:8px;padding:4px 7px;border-radius:9px;background:rgba(20,20,22,.7);backdrop-filter:blur(8px);font-size:10px}',
        '.vnr3-card-name{font-weight:620;margin-top:9px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
        '.vnr3-add-cover{aspect-ratio:1/1;border:1px dashed rgba(255,255,255,.2);box-shadow:none;font-size:38px}',
        '.vnr3-detail-head{display:grid;grid-template-columns:150px 1fr;gap:22px;align-items:end;margin:8px 0 20px}.vnr3-detail-title{font-size:26px;font-weight:680;margin:5px 0}.vnr3-kicker{font-size:10px;letter-spacing:.16em;opacity:.52}',
        '.vnr3-song-list,.vnr3-node-list{display:grid;gap:7px}.vnr3-song-row,.vnr3-node,.vnr3-persona{border:1px solid rgba(255,255,255,.08);border-radius:17px;background:rgba(255,255,255,.035);padding:12px}',
        '.vnr3-song-row{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:12px}.vnr3-song-title{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
        '.vnr3-track-list{display:grid;gap:7px}.vnr3-track{display:grid;grid-template-columns:26px 42px minmax(0,1fr) auto auto;align-items:center;gap:10px;border-radius:16px;padding:8px;background:rgba(255,255,255,.035)}',
        '.vnr3-check{width:20px;height:20px;border:1px solid rgba(255,255,255,.2);border-radius:7px;background:transparent}.vnr3-check.on:after{content:"✓";color:#eee}.vnr3-track-pic{width:42px;height:42px;border-radius:11px;overflow:hidden;display:grid;place-items:center;background:rgba(255,255,255,.08)}.vnr3-track-pic img{width:100%;height:100%;object-fit:cover}.vnr3-track-title,.vnr3-track-sub{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.vnr3-track-sub{opacity:.55;font-size:11px}',
        '.vnr3-speech-node,.vnr3-pause-node{border:1px solid rgba(255,255,255,.08);border-radius:17px;background:rgba(255,255,255,.035);padding:12px}.vnr3-pause-node{display:flex;align-items:center;justify-content:center;gap:10px;border-style:dashed}.vnr3-pause-input{width:70px;border:1px solid rgba(255,255,255,.1);border-radius:10px;background:rgba(0,0,0,.15);color:inherit;padding:8px}.vnr3-node-ops{display:flex;flex-wrap:wrap;gap:7px;margin-top:8px}',
        '.vnr3-node-head,.vnr3-persona-head{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:8px}',
        '.vnr3-segment{display:flex;gap:6px;flex-wrap:wrap}.vnr3-segment .vnr3-btn.on{background:rgba(255,255,255,.18)}',
        '.vnr3-mode-pill{position:absolute;right:12px;top:8px;padding:3px 7px;border-radius:8px;background:rgba(0,0,0,.25);font-size:9px;opacity:.72}.vnr3-timer-label{font-size:9px;margin-right:3px}',
        '.vnr3-status-error{opacity:.55;text-decoration:line-through}.vnr3-persona{margin:12px 0}.vnr3-persona textarea{min-height:110px}',
        '@media(max-width:720px){.vnr3-shade{align-items:flex-end;padding:0}.vnr3-modal{width:100%;max-height:88vh;border-radius:26px 26px 0 0;padding:18px 16px 24px}.vnr3-toolbar{align-items:stretch;flex-direction:column}.vnr3-search{max-width:none}.vnr3-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.vnr3-detail-head{grid-template-columns:94px 1fr;gap:14px;align-items:center}.vnr3-detail-title{font-size:20px}.vnr3-inline-ops{grid-column:1/-1}.vnr3-song-row{grid-template-columns:minmax(0,1fr)}.vnr3-track{grid-template-columns:24px 38px minmax(0,1fr) auto}.vnr3-track>.vnr3-state{display:none}}'
    ].join('');

    if (!eng.__v3RequestWrapped) {
        eng.__v3RequestWrapped = true;
        var vnr3OldRequest = eng.request;
        eng.request = function() {
            if (!v3.manualApiBypass && !v3.consumeAutoRequest()) {
                _toast('睡眠模式的自动请求次数已用完');
                return;
            }
            return vnr3OldRequest.apply(eng, arguments);
        };
        var vnr3OldNext = eng.next;
        eng.next = function() {
            var pl = v3.currentPlaylist();
            var sleep = v3.state.sleep;
            if (eng.running && !(eng.queue || []).length && pl && !pl.system) {
                var shouldLoop = pl.playMode === 'repeat' || pl.playMode === 'repeat-one' ||
                    (sleep && sleep.active && sleep.loopExisting && !sleep.expired);
                if (pl.playMode === 'repeat-one' && eng.current && shouldLoop) {
                    var again = JSON.parse(JSON.stringify(eng.current));
                    again.id = 'repeat-' + Date.now();
                    again.spoken = false;
                    eng.queue = [again];
                } else if (shouldLoop) v3.loadPlaylist(pl.id, false);
                else {
                    var oldAuto = cfg.autoRequest;
                    cfg.autoRequest = false;
                    try { return vnr3OldNext.apply(eng, arguments); }
                    finally { cfg.autoRequest = oldAuto; }
                }
            }
            return vnr3OldNext.apply(eng, arguments);
        };
    }

    function V(cls, text) { return E('div', cls || '', text === undefined ? '' : text); }
    function button(text, fn, cls) {
        var b = E('button', 'vnr3-btn' + (cls ? ' ' + cls : ''), text);
        b.type = 'button';
        b.onclick = fn || function() {};
        return b;
    }
    function field(label, value, type) {
        var w = V('vnr3-field');
        w.appendChild(V('vnr3-label', label));
        var inp = E(type === 'textarea' ? 'textarea' : 'input', 'vnr3-input');
        if (type && type !== 'textarea') inp.type = type;
        inp.value = value === undefined ? '' : value;
        w.appendChild(inp);
        w.input = inp;
        return w;
    }
    function imagePicker(targetField) {
        var pick = field('或从设备选择图片', '', 'file');
        pick.input.accept = 'image/*';
        pick.input.onchange = function() {
            var file = pick.input.files && pick.input.files[0];
            if (!file) return;
            var reader = new TOP.FileReader();
            reader.onload = function() { targetField.input.value = String(reader.result || ''); };
            reader.readAsDataURL(file);
        };
        return pick;
    }
    function modal(title) {
        var shade = V('vnr3-shade'), card = V('vnr3-modal');
        var head = V('vnr3-modal-head');
        head.appendChild(V('vnr3-modal-title', title));
        head.appendChild(button('×', function() { shade.remove(); }, 'icon'));
        card.appendChild(head);
        shade.appendChild(card);
        shellHost().appendChild(shade);
        shade.card = card;
        shade.onclick = function(ev) { if (ev.target === shade) shade.remove(); };
        return shade;
    }
    function choice(title, options) {
        var m = modal(title);
        var list = V('vnr3-choice-list');
        options.forEach(function(o) {
            var row = button(o.label, function() {
                m.remove();
                o.action && o.action();
            }, 'choice');
            if (o.note) row.appendChild(V('vnr3-choice-note', o.note));
            list.appendChild(row);
        });
        m.card.appendChild(list);
    }

    function playlistCover(pl) {
        if (pl.id === 'now-playing') {
            var now = curSong();
            return (now && (now.cover || now.pic)) || '';
        }
        if (pl.cover) return pl.cover;
        var songs = pl.songs || [];
        for (var i = songs.length - 1; i >= 0; i--) if (songs[i].cover) return songs[i].cover;
        return '';
    }

    function openCreatePlaylist() {
        var m = modal('新建歌单');
        var name = field('歌单名称', '', 'text');
        var desc = field('简介（可选）', '', 'textarea');
        var cover = field('封面图片 URL（可选）', '', 'text');
        var auto = V('vnr3-toggle-row');
        auto.appendChild(V('', '播放时自动请求台本'));
        var sw = E('button', 'vnr2-sw');
        sw.appendChild(E('i', ''));
        sw.onclick = function() { sw.classList.toggle('on'); };
        auto.appendChild(sw);
        m.card.appendChild(name); m.card.appendChild(desc); m.card.appendChild(cover); m.card.appendChild(imagePicker(cover)); m.card.appendChild(auto);
        var ops = V('vnr3-ops');
        ops.appendChild(button('取消', function() { m.remove(); }));
        ops.appendChild(button('创建', function() {
            var pl = v3.createPlaylist({
                name: name.input.value,
                description: desc.input.value,
                cover: cover.input.value,
                autoScripts: sw.classList.contains('on')
            });
            m.remove();
            u.v3PlaylistId = pl.id;
            u.view = 'playlist-detail';
            savePos();
            renderMain();
        }, 'primary'));
        m.card.appendChild(ops);
        name.input.focus();
    }

    function openPlaylistSettings(pl) {
        var m = modal('歌单设置');
        var name = field('名称', pl.name, 'text');
        var desc = field('简介', pl.description || '', 'textarea');
        var cover = field('自定义封面 URL（留空则使用最新歌曲封面）', pl.cover || '', 'text');
        var batch = field('每次请求关联台本的歌曲数', pl.scriptBatchSize || 30, 'number');
        var play = V('vnr3-segment');
        ['sequence', 'repeat', 'repeat-one', 'shuffle'].forEach(function(mode) {
            var labels = { sequence: '顺序', repeat: '列表循环', 'repeat-one': '单曲循环', shuffle: '随机' };
            var b = button(labels[mode], function() {
                [].slice.call(play.children).forEach(function(x) { x.classList.remove('on'); });
                b.classList.add('on');
                play.dataset.mode = mode;
            });
            if ((pl.playMode || 'sequence') === mode) b.classList.add('on');
            play.appendChild(b);
        });
        play.dataset.mode = pl.playMode || 'sequence';
        var auto = V('vnr3-toggle-row');
        auto.appendChild(V('', '播放时自动请求台本'));
        var sw = E('button', 'vnr2-sw' + (pl.autoScripts ? ' on' : ''));
        sw.appendChild(E('i', ''));
        sw.onclick = function() { sw.classList.toggle('on'); };
        auto.appendChild(sw);
        m.card.appendChild(name); m.card.appendChild(desc); m.card.appendChild(cover); m.card.appendChild(imagePicker(cover)); m.card.appendChild(batch);
        m.card.appendChild(V('vnr3-label', '播放方式')); m.card.appendChild(play); m.card.appendChild(auto);
        var ops = V('vnr3-ops');
        if (!pl.system) {
            ops.appendChild(button('合并到其他歌单', function() {
                var targets = v3.playlists().filter(function(x) { return !x.system && x.id !== pl.id; });
                if (!targets.length) { _toast('还没有其他可合并的歌单'); return; }
                choice('选择合并目标', targets.map(function(target) {
                    return { label: target.name, note: (target.songs || []).length + ' 首', action: function() {
                        var r = v3.mergePlaylists(pl.id, target.id, false);
                        _toast('已合并 ' + r.added + ' 首，跳过重复 ' + r.duplicate + ' 首');
                    } };
                }));
            }));
            ops.appendChild(button('删除歌单', function() {
            if (TOP.confirm('删除歌单“' + pl.name + '”？')) {
                v3.deletePlaylist(pl.id);
                m.remove(); u.view = 'playlists'; renderMain(); renderSidebar();
            }
            }, 'danger'));
        }
        ops.appendChild(button('取消', function() { m.remove(); }));
        ops.appendChild(button('保存', function() {
            v3.updatePlaylist(pl.id, {
                name: name.input.value,
                description: desc.input.value,
                cover: cover.input.value,
                scriptBatchSize: batch.input.value,
                playMode: play.dataset.mode,
                autoScripts: sw.classList.contains('on')
            });
            m.remove();
            renderMain();
        }, 'primary'));
        m.card.appendChild(ops);
    }

    function openManualAdd(pl) {
        var m = modal('添加歌曲');
        var input = field('每行一首：歌名 - 歌手 - 音频URL - 封面URL', '', 'textarea');
        input.input.style.minHeight = '180px';
        m.card.appendChild(input);
        var ops = V('vnr3-ops');
        ops.appendChild(button('取消', function() { m.remove(); }));
        ops.appendChild(button('添加', function() {
            var songs = v3.manualSongs(input.input.value);
            var r = v3.addSongs(pl.id, songs, false);
            _toast('已添加 ' + r.added + ' 首，跳过重复 ' + r.duplicate + ' 首');
            m.remove(); renderMain();
        }, 'primary'));
        m.card.appendChild(ops);
    }

    function openImport(pl) {
        var m = modal('导入网易云歌单');
        var url = field('网易云歌单分享链接', '', 'text');
        var status = V('vnr3-hint', '只解析公开歌单资料，不登录网易云账号。');
        m.card.appendChild(url); m.card.appendChild(status);
        var ops = V('vnr3-ops');
        ops.appendChild(button('取消', function() { m.remove(); }));
        ops.appendChild(button('解析预览', function() {
            status.textContent = '正在解析…';
            v3.importNetease(url.input.value, function(err, result) {
                if (err) { status.textContent = err; return; }
                m.card.querySelectorAll('.vnr3-import-preview').forEach(function(x) { x.remove(); });
                var preview = V('vnr3-import-preview');
                preview.appendChild(V('vnr3-preview-title', (result.name || '歌单') + ' · ' + result.songs.length + ' 首'));
                var list = V('vnr3-preview-list');
                result.songs.slice(0, 100).forEach(function(s, i) {
                    list.appendChild(V('vnr3-preview-row', (i + 1) + '. ' + s.title + (s.artist ? ' — ' + s.artist : '')));
                });
                preview.appendChild(list);
                var io = V('vnr3-ops');
                io.appendChild(button('新增缺少歌曲', function() {
                    var r = v3.addSongs(pl.id, result.songs, false);
                    _toast('导入 ' + r.added + ' 首，跳过重复 ' + r.duplicate + ' 首');
                    m.remove(); renderMain();
                }, 'primary'));
                io.appendChild(button('完全覆盖', function() {
                    if (!TOP.confirm('完全覆盖当前歌单？')) return;
                    var r = v3.addSongs(pl.id, result.songs, true);
                    _toast('已覆盖并导入 ' + r.added + ' 首');
                    m.remove(); renderMain();
                }));
                preview.appendChild(io);
                m.card.insertBefore(preview, ops);
                status.textContent = '解析完成，请确认导入方式。';
            });
        }, 'primary'));
        m.card.appendChild(ops);
        url.input.focus();
    }

    function playPlaylist(pl) {
        if (pl.system) {
            v3.setMode('playlist');
            eng.playPause();
            return;
        }
        choice('播放“' + pl.name + '”', [
            { label: '替换正在播放', note: '使用该歌单替换后续队列', action: function() { v3.loadPlaylist(pl.id, false); drawShell(); } },
            { label: '追加到正在播放', note: '保留当前队列并追加到末尾', action: function() { v3.loadPlaylist(pl.id, true); drawShell(); } }
        ]);
    }

    function renderPlaylists(box) {
        var toolbar = V('vnr3-toolbar');
        var title = V('');
        title.appendChild(V('vnr3-title', 'All Playlists'));
        title.appendChild(V('vnr3-sub', '本地歌单与当前播放队列'));
        toolbar.appendChild(title);
        var search = E('input', 'vnr3-search');
        search.placeholder = '搜索歌单';
        toolbar.appendChild(search);
        box.appendChild(toolbar);
        var grid = V('vnr3-grid');
        function paint() {
            grid.innerHTML = '';
            var q = String(search.value || '').toLowerCase();
            var list = v3.playlists().slice().sort(function(a, b) {
                if (a.system) return -1;
                if (b.system) return 1;
                return (a.order || 0) - (b.order || 0);
            });
            list.forEach(function(pl) {
                if (q && String(pl.name || '').toLowerCase().indexOf(q) < 0) return;
                var card = V('vnr3-pl-card' + (pl.system ? ' system' : ''));
                var cover = V('vnr3-pl-cover');
                var src = playlistCover(pl);
                if (src) {
                    var img = E('img', ''); img.src = src; cover.appendChild(img);
                } else cover.appendChild(V('vnr3-default-cover', '♫'));
                if (pl.system) cover.appendChild(V('vnr3-current-chip', '当前'));
                card.appendChild(cover);
                card.appendChild(V('vnr3-card-name', pl.name || '未命名歌单'));
                var count = pl.system ? v3.nowSongs().length : (pl.songs || []).length;
                card.appendChild(V('vnr3-card-sub', count + ' 首歌曲'));
                card.onclick = function() {
                    u.v3PlaylistId = pl.id; v3.state.activePlaylistId = pl.id;
                    u.view = 'playlist-detail'; v3.save(); savePos(); renderMain();
                };
                grid.appendChild(card);
            });
            var add = V('vnr3-pl-card add');
            add.appendChild(V('vnr3-add-cover', '+'));
            add.appendChild(V('vnr3-card-name', '新建歌单'));
            add.appendChild(V('vnr3-card-sub', '添加一个本地歌单'));
            add.onclick = openCreatePlaylist;
            grid.appendChild(add);
        }
        search.oninput = paint;
        box.appendChild(grid);
        paint();
    }

    function openSongEditor(pl, song) {
        song = song || { id: '', title: '', artist: '', url: '', cover: '' };
        var m = modal(song.id ? '编辑歌曲' : '新增歌曲');
        var title = field('歌名（必填）', song.title || '', 'text');
        var artist = field('歌手（可选）', song.artist || '', 'text');
        var url = field('音频 URL（可选）', song.url || '', 'text');
        var cover = field('封面 URL（可选）', song.cover || '', 'text');
        m.card.appendChild(title); m.card.appendChild(artist); m.card.appendChild(url); m.card.appendChild(cover);
        var advToggle = V('vnr3-toggle-row');
        advToggle.appendChild(V('', '高级播放参数'));
        var sw = E('button', 'vnr2-sw' + (song.advanced ? ' on' : '')); sw.appendChild(E('i', ''));
        advToggle.appendChild(sw); m.card.appendChild(advToggle);
        var adv = V('vnr3-advanced');
        var vol = field('独立音量 0-100', song.advanced && song.advanced.volume !== undefined ? song.advanced.volume : 55, 'number');
        var duck = field('主持人说话时音量 0-100', song.advanced && song.advanced.duckVolume !== undefined ? song.advanced.duckVolume : 20, 'number');
        adv.appendChild(vol); adv.appendChild(duck);
        var loop = V('vnr3-toggle-row'); loop.appendChild(V('', '单曲循环'));
        var loopSw = E('button', 'vnr2-sw' + (!song.advanced || song.advanced.loop !== false ? ' on' : '')); loopSw.appendChild(E('i', '')); loop.appendChild(loopSw); adv.appendChild(loop);
        var duckRow = V('vnr3-toggle-row'); duckRow.appendChild(V('', '说话时压低'));
        var duckSw = E('button', 'vnr2-sw' + (song.advanced && song.advanced.duck ? ' on' : '')); duckSw.appendChild(E('i', '')); duckRow.appendChild(duckSw); adv.appendChild(duckRow);
        m.card.appendChild(adv);
        function paintAdv() { adv.style.display = sw.classList.contains('on') ? 'grid' : 'none'; }
        sw.onclick = function() { sw.classList.toggle('on'); paintAdv(); };
        loopSw.onclick = function() { loopSw.classList.toggle('on'); };
        duckSw.onclick = function() { duckSw.classList.toggle('on'); };
        paintAdv();
        var ops = V('vnr3-ops');
        ops.appendChild(button('取消', function() { m.remove(); }));
        ops.appendChild(button('保存', function() {
            if (!title.input.value.trim()) { _toast('歌名不能为空'); return; }
            var data = {
                id: song.id || undefined, title: title.input.value, artist: artist.input.value,
                url: url.input.value, cover: cover.input.value,
                advanced: sw.classList.contains('on') ? {
                    volume: Number(vol.input.value) || 55, duckVolume: Number(duck.input.value) || 20,
                    loop: loopSw.classList.contains('on'), duck: duckSw.classList.contains('on')
                } : null,
                scriptVersions: song.scriptVersions || [], selectedScriptId: song.selectedScriptId || ''
            };
            if (song.id) {
                for (var i = 0; i < pl.songs.length; i++) if (pl.songs[i].id === song.id) pl.songs[i] = data;
                v3.save(); v3.uiRefresh();
            } else v3.addSongs(pl.id, [data], false);
            m.remove(); renderMain();
        }, 'primary'));
        m.card.appendChild(ops);
    }

    function renderPlaylistDetail(box) {
        var pl = v3.playlist(u.v3PlaylistId || v3.state.activePlaylistId) || v3.playlist('now-playing');
        v3.state.activePlaylistId = pl.id;
        var songs = pl.system ? v3.nowSongs() : (pl.songs || []);
        var head = V('vnr3-detail-head');
        var cover = V('vnr3-detail-cover');
        var src = playlistCover(pl);
        if (src) { var img = E('img', ''); img.src = src; cover.appendChild(img); }
        else cover.appendChild(V('vnr3-default-cover', '♫'));
        head.appendChild(cover);
        var info = V('vnr3-detail-info');
        info.appendChild(V('vnr3-kicker', pl.system ? 'CURRENT PLAYLIST' : 'PLAYLIST'));
        info.appendChild(V('vnr3-detail-title', pl.name));
        info.appendChild(V('vnr3-detail-sub', songs.length + ' 首歌曲' + (pl.description ? ' · ' + pl.description : '')));
        var ops = V('vnr3-inline-ops');
        ops.appendChild(button('播放', function() { playPlaylist(pl); }, 'primary'));
        if (!pl.system) {
            ops.appendChild(button('导入歌单', function() { openImport(pl); }));
            ops.appendChild(button('添加歌曲', function() { openManualAdd(pl); }));
        }
        ops.appendChild(button('设置', function() { openPlaylistSettings(pl); }));
        info.appendChild(ops); head.appendChild(info); box.appendChild(head);
        var bulk = V('vnr3-bulk');
        var selected = {};
        bulk.appendChild(V('', '选择歌曲后可复制、移动、删除或请求台本'));
        var bulkOps = V('vnr3-inline-ops');
        function selectedSongs() {
            return songs.filter(function(s) { return selected[s.id]; });
        }
        function chooseTarget(move) {
            var picked = selectedSongs();
            if (!picked.length) { _toast('请先勾选歌曲'); return; }
            var targets = v3.playlists().filter(function(x) { return !x.system && x.id !== pl.id; });
            if (!targets.length) { _toast('还没有可用的目标歌单'); return; }
            choice(move ? '移动到歌单' : '复制到歌单', targets.map(function(target) {
                return { label: target.name, note: (target.songs || []).length + ' 首', action: function() {
                    var r;
                    if (pl.system) {
                        r = v3.addSongs(target.id, picked, false);
                        if (move) picked.forEach(function(song) {
                            var items = (eng.current ? [eng.current] : []).concat(eng.queue || []);
                            items.forEach(function(it) { if (it.id === song.queueItemId) eng.removeItem(it); });
                        });
                    } else r = v3.copySongs(pl.id, picked.map(function(s) { return s.id; }), target.id, move);
                    _toast((move ? '已移动 ' : '已复制 ') + r.added + ' 首，跳过重复 ' + r.duplicate + ' 首');
                    renderMain();
                } };
            }));
        }
        bulkOps.appendChild(button('复制到…', function() { chooseTarget(false); }));
        bulkOps.appendChild(button('移动到…', function() { chooseTarget(true); }));
        bulkOps.appendChild(button('删除勾选', function() {
            var picked = selectedSongs();
            if (!picked.length) { _toast('请先勾选歌曲'); return; }
            if (pl.system) picked.forEach(function(song) {
                var items = (eng.current ? [eng.current] : []).concat(eng.queue || []);
                items.forEach(function(it) { if (it.id === song.queueItemId) eng.removeItem(it); });
            });
            else v3.removeSongs(pl.id, picked.map(function(s) { return s.id; }));
            renderMain();
        }, 'danger'));
        if (pl.system) bulkOps.appendChild(button('请求勾选台本', function() {
            var ids = selectedSongs().map(function(s) { return s.queueItemId; });
            if (!ids.length) { _toast('请先勾选歌曲'); return; }
            v3.requestLinkedScripts(true, ids);
        }, 'primary'));
        var recommend = button('AI 推荐相似歌曲', function() {
            var ref = songs.filter(function(s) { return !Object.keys(selected).length || selected[s.id]; });
            openRecommend(ref, pl);
        });
        bulkOps.appendChild(recommend);
        if (!pl.system) bulkOps.appendChild(button('清空歌单', function() {
            if (TOP.confirm('清空“' + pl.name + '”中的全部歌曲？')) { pl.songs = []; v3.save(); renderMain(); }
        }, 'danger'));
        bulk.appendChild(bulkOps); box.appendChild(bulk);
        var list = V('vnr3-track-list');
        if (!songs.length) list.appendChild(V('vnr2-empty', '这个歌单还没有歌曲。'));
        songs.forEach(function(song, index) {
            var row = V('vnr3-track');
            var ck = E('button', 'vnr3-check'); ck.type = 'button'; ck.textContent = '';
            ck.onclick = function() { selected[song.id] = !selected[song.id]; ck.classList.toggle('on', !!selected[song.id]); };
            row.appendChild(ck);
            var pic = V('vnr3-track-pic');
            if (song.cover) { var im = E('img', ''); im.src = song.cover; pic.appendChild(im); } else pic.textContent = '♫';
            row.appendChild(pic);
            var tx = V('vnr3-track-text');
            tx.appendChild(V('vnr3-track-title', song.title || '未命名歌曲'));
            tx.appendChild(V('vnr3-track-sub', song.artist || '未填写歌手'));
            row.appendChild(tx);
            if (song.pendingMatch || song.matchError) row.appendChild(V('vnr3-state', '待匹配'));
            row.appendChild(button('•••', function() {
                choice(song.title || '歌曲操作', [
                    { label: '编辑歌曲', action: function() { if (!pl.system) openSongEditor(pl, song); } },
                    { label: '立即播放', action: function() { eng.queueSong(song, true); } },
                    { label: '加入正在播放', action: function() { eng.queueSong(song, false); } },
                    { label: '删除', action: function() {
                        if (pl.system) {
                            var items = (eng.current ? [eng.current] : []).concat(eng.queue || []);
                            items.forEach(function(it) { if (it.id === song.queueItemId) eng.removeItem(it); });
                        } else v3.removeSongs(pl.id, [song.id]);
                        renderMain();
                    } }
                ]);
            }, 'icon'));
            list.appendChild(row);
        });
        box.appendChild(list);
        if (!pl.system) box.appendChild(button('＋ 添加一首歌曲', function() { openSongEditor(pl, null); }, 'vnr3-wide-add'));
    }

    function openRecommend(refSongs, targetPl) {
        var m = modal('AI 只推荐歌曲');
        var note = field('临时推荐要求', '', 'textarea');
        var count = field('推荐数量', 30, 'number');
        m.card.appendChild(V('vnr3-hint', '参考 ' + refSongs.length + ' 首歌曲，只推荐歌曲，不生成台本。'));
        m.card.appendChild(note); m.card.appendChild(count);
        var status = V('vnr3-hint', ''); m.card.appendChild(status);
        var ops = V('vnr3-ops');
        ops.appendChild(button('取消', function() { m.remove(); }));
        ops.appendChild(button('开始推荐', function() {
            status.textContent = '正在请求推荐…';
            v3.recommendSongsOnly(refSongs, note.input.value + '\n请推荐 ' + (Number(count.input.value) || 30) + ' 首。', function(err, songs) {
                if (err) { status.textContent = String(err); return; }
                m.remove();
                openRecommendResult(songs, targetPl);
            });
        }, 'primary'));
        m.card.appendChild(ops);
    }

    function openRecommendResult(songs, targetPl) {
        var m = modal('推荐结果 · ' + songs.length + ' 首');
        var selected = {};
        var list = V('vnr3-preview-list');
        songs.forEach(function(s) {
            selected[s.id] = true;
            var row = V('vnr3-preview-row selectable on', s.title + (s.artist ? ' — ' + s.artist : ''));
            row.onclick = function() { selected[s.id] = !selected[s.id]; row.classList.toggle('on', !!selected[s.id]); };
            list.appendChild(row);
        });
        m.card.appendChild(list);
        var ops = V('vnr3-ops');
        ops.appendChild(button('加入当前歌单', function() {
            v3.addSongs(targetPl.id, songs.filter(function(s) { return selected[s.id]; }), false);
            m.remove(); renderMain();
        }, 'primary'));
        ops.appendChild(button('创建新歌单', function() {
            var pl = v3.createPlaylist({ name: 'AI 推荐歌单' });
            v3.addSongs(pl.id, songs.filter(function(s) { return selected[s.id]; }), false);
            m.remove(); u.v3PlaylistId = pl.id; u.view = 'playlist-detail'; renderMain();
        }));
        m.card.appendChild(ops);
    }

    function openModeMenu() {
        var modes = [
            { mode: 'recommend', label: '推荐模式', note: 'AI 推荐歌曲并写关联台本' },
            { mode: 'playlist', label: '歌单模式', note: '只为当前曲目补写关联台本' },
            { mode: 'companion', label: '陪伴模式', note: '生成与歌曲无关的连续长台本' }
        ];
        choice('请求模式', modes.map(function(x) {
            return { label: (v3.state.mode === x.mode ? '✓ ' : '') + x.label, note: x.note, action: function() { v3.setMode(x.mode); renderBottomBar(); renderMain(); } };
        }));
    }

    function openPendingScripts() {
        var m = modal('待处理台本');
        var items = (eng.current ? [eng.current] : []).concat(eng.queue || []).filter(function(it) {
            return it && (it.needsScript || !it.say || it.scriptFresh === false);
        });
        var selected = {};
        if (!items.length) m.card.appendChild(V('vnr2-empty', '当前播放列表没有需要补写或更新的台本。'));
        var list = V('vnr3-preview-list');
        items.forEach(function(it) {
            selected[it.id] = true;
            var s = it.song || {};
            var row = V('vnr3-preview-row selectable on', (s.title || '未命名歌曲') + (s.artist ? ' — ' + s.artist : ''));
            row.onclick = function() { selected[it.id] = !selected[it.id]; row.classList.toggle('on', !!selected[it.id]); };
            list.appendChild(row);
        });
        m.card.appendChild(list);
        if (items.length) {
            var ops = V('vnr3-ops');
            ops.appendChild(button('取消', function() { m.remove(); }));
            ops.appendChild(button('请求勾选台本', function() {
                var ids = items.filter(function(it) { return selected[it.id]; }).map(function(it) { return it.id; });
                m.remove(); v3.requestLinkedScripts(true, ids);
            }, 'primary'));
            m.card.appendChild(ops);
        }
    }

    function openSleep() {
        var m = modal('睡眠倒计时');
        var minutes = field('时长（分钟）', 30, 'number');
        var limit = field('最多自动请求次数', 5, 'number');
        m.card.appendChild(V('vnr3-segment', ''));
        var presets = m.card.lastChild;
        [15, 30, 45, 60, 90].forEach(function(n) {
            presets.appendChild(button(n + ' 分钟', function() { minutes.input.value = n; }));
        });
        m.card.appendChild(minutes); m.card.appendChild(limit);
        var loop = V('vnr3-toggle-row'); loop.appendChild(V('', '次数耗尽后循环已有内容'));
        var sw = E('button', 'vnr2-sw'); sw.appendChild(E('i', '')); sw.onclick = function() { sw.classList.toggle('on'); }; loop.appendChild(sw);
        m.card.appendChild(loop);
        if (v3.state.sleep && v3.state.sleep.active) {
            m.card.appendChild(button('取消当前倒计时', function() { v3.cancelSleep(); m.remove(); renderBottomBar(); }, 'danger'));
        }
        var ops = V('vnr3-ops');
        ops.appendChild(button('关闭', function() { m.remove(); }));
        ops.appendChild(button('开始', function() {
            v3.startSleep(minutes.input.value, limit.input.value, sw.classList.contains('on'), 'current');
            m.remove(); renderBottomBar();
        }, 'primary'));
        m.card.appendChild(ops);
    }

    function openBackgrounds() {
        var m = modal('高级背景音');
        var songs = v3.advancedSongs();
        var master = field('背景音总音量 0-100', v3.state.backgroundMasterVolume === undefined ? 100 : v3.state.backgroundMasterVolume, 'number');
        master.input.onchange = function() { v3.state.backgroundMasterVolume = Number(master.input.value) || 0; v3.save(); };
        m.card.appendChild(master);
        if (!songs.length) m.card.appendChild(V('vnr2-empty', '暂无开启高级播放参数的音频。请在歌单中编辑歌曲并展开高级参数。'));
        var list = V('vnr3-preview-list');
        songs.forEach(function(song) {
            var key = song.id || song.title;
            var row = V('vnr3-bg-row');
            var info = V('');
            info.appendChild(V('vnr3-track-title', song.title));
            info.appendChild(V('vnr3-track-sub', song.advanced && song.advanced.error ? song.advanced.error : (song.artist || '独立音频')));
            row.appendChild(info);
            row.appendChild(button(v3.audio[key] ? '停止' : '播放', function() {
                if (v3.audio[key]) v3.stopBackground(key); else v3.playBackground(song);
                m.remove(); openBackgrounds();
            }, v3.audio[key] ? '' : 'primary'));
            list.appendChild(row);
        });
        m.card.appendChild(list);
        var ops = V('vnr3-ops');
        ops.appendChild(button('停止全部', function() { v3.stopAllBackgrounds(); m.remove(); }));
        ops.appendChild(button('播放勾选项', function() { v3.playSelectedBackgrounds(); m.remove(); }, 'primary'));
        m.card.appendChild(ops);
    }

    function renderContinuous(box) {
        var head = V('vnr3-cont-head');
        var version = v3.activeContinuous();
        var title = V('');
        title.appendChild(V('vnr3-title', '陪伴台本'));
        title.appendChild(V('vnr3-sub', version ? version.title : '暂无陪伴模式连续台本'));
        head.appendChild(title);
        var ops = V('vnr3-inline-ops');
        ops.appendChild(button('请求连续台本', function() { v3.setMode('companion'); v3.requestCompanion(true); }, 'primary'));
        ops.appendChild(button('新建空白台本', function() {
            var fresh = { id: 'continuous-' + Date.now(), title: '自定义陪伴台本', createdAt: Date.now(), favorite: false, edited: true, nodes: [] };
            v3.state.continuousVersions.unshift(fresh);
            v3.state.activeContinuousId = fresh.id;
            v3.save();
            renderMain();
        }));
        if (version) {
            ops.appendChild(button('整体播放', function() { v3.playContinuous(version.id); }));
            ops.appendChild(button('停止', function() { v3.stopContinuous(); }));
            ops.appendChild(button('生成并保存音频', function() {
                var p = modal('生成整份音频');
                var status = V('vnr3-hint', '准备开始…'); p.card.appendChild(status);
                v3.exportContinuous(version.id, function(i, n) { status.textContent = '正在生成 ' + i + ' / ' + n; }, function(err) {
                    status.textContent = err ? ('失败：' + err) : '生成完成，文件已保存。';
                });
            }));
            ops.appendChild(button('原始数据', function() {
                var rawModal = modal('台本原始数据');
                var raw = field('JSON', JSON.stringify(version.nodes || [], null, 2), 'textarea');
                raw.input.style.minHeight = '360px';
                rawModal.card.appendChild(raw);
                var rawOps = V('vnr3-ops');
                rawOps.appendChild(button('取消', function() { rawModal.remove(); }));
                rawOps.appendChild(button('应用', function() {
                    try {
                        var parsed = JSON.parse(raw.input.value);
                        if (Object.prototype.toString.call(parsed) !== '[object Array]') throw new Error('根节点必须是数组');
                        version.nodes = parsed;
                        version.edited = true;
                        v3.save();
                        rawModal.remove();
                        renderMain();
                    } catch (e) { _toast('JSON 无效：' + e.message); }
                }, 'primary'));
                rawModal.card.appendChild(rawOps);
            }));
        }
        head.appendChild(ops); box.appendChild(head);
        if (!version) {
            box.appendChild(V('vnr2-empty', '当前没有陪伴模式台本。可以请求 AI 生成，也可以在生成后进行结构化编辑。'));
            return;
        }
        var nodes = version.nodes || [];
        var list = V('vnr3-node-list');
        nodes.forEach(function(node, index) {
            if (node.type === 'pause') {
                var pause = V('vnr3-pause-node');
                pause.appendChild(V('', '停顿'));
                var sec = E('input', 'vnr3-pause-input'); sec.type = 'number'; sec.value = node.seconds || 0;
                sec.onchange = function() { node.seconds = Number(sec.value) || 0; version.edited = true; };
                pause.appendChild(sec); pause.appendChild(V('', '秒'));
                pause.appendChild(button('删除', function() { nodes.splice(index, 1); version.edited = true; renderMain(); }, 'icon'));
                list.appendChild(pause);
                return;
            }
            var card = V('vnr3-speech-node');
            var hosts = _selectedHosts(eng.store || {});
            var sel = E('select', 'vnr3-input');
            hosts.forEach(function(ch) {
                var op = E('option', '', ch.name || '主持人'); op.value = ch.name || '';
                if (op.value === node.host) op.selected = true; sel.appendChild(op);
            });
            sel.onchange = function() { node.host = sel.value; version.edited = true; };
            card.appendChild(sel);
            var tts = E('textarea', 'vnr3-node-text'); tts.value = node.ttsText || ''; tts.placeholder = '发送给 TTS 的文本';
            var display = E('textarea', 'vnr3-node-text'); display.value = node.displayText || ''; display.placeholder = '显示文本 / 翻译';
            tts.onchange = function() { node.ttsText = tts.value; version.edited = true; };
            display.onchange = function() { node.displayText = display.value; version.edited = true; };
            card.appendChild(tts); card.appendChild(display);
            var no = V('vnr3-node-ops');
            no.appendChild(button('试听', function() {
                _tts(node.ttsText, _charByName(node.host, hosts), function(url) { new TOP.Audio(url).play(); }, function(e) { _toast(e); });
            }));
            no.appendChild(button('复制', function() { nodes.splice(index + 1, 0, JSON.parse(JSON.stringify(node))); nodes[index + 1].id = 'speech-' + Date.now(); renderMain(); }));
            no.appendChild(button('在后面插入停顿', function() { nodes.splice(index + 1, 0, { id: 'pause-' + Date.now(), type: 'pause', seconds: 15 }); renderMain(); }));
            no.appendChild(button('删除', function() { nodes.splice(index, 1); renderMain(); }, 'danger'));
            card.appendChild(no); list.appendChild(card);
        });
        box.appendChild(list);
        var save = V('vnr3-sticky-save');
        save.appendChild(button('添加朗读段', function() {
            var hosts = _selectedHosts(eng.store || {});
            nodes.push({
                id: 'speech-' + Date.now(),
                type: 'speech',
                host: hosts[0] && hosts[0].name || '主持人',
                ttsText: '',
                displayText: ''
            });
            version.edited = true;
            renderMain();
        }));
        save.appendChild(button('添加停顿', function() {
            nodes.push({ id: 'pause-' + Date.now(), type: 'pause', seconds: 15 });
            version.edited = true;
            renderMain();
        }));
        save.appendChild(button('保存当前编辑', function() { version.edited = true; v3.save(); _toast('台本已保存'); }, 'primary'));
        save.appendChild(button(version.favorite ? '取消收藏' : '收藏版本', function() { version.favorite = !version.favorite; v3.save(); renderMain(); }));
        box.appendChild(save);
    }

    function augmentArtistShortPersona(box) {
        var ch = null, chars = _chars();
        for (var i = 0; i < chars.length; i++) if (_charId(chars[i]) === u.artistId) ch = chars[i];
        if (!ch || box.querySelector('.vnr3-persona')) return;
        var panel = V('vnr3-persona');
        var head = V('vnr3-persona-head');
        head.appendChild(V('', '电台简短人设'));
        var count = V('vnr3-hint', '0 字'); head.appendChild(count); panel.appendChild(head);
        var ta = E('textarea', 'vnr3-node-text');
        var id = _charId(ch);
        ta.value = v3.state.shortPersonas[id] || '';
        function update() { count.textContent = ta.value.length + ' 字'; }
        ta.oninput = update; update(); panel.appendChild(ta);
        var ops = V('vnr3-ops');
        ops.appendChild(button('恢复完整人设', function() { ta.value = ch.persona || ''; update(); }));
        ops.appendChild(button('保存简短人设', function() { v3.state.shortPersonas[id] = ta.value.trim(); v3.save(); _toast('简短人设已保存'); }, 'primary'));
        panel.appendChild(ops);
        box.insertBefore(panel, box.children[1] || null);
    }

    var oldRenderSidebar = renderSidebar;
    renderSidebar = function() {
        oldRenderSidebar();
        var links = sidebar.querySelectorAll('.vnr2-nav-it');
        for (var i = 0; i < links.length; i++) {
            if ((links[i].textContent || '').indexOf('All Playlists') >= 0) {
                links[i].classList.toggle('on', u.view === 'playlists' || u.view === 'playlist-detail');
                links[i].onclick = function() {
                    u.view = 'playlists'; u.sidesOpen = false; savePos(); renderSidebar(); renderMain();
                };
            }
        }
        var navs = sidebar.querySelectorAll('.vnr2-nav');
        var target = navs[navs.length - 1];
        if (target && !target.querySelector('.vnr3-script-nav')) {
            var script = V('vnr2-nav-it vnr3-script-nav' + (u.view === 'continuous' ? ' on' : ''));
            script.innerHTML = icon2('quote') + '<span>完整台本</span>';
            script.onclick = function() { u.view = 'continuous'; u.sidesOpen = false; savePos(); renderSidebar(); renderMain(); };
            target.appendChild(script);
        }
    };

    var oldRenderMain = renderMain;
    renderMain = function() {
        if (u.view !== 'playlists' && u.view !== 'playlist-detail' && u.view !== 'continuous') {
            oldRenderMain();
            if (u.view === 'artist') augmentArtistShortPersona(main);
            return;
        }
        main.innerHTML = '';
        var head = V('vnr2-main-head');
        var tt = V('');
        tt.appendChild(V('vnr2-h1', u.view === 'continuous' ? 'Complete Script' : (u.view === 'playlist-detail' ? 'Playlist' : 'All Playlists')));
        tt.appendChild(V('vnr2-h1s', v3.modeLabel() + ' · ' + (eng.apiStatus && eng.apiStatus.state === 'loading' ? '正在请求' + (eng.apiStatus.label || '') : statusText())));
        head.appendChild(tt);
        head.appendChild(ib('vnr2-mini30', 'minus', '收起到播放条', function() { u.mode = 'bar'; savePos(); drawShell(); }));
        main.appendChild(head);
        var status = V('vnr2-status-row', statusText() + ' · ' + songTitle(curSong()));
        main.appendChild(status); main.__status = status;
        if (u.view === 'playlists') renderPlaylists(main);
        else if (u.view === 'playlist-detail') renderPlaylistDetail(main);
        else renderContinuous(main);
    };

    var oldRenderBottomBar = renderBottomBar;
    renderBottomBar = function() {
        oldRenderBottomBar();
        var buttons = bbar.querySelectorAll('.vnr2-bb48');
        if (buttons[0]) {
            buttons[0].title = '按当前模式请求';
            buttons[0].onclick = function() { v3.manualRequest(); };
        }
        var ghosts = bbar.querySelectorAll('.vnr2-bb48.ghost');
        if (ghosts[0]) {
            ghosts[0].classList.remove('ghost');
            ghosts[0].title = '请求模式 · ' + v3.modeLabel();
            ghosts[0].innerHTML = icon2(v3.state.mode === 'recommend' ? 'spark2' : (v3.state.mode === 'playlist' ? 'listB' : 'quote'));
            ghosts[0].onclick = openModeMenu;
        }
        if (ghosts[1]) {
            ghosts[1].classList.remove('ghost');
            ghosts[1].title = '睡眠倒计时';
            ghosts[1].innerHTML = (v3.sleepLabel() ? '<span class="vnr3-timer-label">' + v3.sleepLabel() + '</span>' : '') + icon2('listRect');
            ghosts[1].onclick = openSleep;
        }
        if (ghosts[2]) {
            ghosts[2].classList.remove('ghost');
            ghosts[2].title = '待处理台本';
            ghosts[2].onclick = openPendingScripts;
        }
        var card = bbar.querySelector('.vnr2-songcard');
        if (card) {
            var icons = card.querySelector('.vnr2-sc-icons');
            if (icons) {
                icons.style.cursor = 'pointer';
                icons.title = '高级背景音';
                icons.onclick = openBackgrounds;
            }
            if (!card.querySelector('.vnr3-mode-pill')) card.appendChild(V('vnr3-mode-pill', v3.modeLabel()));
            else card.querySelector('.vnr3-mode-pill').textContent = v3.modeLabel();
        }
    };

    try {
        TOP.addEventListener('vnm-radio-v3-refresh', function() {
            try {
                if (u.mode === 'studio') {
                    renderBottomBar();
                    if (/^(playlists|playlist-detail|continuous)$/.test(u.view || '')) renderMain();
                }
            } catch (e) {}
        });
    } catch (e) {}
})();
