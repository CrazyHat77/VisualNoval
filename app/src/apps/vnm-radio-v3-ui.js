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
        '.vnr3-shade{position:fixed;inset:0;z-index:2147483647;background:rgba(8,9,12,.62);backdrop-filter:blur(14px);display:flex;align-items:center;justify-content:center;padding:20px;pointer-events:auto}',
        '.vnr3-modal{position:relative;z-index:1;width:min(560px,94vw);max-height:min(760px,88vh);overflow:auto;border:1px solid rgba(255,255,255,.12);border-radius:26px;background:rgba(40,43,50,.98);box-shadow:0 28px 90px rgba(0,0,0,.5);padding:18px;color:#f2f2f3}',
        '.vnr3-modal-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px}.vnr3-modal-title{font-size:18px;font-weight:650}',
        '.vnr3-choice-list,.vnr3-advanced{display:grid;gap:9px}.vnr3-field{display:grid;gap:7px;margin:11px 0}.vnr3-label{font-size:12px;opacity:.65}',
        '.vnr3-input,.vnr3-search,.vnr3-node-text{box-sizing:border-box;width:100%;border:1px solid rgba(255,255,255,.1);border-radius:14px;background:rgba(0,0,0,.16);color:inherit;padding:11px 13px;outline:none;font:inherit}',
        '.vnr3-input:focus,.vnr3-search:focus,.vnr3-node-text:focus{border-color:rgba(255,255,255,.3);background:rgba(0,0,0,.22)}',
        'textarea.vnr3-input,.vnr3-node-text{min-height:92px;resize:vertical}',
        '.vnr3-ops,.vnr3-inline-ops{display:flex;flex-wrap:wrap;gap:8px;justify-content:flex-end;margin-top:15px}.vnr3-inline-ops{justify-content:flex-start}',
        '.vnr3-toggle-row{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:11px 0}',
        '.vnr3-toolbar{display:flex;align-items:end;justify-content:space-between;gap:14px;margin:8px 0 18px}.vnr3-title{font-size:20px;font-weight:650}.vnr3-search{max-width:240px}',
        '.vnr3-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(142px,1fr));grid-auto-rows:max-content;gap:18px;align-items:start;flex:1;min-height:0;overflow-y:auto;overscroll-behavior:contain;touch-action:pan-y;-webkit-overflow-scrolling:touch;padding-right:7px}',
        '.vnr3-pl-card{box-sizing:border-box;width:100%;min-width:0;cursor:pointer;border-radius:20px;padding:10px;background:rgba(255,255,255,.035);transition:.18s ease;align-self:start}',
        '.vnr3-pl-card:hover{background:rgba(255,255,255,.08);transform:translateY(-2px)}',
        '.vnr3-pl-cover,.vnr3-add-cover,.vnr3-detail-cover{position:relative;aspect-ratio:1/1;overflow:hidden;border-radius:17px;background:linear-gradient(145deg,rgba(255,255,255,.12),rgba(0,0,0,.15));box-shadow:0 12px 30px rgba(0,0,0,.18)}',
        '.vnr3-pl-cover img,.vnr3-detail-cover img{width:100%;height:100%;object-fit:cover}.vnr3-default-cover{height:100%;display:grid;place-items:center;color:rgba(255,255,255,.52);font-size:34px}',
        '.vnr3-current-chip{position:absolute;left:8px;bottom:8px;padding:4px 7px;border-radius:9px;background:rgba(20,20,22,.7);backdrop-filter:blur(8px);font-size:10px}',
        '.vnr3-card-name{font-weight:620;margin-top:9px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
        '.vnr3-add-cover{width:100%;height:auto;aspect-ratio:1/1;border:1px dashed rgba(255,255,255,.2);box-shadow:none;font-size:38px;display:grid;place-items:center;color:rgba(255,255,255,.52)}.vnr3-add-card{min-height:0}',
        '.vnr3-detail-head{display:grid;grid-template-columns:150px 1fr;gap:22px;align-items:end;margin:8px 0 20px}.vnr3-detail-title{font-size:26px;font-weight:680;margin:5px 0}.vnr3-kicker{font-size:10px;letter-spacing:.16em;opacity:.52}',
        '.vnr3-detail-scroll{flex:1;min-height:0;overflow-y:auto;overflow-x:hidden;overscroll-behavior:contain;touch-action:pan-y;-webkit-overflow-scrolling:touch;padding-right:7px;scrollbar-width:thin}.vnr3-detail-scroll::-webkit-scrollbar{width:6px}.vnr3-detail-scroll::-webkit-scrollbar-thumb{background:rgba(255,255,255,.18);border-radius:999px}.vnr3-select-head{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}.vnr3-select-actions{display:flex;gap:7px;flex-wrap:wrap}',
        '.vnr3-song-list,.vnr3-node-list{display:grid;gap:7px}.vnr3-song-row,.vnr3-node,.vnr3-persona{border:1px solid rgba(255,255,255,.08);border-radius:17px;background:rgba(255,255,255,.035);padding:12px}',
        '.vnr3-song-row{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:12px}.vnr3-song-title{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
        '.vnr3-track-list{display:grid;gap:7px;align-content:start;overflow:visible;margin-top:10px}.vnr3-script-body::-webkit-scrollbar{width:5px}.vnr3-script-body::-webkit-scrollbar-thumb{background:rgba(255,255,255,.16);border-radius:999px}.vnr3-track{display:grid;grid-template-columns:26px 42px minmax(0,1fr) auto auto auto;align-items:center;gap:10px;border-radius:16px;padding:8px;background:rgba(255,255,255,.035)}',
        '.vnr3-check{width:20px;height:20px;border:1px solid rgba(255,255,255,.2);border-radius:7px;background:transparent}.vnr3-check.on:after{content:"✓";color:#eee}.vnr3-track-pic{width:42px;height:42px;border-radius:11px;overflow:hidden;display:grid;place-items:center;background:rgba(255,255,255,.08)}.vnr3-track-pic img{width:100%;height:100%;object-fit:cover}.vnr3-track-title,.vnr3-track-sub{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.vnr3-track-sub{opacity:.55;font-size:11px}',
        '.vnr3-speech-node,.vnr3-pause-node{border:1px solid rgba(255,255,255,.08);border-radius:17px;background:rgba(255,255,255,.035);padding:12px}.vnr3-pause-node{display:flex;align-items:center;justify-content:center;gap:10px;border-style:dashed}.vnr3-pause-input{width:70px;border:1px solid rgba(255,255,255,.1);border-radius:10px;background:rgba(0,0,0,.15);color:inherit;padding:8px}.vnr3-node-ops{display:flex;flex-wrap:wrap;gap:7px;margin-top:8px}',
        '.vnr3-node-head,.vnr3-persona-head{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:8px}',
        '.vnr3-segment{display:flex;gap:6px;flex-wrap:wrap}.vnr3-segment .vnr3-btn.on{background:rgba(255,255,255,.18)}',
        '.vnr3-sc-action{appearance:none;border:0;background:transparent;color:inherit;display:inline-flex;align-items:center;gap:4px;padding:4px;border-radius:9px;cursor:pointer}.vnr3-sc-action:hover{background:rgba(255,255,255,.1)}.vnr3-sc-action svg{width:16px;height:16px}.vnr3-timer-label{font-size:9px;white-space:nowrap;opacity:.72}',
        '.vnr3-bg-row{display:grid;grid-template-columns:22px minmax(0,1fr) auto;gap:9px;align-items:center;padding:10px;border-radius:15px;background:rgba(255,255,255,.035)}.vnr3-bg-settings{grid-column:1/-1;display:grid;grid-template-columns:1fr 1fr;gap:8px;padding-top:8px}.vnr3-bg-settings .vnr3-field{margin:0}.vnr3-bg-row.error{opacity:.48}',
        '.vnr3-status-error{opacity:.55;text-decoration:line-through}.vnr3-persona{margin:12px 0}.vnr3-persona textarea{min-height:110px}',
        '.vnr3-script-layer{position:absolute;inset:34px 390px 82px;z-index:40;pointer-events:auto;display:flex;align-items:stretch;justify-content:center}.vnr3-script-window{width:100%;min-width:0;display:flex;flex-direction:column;overflow:hidden;border:1px solid rgba(255,255,255,.14);border-radius:28px;background:rgba(34,37,44,.96);box-shadow:0 28px 90px rgba(0,0,0,.48),inset 0 1px 0 rgba(255,255,255,.09);backdrop-filter:blur(34px);-webkit-backdrop-filter:blur(34px)}',
        '.vnr3-script-window-head{display:flex;align-items:center;justify-content:space-between;gap:18px;padding:18px 20px 14px;border-bottom:1px solid rgba(255,255,255,.08)}.vnr3-script-window-title{font-size:20px;font-weight:680}.vnr3-script-window-sub{font-size:11px;opacity:.5;margin-top:3px}.vnr3-script-close{width:38px;height:38px;flex:0 0 38px;border:1px solid rgba(255,255,255,.12);border-radius:50%;background:rgba(255,255,255,.07);color:inherit;font-size:23px;cursor:pointer}.vnr3-script-body{flex:1;min-height:0;overflow-y:auto;overscroll-behavior:contain;touch-action:pan-y;-webkit-overflow-scrolling:touch;padding:18px 20px 24px;user-select:text}.vnr3-script-body .vnr3-cont-head{padding:0 0 12px}.vnr3-script-body .vnr3-speech-node{background:rgba(255,255,255,.045);box-shadow:inset 0 1px 0 rgba(255,255,255,.06)}',
        '@media(max-width:720px){.vnr3-shade{align-items:flex-end;padding:0}.vnr3-modal{width:100%;max-height:88vh;border-radius:26px 26px 0 0;padding:18px 16px 24px}.vnr3-toolbar{align-items:stretch;flex-direction:column}.vnr3-search{max-width:none}.vnr3-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.vnr3-detail-head{grid-template-columns:94px 1fr;gap:14px;align-items:center}.vnr3-detail-title{font-size:20px}.vnr3-inline-ops{grid-column:1/-1}.vnr3-song-row{grid-template-columns:minmax(0,1fr)}.vnr3-track{grid-template-columns:24px 38px minmax(0,1fr) auto auto}.vnr3-track>.vnr3-state{display:none}.vnr3-script-layer{inset:26px 358px 76px}.vnr3-script-window{border-radius:24px}}'
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
            if (eng.running && !(eng.queue || []).length && pl && (!pl.system || pl.favoriteSystem)) {
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

    var vnr3BaseFetchPic = _fetchPic;
    _fetchPic = function(song, cb) {
        var direct = song && (song.cover || song.pic || song.picture || song.coverUrl);
        if (!direct && song) {
            var key = _songKey(song);
            v3.playlists().some(function(pl) {
                return (pl.songs || []).some(function(savedSong) {
                    if (_songKey(savedSong) !== key || !savedSong.cover) return false;
                    direct = savedSong.cover;
                    return true;
                });
            });
        }
        if (direct) {
            song.cover = song.cover || direct;
            song.coverUrl = direct;
            cb(direct);
            return;
        }
        return vnr3BaseFetchPic(song, cb);
    };
    if (!eng.__v3FavoriteMediaWrapped) {
        eng.__v3FavoriteMediaWrapped = true;
        function keepFavoriteMedia(song) {
            var favorite = _favByKey(_songKey(song));
            if (!favorite) return;
            favorite.cover = song.cover || song.coverUrl || song.pic || song.picture || favorite.cover || '';
            favorite.coverUrl = favorite.cover;
            favorite.album = song.album || favorite.album || '';
            favorite.source = song.source || favorite.source || '';
            favorite._trackId = song._trackId || song.sourceId || favorite._trackId || '';
            favorite.id = favorite.id || song.id || ('fav-' + Date.now() + '-' + Math.floor(Math.random() * 100000));
        }
        var vnr3BaseToggleFav = eng.toggleFav;
        eng.toggleFav = function(song, say) {
            vnr3BaseToggleFav.call(eng, song, say);
            keepFavoriteMedia(song || {});
            eng.saveStore();
            v3.uiRefresh();
        };
        var vnr3BaseAddFav = eng.addFav;
        eng.addFav = function(song, say) {
            vnr3BaseAddFav.call(eng, song, say);
            keepFavoriteMedia(song || {});
            eng.saveStore();
            v3.uiRefresh();
        };
        var vnr3BaseRemoveFav = eng.removeFav;
        eng.removeFav = function(song) {
            vnr3BaseRemoveFav.call(eng, song);
            v3.uiRefresh();
        };
    }
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
    function selectField(label, value, options) {
        var w = V('vnr3-field');
        w.appendChild(V('vnr3-label', label));
        var sel = E('select', 'vnr3-input');
        (options || []).forEach(function(option) {
            var op = E('option', '', option.label);
            op.value = option.value;
            if (option.value === value) op.selected = true;
            sel.appendChild(op);
        });
        w.appendChild(sel);
        w.input = sel;
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
        var previous = shell.querySelector('.vnr3-shade');
        if (previous) previous.remove();
        var shade = V('vnr3-shade'), card = V('vnr3-modal');
        var head = V('vnr3-modal-head');
        head.appendChild(V('vnr3-modal-title', title));
        head.appendChild(button('×', function() { shade.remove(); }, 'icon'));
        card.appendChild(head);
        shade.appendChild(card);
        shell.appendChild(shade);
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
    function confirmAction(title, note, action) {
        var m = modal(title);
        m.card.appendChild(V('vnr3-hint', note || '此操作无法自动撤销。'));
        var ops = V('vnr3-ops');
        ops.appendChild(button('取消', function() { m.remove(); }));
        ops.appendChild(button('确认', function() {
            m.remove();
            action && action();
        }, 'danger'));
        m.card.appendChild(ops);
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
                confirmAction('删除“' + pl.name + '”？', '歌单及其中的本地歌曲记录会被删除。', function() {
                    v3.deletePlaylist(pl.id);
                    m.remove(); u.view = 'playlists'; renderMain(); renderSidebar();
                });
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
                [].slice.call(m.card.querySelectorAll('.vnr3-import-preview')).forEach(function(x) { x.remove(); });
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
                    confirmAction('完全覆盖当前歌单？', '现有歌曲会被本次解析结果替换。', function() {
                        var r = v3.addSongs(pl.id, result.songs, true);
                        _toast('已覆盖并导入 ' + r.added + ' 首');
                        m.remove(); renderMain();
                    });
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
        if (pl.id === 'now-playing') {
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
            function playlistRank(pl) {
                if (pl.id === 'now-playing') return 0;
                if (pl.id === 'my-favorites') return 1;
                return 2;
            }
            var list = v3.playlists().slice().sort(function(a, b) {
                var ar = playlistRank(a), br = playlistRank(b);
                if (ar !== br) return ar - br;
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
                if (pl.id === 'now-playing') cover.appendChild(V('vnr3-current-chip', '当前'));
                if (pl.id === 'my-favorites') cover.appendChild(V('vnr3-current-chip', '收藏'));
                card.appendChild(cover);
                card.appendChild(V('vnr3-card-name', pl.name || '未命名歌单'));
                var count = pl.id === 'now-playing' ? v3.nowSongs().length : (pl.songs || []).length;
                card.appendChild(V('vnr3-card-sub', count + ' 首歌曲'));
                card.onclick = function() {
                    u.v3PlaylistId = pl.id; v3.state.activePlaylistId = pl.id;
                    u.plFav = false;
                    u.v3ShowScript = false;
                    u.view = 'playlist-detail'; v3.save(); savePos(); renderMain();
                };
                grid.appendChild(card);
            });
            var add = V('vnr3-pl-card vnr3-add-card');
            add.appendChild(V('vnr3-pl-cover vnr3-add-cover', '+'));
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
        var oldAdv = song.advanced || {};
        var volumeMode = oldAdv.volumeMode || (song.advanced ? 'custom' : 'global');
        var duckMode = oldAdv.duckMode || (oldAdv.duck === true ? 'custom' : (oldAdv.duck === false ? 'none' : 'follow'));
        var volMode = selectField('背景音量', volumeMode, [
            { value: 'global', label: '跟随背景音总音量' },
            { value: 'custom', label: '使用自定义音量' }
        ]);
        var vol = field('自定义音量 0-100', oldAdv.volume !== undefined ? oldAdv.volume : 55, 'number');
        var duckModeField = selectField('主持人说话时', duckMode, [
            { value: 'follow', label: '跟随普通音乐压低设置' },
            { value: 'none', label: '保持原音量，不压低' },
            { value: 'custom', label: '压低到自定义音量' }
        ]);
        var duck = field('说话时自定义音量 0-100', oldAdv.duckVolume !== undefined ? oldAdv.duckVolume : 20, 'number');
        adv.appendChild(volMode); adv.appendChild(vol); adv.appendChild(duckModeField); adv.appendChild(duck);
        var loop = V('vnr3-toggle-row'); loop.appendChild(V('', '单曲循环'));
        var loopSw = E('button', 'vnr2-sw' + (!song.advanced || song.advanced.loop !== false ? ' on' : '')); loopSw.appendChild(E('i', '')); loop.appendChild(loopSw); adv.appendChild(loop);
        m.card.appendChild(adv);
        function paintAdv() {
            adv.style.display = sw.classList.contains('on') ? 'grid' : 'none';
            vol.style.display = volMode.input.value === 'custom' ? 'grid' : 'none';
            duck.style.display = duckModeField.input.value === 'custom' ? 'grid' : 'none';
        }
        sw.onclick = function() { sw.classList.toggle('on'); paintAdv(); };
        volMode.input.onchange = paintAdv;
        duckModeField.input.onchange = paintAdv;
        loopSw.onclick = function() { loopSw.classList.toggle('on'); };
        paintAdv();
        var ops = V('vnr3-ops');
        ops.appendChild(button('取消', function() { m.remove(); }));
        ops.appendChild(button('保存', function() {
            if (!title.input.value.trim()) { _toast('歌名不能为空'); return; }
            var data = {
                id: song.id || undefined, title: title.input.value, artist: artist.input.value,
                url: url.input.value, cover: cover.input.value,
                advanced: sw.classList.contains('on') ? {
                    volumeMode: volMode.input.value,
                    volume: Number(vol.input.value) || 55,
                    duckMode: duckModeField.input.value,
                    duckVolume: Number(duck.input.value) || 20,
                    loop: loopSw.classList.contains('on')
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
        var isNowPlaying = pl.id === 'now-playing';
        var isFavorites = pl.id === 'my-favorites';
        var songs = isNowPlaying ? v3.nowSongs() : (pl.songs || []);
        var head = V('vnr3-detail-head');
        var cover = V('vnr3-detail-cover');
        var src = playlistCover(pl);
        if (src) { var img = E('img', ''); img.src = src; cover.appendChild(img); }
        else cover.appendChild(V('vnr3-default-cover', '♫'));
        head.appendChild(cover);
        var info = V('vnr3-detail-info');
        info.appendChild(V('vnr3-kicker', isNowPlaying ? 'CURRENT PLAYLIST' : (isFavorites ? 'FAVORITES' : 'PLAYLIST')));
        info.appendChild(V('vnr3-detail-title', pl.name));
        info.appendChild(V('vnr3-detail-sub', songs.length + ' 首歌曲' + (pl.description ? ' · ' + pl.description : '')));
        var ops = V('vnr3-inline-ops');
        ops.appendChild(button('播放', function() { playPlaylist(pl); }, 'primary'));
        if (!isNowPlaying && !isFavorites) {
            ops.appendChild(button('导入歌单', function() { openImport(pl); }));
            ops.appendChild(button('添加歌曲', function() { openManualAdd(pl); }));
        }
        if (!isFavorites) ops.appendChild(button('设置', function() { openPlaylistSettings(pl); }));
        ops.appendChild(button('查看 / 编辑完整台本', function() { openContinuousPanel(pl); }));
        info.appendChild(ops); head.appendChild(info); box.appendChild(head);
        var bulk = V('vnr3-bulk');
        var selected = {};
        var list = V('vnr3-track-list');
        var selectionHead = V('vnr3-select-head');
        var selectionHint = V('', '已选择 0 / ' + songs.length + ' 首');
        var selectionActions = V('vnr3-select-actions');
        selectionActions.appendChild(button('全选', function() {
            songs.forEach(function(song) { selected[song.id] = true; });
            paintChecks();
        }));
        selectionActions.appendChild(button('取消全选', function() {
            selected = {};
            paintChecks();
        }));
        selectionHead.appendChild(selectionHint);
        selectionHead.appendChild(selectionActions);
        bulk.appendChild(selectionHead);
        bulk.appendChild(V('vnr3-hint', '勾选后可复制、移动、删除或请求台本'));
        var bulkOps = V('vnr3-inline-ops');
        function selectedSongs() {
            return songs.filter(function(s) { return selected[s.id]; });
        }
        function paintChecks() {
            [].slice.call(list.querySelectorAll('.vnr3-check[data-song-id]')).forEach(function(check) {
                check.classList.toggle('on', !!selected[check.dataset.songId]);
            });
            selectionHint.textContent = '已选择 ' + selectedSongs().length + ' / ' + songs.length + ' 首';
        }
        function chooseTarget(move) {
            var picked = selectedSongs();
            if (!picked.length) { _toast('请先勾选歌曲'); return; }
            var targets = v3.playlists().filter(function(x) { return !x.system && x.id !== pl.id; });
            if (!targets.length) { _toast('还没有可用的目标歌单'); return; }
            choice(move ? '移动到歌单' : '复制到歌单', targets.map(function(target) {
                return { label: target.name, note: (target.songs || []).length + ' 首', action: function() {
                    var r;
                    if (isNowPlaying) {
                        r = v3.addSongs(target.id, picked, false);
                        if (move) picked.forEach(function(song) {
                            var items = (eng.current ? [eng.current] : []).concat(eng.queue || []);
                            items.forEach(function(it) { if (it.id === song.queueItemId) eng.removeItem(it); });
                        });
                    } else if (isFavorites) {
                        r = v3.addSongs(target.id, picked, false);
                        if (move) picked.forEach(function(song) { eng.removeFav(song); });
                    } else r = v3.copySongs(pl.id, picked.map(function(s) { return s.id; }), target.id, move);
                    _toast((move ? '已移动 ' : '已复制 ') + r.added + ' 首，跳过重复 ' + r.duplicate + ' 首');
                    renderMain();
                } };
            }));
        }
        bulkOps.appendChild(button('复制到…', function() { chooseTarget(false); }));
        bulkOps.appendChild(button('移动到…', function() { chooseTarget(true); }));
        bulkOps.appendChild(button('删除', function() {
            var picked = selectedSongs();
            if (!picked.length) { _toast('请先勾选歌曲'); return; }
            var deleteNote = isNowPlaying ? '只会从当前播放队列移除已选歌曲。' :
                (isFavorites ? '会将已选歌曲移出“我的收藏”，不会删除其他歌单中的歌曲。' : '只会从这个歌单移除已选歌曲，不影响其他歌单中的同名歌曲。');
            confirmAction('删除已选的 ' + picked.length + ' 首歌曲？', deleteNote, function() {
                if (isNowPlaying) picked.forEach(function(song) {
                    var items = (eng.current ? [eng.current] : []).concat(eng.queue || []);
                    items.forEach(function(it) { if (it.id === song.queueItemId) eng.removeItem(it); });
                });
                else if (isFavorites) picked.forEach(function(song) { eng.removeFav(song); });
                else v3.removeSongs(pl.id, picked.map(function(s) { return s.id; }));
                renderMain();
            });
        }, 'danger'));
        if (isNowPlaying) bulkOps.appendChild(button('请求勾选台本', function() {
            var ids = selectedSongs().map(function(s) { return s.queueItemId; });
            if (!ids.length) { _toast('请先勾选歌曲'); return; }
            v3.requestLinkedScripts(true, ids);
        }, 'primary'));
        var recommend = button('AI 推荐相似歌曲', function() {
            var ref = songs.filter(function(s) { return !Object.keys(selected).length || selected[s.id]; });
            openRecommend(ref, pl);
        });
        bulkOps.appendChild(recommend);
        if (!isNowPlaying && !isFavorites) bulkOps.appendChild(button('清空歌单', function() {
            confirmAction('清空“' + pl.name + '”？', '歌单会保留，但其中歌曲将全部移除。', function() {
                pl.songs = []; v3.save(); renderMain();
            });
        }, 'danger'));
        bulk.appendChild(bulkOps); box.appendChild(bulk);
        if (!songs.length) list.appendChild(V('vnr2-empty', '这个歌单还没有歌曲。'));
        songs.forEach(function(song, index) {
            var row = V('vnr3-track');
            var ck = E('button', 'vnr3-check'); ck.type = 'button'; ck.textContent = '';
            ck.dataset.songId = song.id;
            ck.title = '选择“' + (song.title || '这首歌曲') + '”';
            ck.onclick = function() { selected[song.id] = !selected[song.id]; paintChecks(); };
            row.appendChild(ck);
            var pic = V('vnr3-track-pic');
            if (song.cover) { var im = E('img', ''); im.src = song.cover; pic.appendChild(im); } else pic.textContent = '♫';
            row.appendChild(pic);
            var tx = V('vnr3-track-text');
            tx.appendChild(V('vnr3-track-title', song.title || '未命名歌曲'));
            tx.appendChild(V('vnr3-track-sub', song.artist || '未填写歌手'));
            row.appendChild(tx);
            if (song.pendingMatch || song.matchError) row.appendChild(V('vnr3-state', '待匹配'));
            var favoriteButton = button('', function() {
                eng.toggleFav(song, song.say || '');
                renderMain();
            }, 'icon');
            favoriteButton.title = _isFav(song) ? '移出我的收藏' : '收入我的收藏';
            favoriteButton.innerHTML = icon2(_isFav(song) ? 'heartF' : 'heart');
            row.appendChild(favoriteButton);
            row.appendChild(button('•••', function() {
                choice(song.title || '歌曲操作', [
                    { label: '编辑歌曲', action: function() { if (!isNowPlaying && !isFavorites) openSongEditor(pl, song); } },
                    { label: '立即播放', action: function() { eng.queueSong(song, true); } },
                    { label: '加入正在播放', action: function() { eng.queueSong(song, false); } },
                    { label: '删除', action: function() {
                        if (isNowPlaying) {
                            var items = (eng.current ? [eng.current] : []).concat(eng.queue || []);
                            items.forEach(function(it) { if (it.id === song.queueItemId) eng.removeItem(it); });
                        } else if (isFavorites) eng.removeFav(song);
                        else v3.removeSongs(pl.id, [song.id]);
                        renderMain();
                    } }
                ]);
            }, 'icon'));
            list.appendChild(row);
        });
        box.appendChild(list);
        if (!isNowPlaying && !isFavorites) box.appendChild(button('＋ 添加一首歌曲', function() { openSongEditor(pl, null); }, 'vnr3-wide-add'));
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
        var currentSleep = v3.state.sleep && v3.state.sleep.active ? v3.state.sleep : null;
        var minutes = field('自定义时长（分钟，可直接输入）', currentSleep ? currentSleep.durationMinutes : 30, 'number');
        minutes.input.min = '0.05';
        minutes.input.step = '0.05';
        minutes.input.inputMode = 'decimal';
        minutes.input.placeholder = '例如 12、37.5 或 120';
        var limit = field('最多自动请求次数', 5, 'number');
        m.card.appendChild(V('vnr3-segment', ''));
        var presets = m.card.lastChild;
        [15, 30, 45, 60, 90].forEach(function(n) {
            presets.appendChild(button(n + ' 分钟', function() { minutes.input.value = n; }));
        });
        m.card.appendChild(minutes);
        m.card.appendChild(V('vnr3-hint', '上方快捷按钮只是预设；也可以在输入框填写任意分钟数。'));
        m.card.appendChild(limit);
        var loop = V('vnr3-toggle-row'); loop.appendChild(V('', '次数耗尽后循环已有内容'));
        var sw = E('button', 'vnr2-sw'); sw.appendChild(E('i', '')); sw.onclick = function() { sw.classList.toggle('on'); }; loop.appendChild(sw);
        m.card.appendChild(loop);
        if (v3.state.sleep && v3.state.sleep.active) {
            m.card.appendChild(button('取消当前倒计时', function() { v3.cancelSleep(); m.remove(); renderBottomBar(); }, 'danger'));
        }
        var ops = V('vnr3-ops');
        ops.appendChild(button('关闭', function() { m.remove(); }));
        ops.appendChild(button('开始', function() {
            var value = parseFloat(minutes.input.value);
            if (!isFinite(value) || value <= 0) { _toast('请输入大于 0 的倒计时时长'); minutes.input.focus(); return; }
            v3.startSleep(value, limit.input.value, sw.classList.contains('on'), 'current');
            m.remove(); renderBottomBar();
        }, 'primary'));
        m.card.appendChild(ops);
    }

    function openBackgrounds() {
        var m = modal('高级背景音');
        var songs = v3.advancedSongs();
        var master = field('背景音总音量 0-100', v3.state.backgroundMasterVolume === undefined ? 100 : v3.state.backgroundMasterVolume, 'number');
        master.input.onchange = function() {
            v3.state.backgroundMasterVolume = Number(master.input.value) || 0;
            v3.save();
            v3.refreshBackgroundVolumes();
        };
        m.card.appendChild(master);
        if (!songs.length) m.card.appendChild(V('vnr2-empty', '暂无开启高级播放参数的音频。请在歌单中编辑歌曲并展开高级参数。'));
        var list = V('vnr3-preview-list');
        songs.forEach(function(song) {
            var key = song.id || song.title;
            var adv = song.advanced || {};
            var row = V('vnr3-bg-row' + (adv.error ? ' error' : ''));
            var ck = E('button', 'vnr3-check' + (v3.state.backgroundChecked[key] ? ' on' : ''));
            ck.type = 'button';
            ck.onclick = function() {
                v3.state.backgroundChecked[key] = !v3.state.backgroundChecked[key];
                ck.classList.toggle('on', !!v3.state.backgroundChecked[key]);
                v3.save();
            };
            row.appendChild(ck);
            var info = V('');
            info.appendChild(V('vnr3-track-title', song.title));
            info.appendChild(V('vnr3-track-sub', adv.error ? adv.error : (song.artist || '独立音频')));
            row.appendChild(info);
            var play = button(v3.audio[key] ? '停止' : '播放', function() {
                if (v3.audio[key]) v3.stopBackground(key); else v3.playBackground(song);
                play.textContent = v3.audio[key] ? '停止' : '播放';
                ck.classList.toggle('on', !!v3.state.backgroundChecked[key]);
            }, v3.audio[key] ? '' : 'primary');
            row.appendChild(play);
            var settings = V('vnr3-bg-settings');
            var legacyVolumeMode = adv.volumeMode || 'custom';
            var vm = selectField('背景音量', legacyVolumeMode, [
                { value: 'global', label: '跟随总音量' },
                { value: 'custom', label: '自定义音量' }
            ]);
            var vv = field('自定义音量 0-100', adv.volume !== undefined ? adv.volume : 55, 'number');
            var legacyDuckMode = adv.duckMode || (adv.duck === true ? 'custom' : (adv.duck === false ? 'none' : 'follow'));
            var dm = selectField('主持人说话时', legacyDuckMode, [
                { value: 'follow', label: '跟随普通音乐' },
                { value: 'none', label: '保持音量' },
                { value: 'custom', label: '自定义压低音量' }
            ]);
            var dv = field('说话时音量 0-100', adv.duckVolume !== undefined ? adv.duckVolume : 20, 'number');
            var loop = V('vnr3-toggle-row');
            loop.appendChild(V('', '单曲循环'));
            var loopSw = E('button', 'vnr2-sw' + (adv.loop !== false ? ' on' : ''));
            loopSw.appendChild(E('i', ''));
            loop.appendChild(loopSw);
            settings.appendChild(vm); settings.appendChild(vv); settings.appendChild(dm); settings.appendChild(dv); settings.appendChild(loop);
            row.appendChild(settings);
            function saveAdvanced() {
                adv.volumeMode = vm.input.value;
                adv.volume = Number(vv.input.value) || 55;
                adv.duckMode = dm.input.value;
                adv.duckVolume = Number(dv.input.value) || 20;
                adv.loop = loopSw.classList.contains('on');
                song.advanced = adv;
                vv.style.display = adv.volumeMode === 'custom' ? 'grid' : 'none';
                dv.style.display = adv.duckMode === 'custom' ? 'grid' : 'none';
                if (v3.audio[key] && v3.audio[key].audio) v3.audio[key].audio.loop = adv.loop;
                v3.save();
                v3.refreshBackgroundVolumes();
            }
            vm.input.onchange = saveAdvanced;
            vv.input.onchange = saveAdvanced;
            dm.input.onchange = saveAdvanced;
            dv.input.onchange = saveAdvanced;
            loopSw.onclick = function() { loopSw.classList.toggle('on'); saveAdvanced(); };
            saveAdvanced();
            list.appendChild(row);
        });
        m.card.appendChild(list);
        var ops = V('vnr3-ops');
        ops.appendChild(button('停止全部', function() { v3.stopAllBackgrounds(); m.remove(); }));
        ops.appendChild(button('开始播放勾选项', function() { v3.playSelectedBackgrounds(); m.remove(); }, 'primary'));
        m.card.appendChild(ops);
    }

    function openContinuousPanel(pl) {
        var old = stage.querySelector('.vnr3-script-layer');
        if (old) old.remove();
        var layer = V('vnr3-script-layer');
        var panel = V('vnr3-script-window');
        var head = V('vnr3-script-window-head');
        var title = V('');
        title.appendChild(V('vnr3-script-window-title', '完整台本'));
        title.appendChild(V('vnr3-script-window-sub', (pl && pl.name || '当前歌单') + ' · 阅读、编辑与播放'));
        head.appendChild(title);
        var close = E('button', 'vnr3-script-close', '×');
        close.type = 'button';
        close.title = '关闭完整台本';
        close.onclick = function() { layer.remove(); };
        head.appendChild(close);
        panel.appendChild(head);
        var body = V('vnr3-script-body');
        panel.appendChild(body);
        layer.appendChild(panel);
        stage.appendChild(layer);
        function paint() {
            var y = body.scrollTop || 0;
            body.innerHTML = '';
            body.__vnr3Refresh = paint;
            renderContinuous(body, pl);
            body.scrollTop = y;
        }
        paint();
    }

    function renderContinuous(box, pl) {
        function refreshContinuous() {
            if (box && typeof box.__vnr3Refresh === 'function') box.__vnr3Refresh();
            else renderMain();
        }
        pl = pl || v3.currentPlaylist() || v3.playlist('now-playing');
        var head = V('vnr3-cont-head');
        var version = v3.activeContinuous(pl.id);
        var title = V('');
        title.appendChild(V('vnr3-title', pl.name + ' · 完整台本'));
        title.appendChild(V('vnr3-sub', version ? version.title : '这个歌单还没有完整台本'));
        head.appendChild(title);
        var ops = V('vnr3-inline-ops');
        ops.appendChild(button('请求完整台本', function() {
            v3.state.activePlaylistId = pl.id;
            v3.setMode('companion');
            v3.requestCompanion(true);
        }, 'primary'));
        ops.appendChild(button('新建空白台本', function() {
            var fresh = { id: 'continuous-' + Date.now(), playlistId: pl.id, title: '自定义完整台本', createdAt: Date.now(), favorite: false, edited: true, nodes: [] };
            v3.state.continuousVersions.unshift(fresh);
            v3.state.activeContinuousIds[pl.id] = fresh.id;
            v3.state.activeContinuousId = fresh.id;
            v3.save();
            refreshContinuous();
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
                        refreshContinuous();
                    } catch (e) { _toast('JSON 无效：' + e.message); }
                }, 'primary'));
                rawModal.card.appendChild(rawOps);
            }));
        }
        head.appendChild(ops); box.appendChild(head);
        var versions = (v3.state.continuousVersions || []).filter(function(item) {
            return (item.playlistId || 'now-playing') === pl.id;
        });
        if (versions.length) {
            var versionSelect = selectField('台本历史版本', version && version.id || '', versions.map(function(item, index) {
                return {
                    value: item.id,
                    label: (item.favorite ? '★ ' : '') + (item.title || ('台本 ' + (index + 1)))
                };
            }));
            versionSelect.input.onchange = function() {
                v3.state.activeContinuousIds[pl.id] = versionSelect.input.value;
                v3.state.activeContinuousId = versionSelect.input.value;
                v3.save();
                refreshContinuous();
            };
            box.appendChild(versionSelect);
        }
        if (!version) {
            box.appendChild(V('vnr2-empty', '这个歌单还没有完整台本。可以请求 AI 生成，也可以新建空白台本后自己编辑。'));
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
                pause.appendChild(button('删除', function() { nodes.splice(index, 1); version.edited = true; refreshContinuous(); }, 'icon'));
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
            no.appendChild(button('复制', function() { nodes.splice(index + 1, 0, JSON.parse(JSON.stringify(node))); nodes[index + 1].id = 'speech-' + Date.now(); refreshContinuous(); }));
            no.appendChild(button('在后面插入停顿', function() { nodes.splice(index + 1, 0, { id: 'pause-' + Date.now(), type: 'pause', seconds: 15 }); refreshContinuous(); }));
            no.appendChild(button('删除', function() { nodes.splice(index, 1); refreshContinuous(); }, 'danger'));
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
            refreshContinuous();
        }));
        save.appendChild(button('添加停顿', function() {
            nodes.push({ id: 'pause-' + Date.now(), type: 'pause', seconds: 15 });
            version.edited = true;
            refreshContinuous();
        }));
        save.appendChild(button('保存当前编辑', function() { version.edited = true; v3.save(); _toast('台本已保存'); }, 'primary'));
        save.appendChild(button(version.favorite ? '取消收藏' : '收藏版本', function() { version.favorite = !version.favorite; v3.save(); refreshContinuous(); }));
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
                    u.view = 'playlists';
                    u.sidesOpen = true;
                    u.plFav = false;
                    savePos();
                    drawShell();
                };
            }
            if ((links[i].textContent || '').indexOf('Favorites') >= 0 || (links[i].textContent || '').indexOf('我的收藏') >= 0) {
                var favoriteLink = links[i];
                var favoriteLabel = favoriteLink.querySelector('span');
                if (favoriteLabel) favoriteLabel.textContent = '我的收藏 · ' + ((eng.store.favoriteSongs || []).length);
                favoriteLink.classList.toggle('on', u.view === 'playlist-detail' && u.v3PlaylistId === 'my-favorites');
                favoriteLink.onclick = function() {
                    u.sidesOpen = true;
                    u.plFav = false;
                    u.v3PlaylistId = 'my-favorites';
                    v3.state.activePlaylistId = 'my-favorites';
                    u.view = 'playlist-detail';
                    v3.save();
                    savePos();
                    drawShell();
                };
            }
        }
    };

    var oldRenderMain = renderMain;
    var vnr3ViewScroll = u.vnr3ViewScroll || (u.vnr3ViewScroll = {});
    var vnr3RenderedView = u.view;
    function rememberV3Scroll(view) {
        var scroller = main.querySelector('.vnr2-set,.vnr3-detail-scroll,.vnr3-grid');
        if (scroller) vnr3ViewScroll[view] = scroller.scrollTop || 0;
    }
    function restoreV3Scroll(view) {
        var scroller = main.querySelector('.vnr2-set,.vnr3-detail-scroll,.vnr3-grid');
        if (!scroller) return;
        scroller.scrollTop = vnr3ViewScroll[view] || 0;
        scroller.onscroll = function() { vnr3ViewScroll[view] = scroller.scrollTop || 0; };
        TOP.requestAnimationFrame(function() {
            if (scroller.isConnected) scroller.scrollTop = vnr3ViewScroll[view] || 0;
        });
    }
    renderMain = function() {
        rememberV3Scroll(vnr3RenderedView);
        if (u.view === 'continuous') u.view = 'playlists';
        if (u.view !== 'playlists' && u.view !== 'playlist-detail') {
            oldRenderMain();
            if (u.view === 'artist') augmentArtistShortPersona(main);
            restoreV3Scroll(u.view);
            vnr3RenderedView = u.view;
            return;
        }
        main.innerHTML = '';
        var head = V('vnr2-main-head');
        var tt = V('');
        tt.appendChild(V('vnr2-h1', u.view === 'playlist-detail' ? 'Playlist' : 'All Playlists'));
        tt.appendChild(V('vnr2-h1s', eng.apiStatus && eng.apiStatus.state === 'loading' ? '正在请求' + (eng.apiStatus.label || '') : statusText()));
        head.appendChild(tt);
        head.appendChild(ib('vnr2-mini30', 'minus', '收起到播放条', function() { u.mode = 'bar'; savePos(); drawShell(); }));
        main.appendChild(head);
        var status = V('vnr2-status-row', statusText() + ' · ' + songTitle(curSong()));
        main.appendChild(status); main.__status = status;
        if (u.view === 'playlists') renderPlaylists(main);
        else {
            var detailScroll = V('vnr3-detail-scroll');
            detailScroll.addEventListener('wheel', function(e) { e.stopPropagation(); }, { passive: true });
            detailScroll.addEventListener('touchmove', function(e) { e.stopPropagation(); }, { passive: true });
            main.appendChild(detailScroll);
            renderPlaylistDetail(detailScroll);
        }
        restoreV3Scroll(u.view);
        vnr3RenderedView = u.view;
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
        if (ghosts[2]) {
            ghosts[2].classList.remove('ghost');
            ghosts[2].title = '待处理台本';
            ghosts[2].onclick = openPendingScripts;
        }
        var card = bbar.querySelector('.vnr2-songcard');
        if (card) {
            var icons = card.querySelector('.vnr2-sc-icons');
            if (icons) {
                icons.innerHTML = '';
                var timerButton = E('button', 'vnr3-sc-action');
                timerButton.type = 'button';
                timerButton.title = '睡眠倒计时';
                timerButton.innerHTML = (v3.sleepLabel() ? '<span class="vnr3-timer-label">' + v3.sleepLabel() + '</span>' : '') + icon2('speaker2');
                timerButton.onclick = openSleep;
                var backgroundsButton = E('button', 'vnr3-sc-action');
                backgroundsButton.type = 'button';
                backgroundsButton.title = '高级背景音管理';
                backgroundsButton.innerHTML = icon2('more');
                backgroundsButton.onclick = openBackgrounds;
                icons.appendChild(timerButton);
                icons.appendChild(backgroundsButton);
            }
        }
    };

    try {
        TOP.addEventListener('vnm-radio-v3-refresh', function() {
            try {
                if (u.mode === 'studio') {
                    renderBottomBar();
                    if (/^(playlists|playlist-detail)$/.test(u.view || '')) renderMain();
                    var scriptBody = stage.querySelector('.vnr3-script-body');
                    if (scriptBody && typeof scriptBody.__vnr3Refresh === 'function') scriptBody.__vnr3Refresh();
                }
            } catch (e) {}
        });
    } catch (e) {}
})();
