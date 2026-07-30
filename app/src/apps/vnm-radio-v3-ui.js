/* vnm-radio v3 UI augmentation.
 * Inserted inside ensureShell(), where E/ib/icon2/renderMain helpers exist.
 */
(function vnr3InstallUi() {
    if (!eng.v3 || shell.__v3UiInstalled) return;
    shell.__v3UiInstalled = true;
    var v3 = eng.v3;

    st.textContent += [
        '.vnr3-btn{appearance:none;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.07);color:inherit;border-radius:14px;padding:10px 14px;font:inherit;cursor:pointer;transition:.18s ease}',
        '.vnr3-btn:hover{background:rgba(255,255,255,.12)}',
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
        '.vnr3-pl-card:hover{background:rgba(255,255,255,.08)}',
        '.vnr3-pl-cover,.vnr3-add-cover,.vnr3-detail-cover{position:relative;aspect-ratio:1/1;overflow:hidden;border-radius:17px;background:linear-gradient(145deg,rgba(255,255,255,.12),rgba(0,0,0,.15));box-shadow:0 12px 30px rgba(0,0,0,.18)}',
        '.vnr3-pl-cover img,.vnr3-detail-cover img{width:100%;height:100%;object-fit:cover}.vnr3-default-cover{height:100%;display:grid;place-items:center;color:rgba(255,255,255,.52);font-size:34px}',
        '.vnr3-current-chip{position:absolute;left:8px;bottom:8px;padding:4px 7px;border-radius:9px;background:rgba(20,20,22,.7);backdrop-filter:blur(8px);font-size:10px}',
        '.vnr3-card-name{font-weight:620;margin-top:9px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
        '.vnr3-add-cover{width:100%;height:auto;aspect-ratio:1/1;border:1px dashed rgba(255,255,255,.2);box-shadow:none;font-size:38px;display:grid;place-items:center;color:rgba(255,255,255,.52)}.vnr3-add-card{min-height:0}',
        '.vnr3-detail-nav{display:flex;align-items:center;min-height:38px;margin:0 0 12px}.vnr3-back{appearance:none;border:0;background:transparent;color:inherit;display:inline-flex;align-items:center;gap:7px;padding:7px 10px 7px 5px;border-radius:12px;font:inherit;font-size:13px;cursor:pointer;opacity:.76}.vnr3-back:hover{background:rgba(255,255,255,.075);opacity:1}.vnr3-back-chevron{width:25px;height:25px;border-radius:50%;display:grid;place-items:center;background:rgba(255,255,255,.085);font-size:22px;font-weight:300;line-height:1}',
        '.vnr3-detail-head{display:grid;grid-template-columns:138px minmax(0,1fr);gap:24px;align-items:center;margin:0 0 22px;padding:18px;border:1px solid rgba(255,255,255,.075);border-radius:25px;background:rgba(255,255,255,.032);box-shadow:inset 0 1px 0 rgba(255,255,255,.055)}.vnr3-detail-title{font-size:27px;font-weight:680;margin:5px 0}.vnr3-kicker{font-size:10px;letter-spacing:.16em;opacity:.52}.vnr3-detail-actions{display:flex;align-items:center;gap:7px;flex-wrap:wrap;margin-top:16px}.vnr3-detail-actions .vnr3-btn{min-height:38px;padding:8px 13px;border-radius:13px;border-color:rgba(255,255,255,.11);background:rgba(0,0,0,.14);font-size:13px}.vnr3-detail-actions .vnr3-btn:hover,.vnr3-detail-actions .vnr3-btn.primary:hover{background:rgba(255,255,255,.095)}.vnr3-detail-actions .vnr3-btn.primary{background:rgba(0,0,0,.14);border-color:rgba(255,255,255,.11);color:inherit;font-weight:inherit}.vnr3-play-action{display:inline-flex;align-items:center;gap:8px;padding-left:7px!important}.vnr3-play-glyph{width:25px;height:25px;border-radius:50%;display:grid;place-items:center;background:rgba(255,255,255,.105);font-size:10px;line-height:1;padding-left:1px}',
        '.vnr3-detail-scroll{flex:1;min-height:0;overflow-y:auto;overflow-x:hidden;overscroll-behavior:contain;touch-action:pan-y;-webkit-overflow-scrolling:touch;padding-right:7px;scrollbar-width:thin}.vnr3-detail-scroll::-webkit-scrollbar{width:6px}.vnr3-detail-scroll::-webkit-scrollbar-thumb{background:rgba(255,255,255,.18);border-radius:999px}.vnr3-bulk{margin:0 0 14px;padding:14px 15px;border:1px solid rgba(255,255,255,.075);border-radius:20px;background:rgba(255,255,255,.026)}.vnr3-select-head{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}.vnr3-select-count{font-size:14px;font-weight:620}.vnr3-select-actions{display:flex;gap:2px;padding:3px;border-radius:12px;background:rgba(0,0,0,.15)}.vnr3-select-actions .vnr3-btn{border:0;background:transparent;padding:6px 10px;border-radius:9px;font-size:12px;opacity:.7}.vnr3-select-actions .vnr3-btn:hover{background:rgba(255,255,255,.075);opacity:1}.vnr3-bulk-actions{display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-top:12px;padding-top:11px;border-top:1px solid rgba(255,255,255,.065)}.vnr3-bulk-actions .vnr3-btn,.vnr3-bulk-actions .vnr3-btn.primary,.vnr3-bulk-actions .vnr3-btn.danger{min-height:34px;padding:7px 11px;border-radius:11px;border-color:rgba(255,255,255,.1);background:rgba(0,0,0,.14);color:inherit;font-size:12px;font-weight:inherit}.vnr3-bulk-actions .vnr3-btn:hover,.vnr3-bulk-actions .vnr3-btn.primary:hover,.vnr3-bulk-actions .vnr3-btn.danger:hover{background:rgba(255,255,255,.085)}',
        '.vnr3-song-list,.vnr3-node-list{display:grid;gap:7px}.vnr3-song-row,.vnr3-node,.vnr3-persona{border:1px solid rgba(255,255,255,.08);border-radius:17px;background:rgba(255,255,255,.035);padding:12px}',
        '.vnr3-song-row{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:12px}.vnr3-song-title{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
        '.vnr3-track-list{display:grid;gap:7px;align-content:start;overflow:visible;margin-top:10px}.vnr3-script-body::-webkit-scrollbar{width:5px}.vnr3-script-body::-webkit-scrollbar-thumb{background:rgba(255,255,255,.16);border-radius:999px}.vnr3-track{display:grid;grid-template-columns:26px 42px minmax(0,1fr) auto auto auto;align-items:center;gap:10px;border-radius:16px;padding:8px;background:rgba(255,255,255,.035)}',
        '.vnr3-check{position:relative;width:22px;height:22px;padding:0;border:1px solid rgba(255,255,255,.28);border-radius:50%;background:rgba(255,255,255,.045);box-shadow:inset 0 1px 0 rgba(255,255,255,.09);transition:background .14s,border-color .14s,box-shadow .14s;cursor:pointer}.vnr3-check:hover{border-color:rgba(255,255,255,.52);background:rgba(255,255,255,.09)}.vnr3-check.on{border-color:rgba(255,255,255,.94);background:rgba(255,255,255,.94);box-shadow:0 0 0 3px rgba(255,255,255,.1),inset 0 1px 0 rgba(255,255,255,.34)}.vnr3-check.on:after{content:"";position:absolute;left:7px;top:3px;width:5px;height:10px;border:solid rgba(20,20,22,.96);border-width:0 2px 2px 0;transform:rotate(45deg)}.vnr3-track-pic{width:42px;height:42px;border-radius:11px;overflow:hidden;display:grid;place-items:center;background:rgba(255,255,255,.08)}.vnr3-track-pic img{width:100%;height:100%;object-fit:cover}.vnr3-track-title,.vnr3-track-sub{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.vnr3-track-sub{opacity:.55;font-size:11px}',
        '.vnr3-speech-node,.vnr3-pause-node{border:1px solid rgba(255,255,255,.08);border-radius:17px;background:rgba(255,255,255,.035);padding:12px}.vnr3-pause-node{display:flex;align-items:center;justify-content:center;gap:10px;border-style:dashed}.vnr3-pause-input{width:70px;border:1px solid rgba(255,255,255,.1);border-radius:10px;background:rgba(0,0,0,.15);color:inherit;padding:8px}.vnr3-node-ops{display:flex;flex-wrap:wrap;gap:7px;margin-top:8px}',
        '.vnr3-node-head,.vnr3-persona-head{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:8px}',
        '.vnr3-segment{display:flex;gap:6px;flex-wrap:wrap}.vnr3-segment .vnr3-btn.on{background:rgba(255,255,255,.18)}',
        '.vnr3-sc-action{appearance:none;border:0;background:transparent;color:inherit;display:inline-flex;align-items:center;gap:4px;padding:4px;border-radius:9px;cursor:pointer}.vnr3-sc-action:hover{background:rgba(255,255,255,.1)}.vnr3-sc-action svg{width:16px;height:16px}.vnr3-timer-label{font-size:9px;white-space:nowrap;opacity:.72}',
        '.vnr3-bg-row{display:grid;grid-template-columns:22px minmax(0,1fr) auto auto;gap:9px;align-items:center;padding:10px;border-radius:15px;background:rgba(255,255,255,.035)}.vnr3-bg-settings{grid-column:1/-1;display:grid;grid-template-columns:1fr 1fr;gap:8px;padding-top:8px}.vnr3-bg-settings .vnr3-field{margin:0}.vnr3-bg-row.error{opacity:.48}',
        '.vnr2-set{overscroll-behavior:contain;touch-action:pan-y;-webkit-overflow-scrolling:touch;pointer-events:auto}',
        '.vnr3-status-error{opacity:.55;text-decoration:line-through}.vnr3-persona{margin:12px 0}.vnr3-persona textarea{min-height:110px}',
        '.vnr3-script-layer{position:absolute;inset:34px 330px 82px;z-index:40;pointer-events:auto;display:flex;align-items:stretch;justify-content:center}.vnr3-script-window{width:100%;min-width:0;display:flex;flex-direction:column;overflow:hidden;border:1px solid rgba(255,255,255,.16);border-radius:30px;background:linear-gradient(145deg,rgba(77,84,101,.78),rgba(34,38,48,.82));box-shadow:0 28px 90px rgba(0,0,0,.42),inset 0 1px 0 rgba(255,255,255,.13);backdrop-filter:blur(38px) saturate(130%);-webkit-backdrop-filter:blur(38px) saturate(130%)}',
        '.vnr3-script-window-head{display:flex;align-items:center;justify-content:space-between;gap:18px;padding:18px 20px 14px;border-bottom:1px solid rgba(255,255,255,.08)}.vnr3-script-window-title{font-size:20px;font-weight:680}.vnr3-script-window-sub{font-size:11px;opacity:.5;margin-top:3px}.vnr3-script-close{width:38px;height:38px;flex:0 0 38px;border:1px solid rgba(255,255,255,.12);border-radius:50%;background:rgba(255,255,255,.07);color:inherit;font-size:23px;cursor:pointer}.vnr3-script-body{flex:1;min-height:0;overflow-y:auto;overscroll-behavior:contain;touch-action:pan-y;-webkit-overflow-scrolling:touch;padding:18px 20px 24px;user-select:text}.vnr3-script-body .vnr3-cont-head{padding:0 0 12px}.vnr3-script-body .vnr3-speech-node{background:rgba(255,255,255,.045);box-shadow:inset 0 1px 0 rgba(255,255,255,.06)}',
        '.vnr3-library-toolbar{display:grid;grid-template-columns:auto minmax(180px,320px);gap:12px;align-items:end;margin-bottom:18px;padding:10px;border:1px solid rgba(255,255,255,.09);border-radius:20px;background:rgba(255,255,255,.045)}.vnr3-library-toolbar .vnr3-field{margin:0}.vnr3-library-cache{display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding:12px 14px;border:1px solid rgba(255,255,255,.09);border-radius:18px;background:rgba(255,255,255,.04);margin-bottom:14px}.vnr3-queue-script{display:grid;gap:9px;margin-bottom:12px}.vnr3-queue-script-head{display:flex;align-items:center;justify-content:space-between;gap:10px}.vnr3-cache-badge{font-size:11px;opacity:.62}',
        '.vnr3-library-dashboard{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(250px,.75fr);gap:14px;margin:14px 0 18px}.vnr3-library-pane{min-width:0;border:1px solid rgba(255,255,255,.1);border-radius:22px;background:rgba(14,17,24,.2);box-shadow:inset 0 1px 0 rgba(255,255,255,.06);padding:14px}.vnr3-library-pane-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:11px}.vnr3-library-pane-title{font-size:14px;font-weight:650}.vnr3-version-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;max-height:224px;overflow:auto;padding-right:3px}.vnr3-version-card{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;align-items:center;border:1px solid rgba(255,255,255,.08);border-radius:16px;background:rgba(255,255,255,.045);padding:11px;cursor:pointer}.vnr3-version-card:hover{background:rgba(255,255,255,.08)}.vnr3-version-card.on{background:rgba(255,255,255,.14);border-color:rgba(255,255,255,.19)}.vnr3-version-name{font-size:13px;font-weight:620;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.vnr3-version-meta{font-size:10px;opacity:.5;margin-top:3px}.vnr3-queue-list{display:grid;gap:7px;max-height:174px;overflow:auto}.vnr3-queue-row{display:grid;grid-template-columns:22px minmax(0,1fr) auto;gap:7px;align-items:center;border-radius:14px;background:rgba(255,255,255,.05);padding:8px 9px}.vnr3-queue-index{width:20px;height:20px;border-radius:7px;background:rgba(255,255,255,.09);display:grid;place-items:center;font-size:10px}.vnr3-mini-action{appearance:none;border:0;background:rgba(255,255,255,.07);color:inherit;width:27px;height:27px;border-radius:50%;cursor:pointer}.vnr3-mini-action:hover{background:rgba(255,255,255,.14)}.vnr3-editor-surface{border-top:1px solid rgba(255,255,255,.08);padding-top:17px}.vnr3-track-action{width:34px!important;height:34px!important;border-radius:50%!important;border:1px solid rgba(255,255,255,.13)!important;background:rgba(255,255,255,.055)!important;padding:0!important;display:grid!important;place-items:center!important;font-size:15px!important;line-height:1!important}.vnr3-track-action:hover{background:rgba(255,255,255,.12)!important}.vnr3-track-action svg{width:16px!important;height:16px!important;stroke-width:1.7}',
        '.vnr3-song-scripts{margin-top:14px;border:1px solid rgba(255,255,255,.1);border-radius:20px;background:rgba(255,255,255,.035);overflow:hidden}.vnr3-song-scripts>summary{cursor:pointer;list-style:none;padding:14px 16px;font-size:14px;font-weight:650;display:flex;justify-content:space-between}.vnr3-song-scripts>summary::-webkit-details-marker{display:none}.vnr3-song-script-workspace{padding:0 14px 14px;border-top:1px solid rgba(255,255,255,.07)}.vnr3-song-script-toolbar{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;padding:12px 0}.vnr3-song-script-list{display:grid;gap:7px;max-height:210px;overflow:auto}.vnr3-song-script-row{display:grid;grid-template-columns:30px minmax(0,1fr) auto auto;align-items:center;gap:8px;padding:9px;border-radius:15px;background:rgba(255,255,255,.05);border:1px solid transparent}.vnr3-song-script-row.on{border-color:rgba(255,255,255,.2);background:rgba(255,255,255,.1)}.vnr3-song-script-editor{margin-top:10px;padding:12px;border-radius:16px;background:rgba(0,0,0,.14);border:1px solid rgba(255,255,255,.08)}',
        '@media(max-width:720px){.vnr3-shade{align-items:flex-end;padding:0}.vnr3-modal{width:100%;max-height:88vh;border-radius:26px 26px 0 0;padding:18px 16px 24px}.vnr3-toolbar{align-items:stretch;flex-direction:column}.vnr3-search{max-width:none}.vnr3-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.vnr3-detail-head{grid-template-columns:88px minmax(0,1fr);gap:14px;padding:13px}.vnr3-detail-title{font-size:20px}.vnr3-detail-actions{grid-column:1/-1;margin-top:10px}.vnr3-detail-actions .vnr3-btn{flex:1 1 auto}.vnr3-inline-ops{grid-column:1/-1}.vnr3-song-row{grid-template-columns:minmax(0,1fr)}.vnr3-track{grid-template-columns:24px 38px minmax(0,1fr) auto auto}.vnr3-track>.vnr3-state{display:none}.vnr3-script-layer{inset:26px 358px 76px}.vnr3-script-window{border-radius:24px}.vnr3-library-dashboard{grid-template-columns:1fr}.vnr3-version-grid{grid-template-columns:1fr}}'
    ].join('');

    if (!eng.__v3RequestWrapped) {
        eng.__v3RequestWrapped = true;
        var vnr3OldRequest = eng.request;
        eng.request = function() {
            if (v3.state.mode !== 'recommend' && !v3.manualApiBypass) return;
            if (!v3.manualApiBypass && !v3.consumeAutoRequest()) {
                _toast('睡眠模式的自动请求次数已用完');
                return;
            }
            return vnr3OldRequest.apply(eng, arguments);
        };
        var vnr3OldNext = eng.next;
        eng.next = function() {
            if (v3.sleepStopPending) return;
            if (eng.running && v3.state.mode === 'playlist' && !(eng.queue || []).length) {
                var replayPlaylist = v3.playlistForQueueItem(eng.current);
                if (replayPlaylist && (replayPlaylist.songs || []).length) {
                    v3.loadPlaylist(replayPlaylist.id, false);
                    return vnr3OldNext.apply(eng, arguments);
                }
                /* 找不到来源歌单时宁可结束，也不回退到旧的最近历史补队列。 */
                eng.current = null;
                eng.running = false;
                eng.paused = true;
                eng.saveQueue();
                v3.uiRefresh();
                return;
            }
            var pl = v3.currentPlaylist();
            var sleep = v3.state.sleep;
            if (eng.running && v3.state.mode !== 'playlist' && !(eng.queue || []).length && pl && (!pl.system || pl.favoriteSystem)) {
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
        var backdropArmed = false;
        shade.onpointerdown = function(ev) { backdropArmed = ev.target === shade; };
        shade.onclick = function(ev) {
            if (ev.target === shade && backdropArmed) shade.remove();
            backdropArmed = false;
        };
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
        m.card.style.width = 'min(680px,94vw)';
        var title = field('歌名（必填）', song.title || '', 'text');
        var artist = field('歌手（可选）', song.artist || '', 'text');
        var url = field('音频 URL（可选）', song.url || '', 'text');
        var cover = field('封面 URL（可选）', song.cover || '', 'text');
        m.card.appendChild(title); m.card.appendChild(artist); m.card.appendChild(url); m.card.appendChild(cover);

        var workingScripts = JSON.parse(JSON.stringify(song.scriptVersions || []));
        workingScripts.forEach(function(version, index) {
            if (!version.id) version.id = 'script-edit-' + Date.now() + '-' + index;
            if (!version.label) version.label = '台本版本 ' + (index + 1);
        });
        var selectionMode = song.scriptSelectionMode === 'random' ? 'random' : 'single';
        var selectedScriptId = song.selectedScriptId || (workingScripts[0] && workingScripts[0].id) || '';
        var selectedScriptIds = Object.prototype.toString.call(song.selectedScriptIds) === '[object Array]' ?
            song.selectedScriptIds.slice() : (selectedScriptId ? [selectedScriptId] : []);
        var editingScriptId = '';
        var scriptDetails = E('details', 'vnr3-song-scripts');
        var scriptSummary = E('summary', '');
        scriptDetails.appendChild(scriptSummary);
        var scriptWorkspace = V('vnr3-song-script-workspace');
        scriptDetails.appendChild(scriptWorkspace);

        function setSingleScript(id) {
            selectedScriptId = id;
            selectedScriptIds = id ? [id] : [];
        }
        function scriptSelected(id) {
            return selectionMode === 'random' ? selectedScriptIds.indexOf(id) >= 0 : selectedScriptId === id;
        }
        function paintScriptWorkspace() {
            scriptSummary.textContent = '内置台本 · ' + workingScripts.length + ' 个版本';
            scriptWorkspace.innerHTML = '';
            var toolbar = V('vnr3-song-script-toolbar');
            var modes = V('vnr3-segment');
            modes.appendChild(button('指定一个生效', function() {
                selectionMode = 'single';
                if (!selectedScriptId && selectedScriptIds.length) selectedScriptId = selectedScriptIds[0];
                if (!selectedScriptId && workingScripts[0]) setSingleScript(workingScripts[0].id);
                paintScriptWorkspace();
            }, selectionMode === 'single' ? 'on' : ''));
            modes.appendChild(button('勾选后随机', function() {
                selectionMode = 'random';
                if (!selectedScriptIds.length && selectedScriptId) selectedScriptIds = [selectedScriptId];
                paintScriptWorkspace();
            }, selectionMode === 'random' ? 'on' : ''));
            toolbar.appendChild(modes);
            var tools = V('vnr3-segment');
            if (selectionMode === 'random' && workingScripts.length) {
                tools.appendChild(button('全选', function() {
                    selectedScriptIds = workingScripts.map(function(version) { return version.id; });
                    paintScriptWorkspace();
                }));
            }
            tools.appendChild(button('＋ 新台本', function() {
                var fresh = {
                    id: 'script-' + Date.now() + '-' + Math.floor(Math.random() * 10000),
                    t: Date.now(),
                    label: '自定义台本',
                    host: '',
                    say: '',
                    favorite: false
                };
                workingScripts.unshift(fresh);
                editingScriptId = fresh.id;
                if (selectionMode === 'single') setSingleScript(fresh.id);
                else selectedScriptIds.push(fresh.id);
                paintScriptWorkspace();
            }, 'primary'));
            toolbar.appendChild(tools);
            scriptWorkspace.appendChild(toolbar);
            scriptWorkspace.appendChild(V('vnr3-hint', selectionMode === 'random' ?
                '每次把歌曲加入播放队列时，会从勾选版本中随机选择一个台本。' :
                '播放这首歌曲时固定使用当前选中的台本版本。'));

            var list = V('vnr3-song-script-list');
            if (!workingScripts.length) list.appendChild(V('vnr3-hint', '还没有保存过台本。点击“新台本”即可添加。'));
            workingScripts.forEach(function(version, index) {
                var row = V('vnr3-song-script-row' + (scriptSelected(version.id) ? ' on' : ''));
                var pick = E('button', 'vnr3-mini-action',
                    selectionMode === 'random' ? (scriptSelected(version.id) ? '✓' : '') : (scriptSelected(version.id) ? '●' : ''));
                pick.title = selectionMode === 'random' ? '加入/移出随机候选' : '设为生效台本';
                pick.onclick = function() {
                    if (selectionMode === 'random') {
                        var at = selectedScriptIds.indexOf(version.id);
                        if (at >= 0) selectedScriptIds.splice(at, 1);
                        else selectedScriptIds.push(version.id);
                    } else setSingleScript(version.id);
                    paintScriptWorkspace();
                };
                row.appendChild(pick);
                var copy = V('');
                copy.appendChild(V('vnr3-version-name', version.label || ('台本版本 ' + (index + 1))));
                copy.appendChild(V('vnr3-version-meta',
                    (version.host || '未指定主持人') + ' · ' + String(version.say || '').length + ' 字'));
                row.appendChild(copy);
                var edit = E('button', 'vnr3-mini-action', '✎');
                edit.title = '展开编辑';
                edit.onclick = function() {
                    editingScriptId = editingScriptId === version.id ? '' : version.id;
                    paintScriptWorkspace();
                };
                row.appendChild(edit);
                var del = E('button', 'vnr3-mini-action', '×');
                del.title = '删除版本';
                del.onclick = function() {
                    workingScripts.splice(index, 1);
                    selectedScriptIds = selectedScriptIds.filter(function(id) { return id !== version.id; });
                    if (selectedScriptId === version.id) {
                        selectedScriptId = workingScripts[0] && workingScripts[0].id || '';
                    }
                    if (editingScriptId === version.id) editingScriptId = '';
                    paintScriptWorkspace();
                };
                row.appendChild(del);
                list.appendChild(row);
            });
            scriptWorkspace.appendChild(list);

            var editing = null;
            workingScripts.forEach(function(version) { if (version.id === editingScriptId) editing = version; });
            if (editing) {
                var editor = V('vnr3-song-script-editor');
                var labelField = field('版本名称', editing.label || '', 'text');
                var hostField = field('主持人', editing.host || '', 'text');
                var sayField = field('台本内容', editing.say || '', 'textarea');
                sayField.input.style.minHeight = '150px';
                labelField.input.oninput = function() { editing.label = labelField.input.value; editing.t = Date.now(); };
                hostField.input.oninput = function() { editing.host = hostField.input.value; editing.t = Date.now(); };
                sayField.input.oninput = function() { editing.say = sayField.input.value; editing.t = Date.now(); };
                editor.appendChild(labelField); editor.appendChild(hostField); editor.appendChild(sayField);
                var editorOps = V('vnr3-inline-ops');
                editorOps.appendChild(button('收起', function() {
                    editingScriptId = '';
                    paintScriptWorkspace();
                }));
                editorOps.appendChild(button('应用到当前版本', function() {
                    editing.label = labelField.input.value.trim() || '未命名台本';
                    editing.host = hostField.input.value.trim();
                    editing.say = sayField.input.value.trim();
                    editing.t = Date.now();
                    editingScriptId = '';
                    paintScriptWorkspace();
                }, 'primary'));
                editor.appendChild(editorOps);
                scriptWorkspace.appendChild(editor);
            }
        }
        paintScriptWorkspace();
        m.card.appendChild(scriptDetails);

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
                scriptVersions: workingScripts.filter(function(version) { return !!String(version.say || '').trim(); }),
                selectedScriptId: selectedScriptId,
                selectedScriptIds: selectedScriptIds.filter(function(id) {
                    return workingScripts.some(function(version) { return version.id === id && !!String(version.say || '').trim(); });
                }),
                scriptSelectionMode: selectionMode
            };
            if (data.scriptSelectionMode === 'single' &&
                !data.scriptVersions.some(function(version) { return version.id === data.selectedScriptId; })) {
                data.selectedScriptId = data.scriptVersions[0] && data.scriptVersions[0].id || '';
                data.selectedScriptIds = data.selectedScriptId ? [data.selectedScriptId] : [];
            }
            if (song.id) {
                var originalKey = _songKey(song);
                for (var i = 0; i < pl.songs.length; i++) if (pl.songs[i].id === song.id) pl.songs[i] = data;
                /* 台本版本按歌曲同步到其他本地歌单副本，避免同一首歌在不同入口显示不同。 */
                v3.playlists().forEach(function(playlist) {
                    (playlist.songs || []).forEach(function(savedSong) {
                        if (_songKey(savedSong) !== originalKey || savedSong.id === song.id && playlist === pl) return;
                        savedSong.scriptVersions = JSON.parse(JSON.stringify(data.scriptVersions));
                        savedSong.selectedScriptId = data.selectedScriptId;
                        savedSong.selectedScriptIds = data.selectedScriptIds.slice();
                        savedSong.scriptSelectionMode = data.scriptSelectionMode;
                    });
                });
                var favorites = eng.store.favoriteSongs || (eng.store.favoriteSongs = []);
                var favoriteChanged = false;
                favorites.forEach(function(favoriteSong, index) {
                    if (_songKey(favoriteSong) === originalKey) {
                        if (pl.id === 'my-favorites') {
                            favorites[index] = JSON.parse(JSON.stringify(data));
                        } else {
                            favoriteSong.scriptVersions = JSON.parse(JSON.stringify(data.scriptVersions));
                            favoriteSong.selectedScriptId = data.selectedScriptId;
                            favoriteSong.selectedScriptIds = data.selectedScriptIds.slice();
                            favoriteSong.scriptSelectionMode = data.scriptSelectionMode;
                        }
                        favoriteChanged = true;
                    }
                });
                if (pl.id === 'my-favorites' && !favoriteChanged) favorites.push(JSON.parse(JSON.stringify(data)));
                if (favoriteChanged || pl.id === 'my-favorites') eng.saveStore();
                v3.save();
                v3.uiRefresh();
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
        var nav = V('vnr3-detail-nav');
        var back = E('button', 'vnr3-back');
        back.type = 'button';
        back.title = '返回所有歌单';
        back.appendChild(V('vnr3-back-chevron', '‹'));
        back.appendChild(V('', '所有歌单'));
        back.onclick = function() {
            u.view = 'playlists';
            renderMain();
        };
        nav.appendChild(back);
        box.appendChild(nav);
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
        var ops = V('vnr3-detail-actions');
        var playAction = button('', function() { playPlaylist(pl); }, 'primary');
        playAction.classList.add('vnr3-play-action');
        playAction.appendChild(V('vnr3-play-glyph', '▶'));
        playAction.appendChild(V('', '播放'));
        ops.appendChild(playAction);
        if (!isNowPlaying && !isFavorites) {
            ops.appendChild(button('导入歌单', function() { openImport(pl); }));
            ops.appendChild(button('添加歌曲', function() { openManualAdd(pl); }));
        }
        if (!isFavorites) ops.appendChild(button('设置', function() { openPlaylistSettings(pl); }));
        ops.appendChild(button('台本', function() { openContinuousPanel(pl); }));
        info.appendChild(ops); head.appendChild(info); box.appendChild(head);
        var bulk = V('vnr3-bulk');
        var selected = {};
        var list = V('vnr3-track-list');
        var selectionHead = V('vnr3-select-head');
        var selectionHint = V('vnr3-select-count', '已选择 0 / ' + songs.length + ' 首');
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
        var bulkOps = V('vnr3-bulk-actions');
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
                (isFavorites ? '会将已选歌曲移出 Favorites，不会删除其他歌单中的歌曲。' : '只会从这个歌单移除已选歌曲，不影响其他歌单中的同名歌曲。');
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
            favoriteButton.classList.add('vnr3-track-action');
            favoriteButton.title = _isFav(song) ? '移出 Favorites' : '收入 Favorites';
            favoriteButton.innerHTML = icon2(_isFav(song) ? 'heartF' : 'heart');
            row.appendChild(favoriteButton);
            var moreButton = button('···', function() {
                choice(song.title || '歌曲操作', [
                    { label: '编辑歌曲与台本', action: function() {
                        if (isNowPlaying) { _toast('请从歌曲所属歌单或 Favorites 中编辑保存信息'); return; }
                        openSongEditor(pl, song);
                    } },
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
            }, 'icon');
            moreButton.classList.add('vnr3-track-action');
            moreButton.title = '更多';
            row.appendChild(moreButton);
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
        var minutes = field('自定义时长（分钟，可直接输入）', currentSleep ? currentSleep.durationMinutes : '', 'number');
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
        m.card.appendChild(V('vnr3-hint', '倒计时结束后会让当前歌曲自然播完，再统一停止音乐、台本语音和所有背景音。'));
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
            var key = v3.backgroundKey ? v3.backgroundKey(song) : (song.id || song.title);
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
            row.setAttribute('data-vnr3-background-key', key);
            var play = button('播放', function() {
                v3.playBackground(song);
                syncBackgroundRow();
            });
            row.appendChild(play);
            var pause = button('暂停', function() {
                v3.pauseBackground(key, false);
                if (v3.masterPauseSnapshot) delete v3.masterPauseSnapshot.backgrounds[key];
                syncBackgroundRow();
            });
            row.appendChild(pause);
            function syncBackgroundRow() {
                var isPlaying = v3.backgroundIsPlaying(key);
                play.classList.toggle('primary', !isPlaying);
                pause.classList.toggle('primary', isPlaying);
                play.disabled = isPlaying;
                pause.disabled = !isPlaying;
                ck.classList.toggle('on', !!v3.state.backgroundChecked[key]);
            }
            row.__vnr3SyncBackground = syncBackgroundRow;
            syncBackgroundRow();
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

    function openScriptLibrary() {
        var old = stage.querySelector('.vnr3-script-layer');
        if (old) old.remove();
        var layer = V('vnr3-script-layer');
        var panel = V('vnr3-script-window');
        var head = V('vnr3-script-window-head');
        var title = V('');
        title.appendChild(V('vnr3-script-window-title', '台本库'));
        title.appendChild(V('vnr3-script-window-sub', '跨歌单管理长台本与当前播放列表的歌曲台本'));
        head.appendChild(title);
        var close = E('button', 'vnr3-script-close', '×');
        close.type = 'button';
        close.title = '关闭台本库';
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
            var toolbar = V('vnr3-library-toolbar');
            var tabs = V('vnr3-segment');
            var tab = u.v3ScriptLibraryTab === 'songs' ? 'songs' : 'continuous';
            tabs.appendChild(button('长篇陪伴台本', function() { u.v3ScriptLibraryTab = 'continuous'; savePos(); paint(); }, tab === 'continuous' ? 'on' : ''));
            tabs.appendChild(button('当前歌曲台本', function() { u.v3ScriptLibraryTab = 'songs'; savePos(); paint(); }, tab === 'songs' ? 'on' : ''));
            toolbar.appendChild(tabs);
            if (tab === 'continuous') {
                var playlists = v3.playlists();
                var selectedId = u.v3ScriptLibraryPlaylistId || v3.state.activePlaylistId || 'now-playing';
                var selectedPlaylist = v3.playlist(selectedId) || v3.currentPlaylist() || playlists[0];
                u.v3ScriptLibraryPlaylistId = selectedPlaylist && selectedPlaylist.id || 'now-playing';
                var picker = selectField('查看歌单', u.v3ScriptLibraryPlaylistId, playlists.map(function(item) {
                    var count = (v3.state.continuousVersions || []).filter(function(version) {
                        return (version.playlistId || 'now-playing') === item.id;
                    }).length;
                    return { value: item.id, label: (item.name || '未命名歌单') + ' · ' + count + ' 份' };
                }));
                picker.input.onchange = function() {
                    u.v3ScriptLibraryPlaylistId = picker.input.value;
                    savePos();
                    paint();
                };
                toolbar.appendChild(picker);
                body.appendChild(toolbar);
                var continuousBox = V('');
                continuousBox.__vnr3Refresh = paint;
                body.appendChild(continuousBox);
                renderContinuous(continuousBox, selectedPlaylist);
            } else {
                toolbar.appendChild(V('vnr3-hint', '这里显示正在播放和后续队列中每首歌曲携带的台本。'));
                body.appendChild(toolbar);
                renderQueueScripts(body, paint);
            }
            body.scrollTop = y;
        }
        paint();
    }

    function openContinuousPanel(pl) {
        u.v3ScriptLibraryTab = 'continuous';
        u.v3ScriptLibraryPlaylistId = pl && pl.id || v3.state.activePlaylistId || 'now-playing';
        savePos();
        openScriptLibrary();
    }

    function renderQueueScripts(box, refresh) {
        var items = (eng.current ? [eng.current] : []).concat(eng.queue || []);
        if (!items.length) {
            box.appendChild(V('vnr2-empty', '当前播放列表为空。'));
            return;
        }
        items.forEach(function(item, itemIndex) {
            if (!item || !item.song) return;
            var versions = v3.scriptVersionsForItem(item);
            var selected = versions[0] || null;
            var card = V('vnr3-speech-node vnr3-queue-script');
            var head = V('vnr3-queue-script-head');
            var name = V('');
            name.appendChild(V('vnr3-title', (itemIndex === 0 && eng.current === item ? '正在播放 · ' : '') + (item.song.title || item.song.query || '未命名歌曲')));
            name.appendChild(V('vnr3-sub', (item.song.artist || '') + ' · ' + versions.length + ' 个已存版本'));
            head.appendChild(name);
            head.appendChild(V('vnr3-cache-badge', item.say ? '播放时会朗读' : '暂无台本'));
            card.appendChild(head);
            var picker = selectField('台本版本', selected && selected.id || '', versions.length ? versions.map(function(version, index) {
                return {
                    value: version.id,
                    label: (version.favorite ? '★ ' : '') + (version.label || ('版本 ' + (index + 1)))
                };
            }) : [{ value: '', label: '新建台本' }]);
            card.appendChild(picker);
            var host = field('主持人', selected && selected.host || item.host || '', 'text');
            var text = field('台本内容', selected && selected.say || item.say || '', 'textarea');
            card.appendChild(host);
            card.appendChild(text);
            picker.input.onchange = function() {
                if (picker.input.value) v3.selectSongScript(item, picker.input.value);
                refresh();
            };
            var ops = V('vnr3-node-ops');
            ops.appendChild(button('保存编辑', function() {
                var currentId = picker.input.value || '';
                var favorite = false;
                versions.forEach(function(version) { if (version.id === currentId) favorite = !!version.favorite; });
                v3.saveSongScript(item, {
                    id: currentId,
                    host: host.input.value,
                    say: text.input.value,
                    favorite: favorite,
                    label: selected && selected.label || '手动编辑'
                });
                _toast('歌曲台本已保存');
                refresh();
            }, 'primary'));
            ops.appendChild(button(selected && selected.favorite ? '取消收藏版本' : '收藏版本', function() {
                if (!picker.input.value || String(picker.input.value).indexOf('current-') === 0) {
                    var created = v3.saveSongScript(item, {
                        host: host.input.value,
                        say: text.input.value,
                        favorite: true,
                        label: '收藏台本'
                    });
                    if (!created) _toast('请先填写台本内容');
                } else {
                    v3.toggleSongScriptFavorite(item, picker.input.value);
                }
                refresh();
            }));
            ops.appendChild(button('另存为新版本', function() {
                var created = v3.saveSongScript(item, {
                    host: host.input.value,
                    say: text.input.value,
                    favorite: false,
                    label: '手动版本'
                });
                if (!created) _toast('请先填写台本内容');
                refresh();
            }));
            card.appendChild(ops);
            box.appendChild(card);
        });
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
        var runtime = v3.continuousRuntime;
        var playingThis = !!(version && runtime && runtime.versionId === version.id && !runtime.stopped);
        title.appendChild(V('vnr3-sub', version ? ((playingThis ? '正在播放 · ' : '') + version.title) : '这个歌单还没有完整台本'));
        if (version) {
            var rename = E('input', 'vnr3-input');
            rename.value = version.title || '';
            rename.placeholder = '台本名称';
            rename.onchange = function() {
                version.title = rename.value.trim() || '未命名台本';
                version.edited = true;
                v3.save();
                refreshContinuous();
            };
            title.appendChild(rename);
        }
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
            ops.appendChild(button(playingThis ? '重新播放' : '整体播放', function() { v3.playContinuous(version.id); }));
            if (playingThis) {
                ops.appendChild(button(runtime.paused ? '继续播放台本' : '暂停台本', function() {
                    if (runtime.paused) v3.resumeContinuous();
                    else v3.pauseContinuous();
                    refreshContinuous();
                }, 'primary'));
            }
            ops.appendChild(button('停止', function() { v3.stopContinuous(); }));
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
            if (!version.favorite) {
                ops.appendChild(button('删除版本', function() {
                    if (TOP.confirm && !TOP.confirm('删除这个未收藏的长台本版本？')) return;
                    v3.deleteContinuousVersion(version.id);
                    refreshContinuous();
                }, 'danger'));
            }
        }
        head.appendChild(ops); box.appendChild(head);
        if (version) {
            var cacheBar = V('vnr3-library-cache');
            var cacheLabel = version.audioCacheComplete ?
                ('已在浏览器本地缓存 ' + _num(version.audioCacheCount, 0) + ' 段语音') :
                '尚未完整缓存语音';
            cacheBar.appendChild(V('vnr3-cache-badge', cacheLabel));
            cacheBar.appendChild(button(version.audioCacheComplete ? '重新检查并补全缓存' : '缓存完整语音', function() {
                var p = modal('缓存完整语音');
                var status = V('vnr3-hint', '准备分段请求并写入本地缓存…');
                p.card.appendChild(status);
                p.card.appendChild(V('vnr3-hint', '台本会按连续主持人话轮合并缓存，不再按句切割；主持人切换时会随机停顿 1–2.5 秒，原台本中的 pause 秒数仍会照常执行。'));
                v3.cacheContinuous(version.id, function(i, n) {
                    status.textContent = '正在缓存 ' + i + ' / ' + n;
                }, function(err, result) {
                    status.textContent = err ? ('失败：' + err) :
                        ('缓存完成，共 ' + result.count + ' 段，已保存在浏览器本地');
                    refreshContinuous();
                });
            }, 'primary'));
            if (version.audioCacheKeys && version.audioCacheKeys.length) {
                cacheBar.appendChild(button('清除应用内缓存', function() {
                    v3.clearContinuousCache(version.id, function(err) {
                        _toast(err || '本地语音缓存已清除');
                        refreshContinuous();
                    });
                }));
            }
            box.appendChild(cacheBar);
        }
        var versions = (v3.state.continuousVersions || []).filter(function(item) {
            return (item.playlistId || 'now-playing') === pl.id;
        });
        var globalQueue = v3.state.localScriptQueue || (v3.state.localScriptQueue = []);
        {
            var queue = globalQueue;

            var dashboard = V('vnr3-library-dashboard');
            var libraryPane = V('vnr3-library-pane');
            var libraryHead = V('vnr3-library-pane-head');
            var libraryTitle = V('');
            libraryTitle.appendChild(V('vnr3-library-pane-title', '已存台本'));
            libraryTitle.appendChild(V('vnr3-hint', versions.length + ' 份 · 点击卡片查看和编辑'));
            libraryHead.appendChild(libraryTitle);
            if (versions.length) libraryHead.appendChild(button('全部播放', function() {
                v3.playContinuousSequence(versions.map(function(item) { return item.id; }));
                refreshContinuous();
            }));
            libraryPane.appendChild(libraryHead);
            var versionGrid = V('vnr3-version-grid');
            if (!versions.length) versionGrid.appendChild(V('vnr3-hint', '这个歌单还没有已存台本。右侧仍会保留其他歌单加入的播放列表。'));
            versions.forEach(function(item, index) {
                var card = V('vnr3-version-card' + (version && version.id === item.id ? ' on' : ''));
                var copy = V('');
                copy.appendChild(V('vnr3-version-name', item.title || ('台本 ' + (index + 1))));
                copy.appendChild(V('vnr3-version-meta',
                    (item.favorite ? '已收藏 · ' : '') +
                    (item.audioCacheComplete ? '语音已缓存' : '需要时请求 TTS')));
                card.appendChild(copy);
                var add = E('button', 'vnr3-mini-action', queue.indexOf(item.id) >= 0 ? '✓' : '+');
                add.type = 'button';
                add.title = queue.indexOf(item.id) >= 0 ? '已加入播放列表' : '加入播放列表';
                add.onclick = function(ev) {
                    ev.stopPropagation();
                    if (queue.indexOf(item.id) < 0) queue.push(item.id);
                    v3.save();
                    refreshContinuous();
                };
                card.appendChild(add);
                card.onclick = function() {
                    v3.state.activeContinuousIds[pl.id] = item.id;
                    v3.state.activeContinuousId = item.id;
                    v3.save();
                    refreshContinuous();
                };
                versionGrid.appendChild(card);
            });
            libraryPane.appendChild(versionGrid);
            dashboard.appendChild(libraryPane);

            var queuePane = V('vnr3-library-pane');
            var queueHead = V('vnr3-library-pane-head');
            var queueTitle = V('');
            queueTitle.appendChild(V('vnr3-library-pane-title', '本地播放列表'));
            queueTitle.appendChild(V('vnr3-hint', '跨歌单保留 · 手动清空前不会丢失'));
            queueHead.appendChild(queueTitle);
            if (queue.length) queueHead.appendChild(button('清空', function() {
                v3.state.localScriptQueue = [];
                v3.save();
                refreshContinuous();
            }));
            queuePane.appendChild(queueHead);
            var localModeRow = V('vnr3-toggle-row');
            var localModeCopy = V('');
            localModeCopy.appendChild(V('vnr3-library-pane-title', '本地台本播放模式'));
            localModeCopy.appendChild(V('vnr3-hint', '开启后禁止请求新的陪伴台本，包括自动请求'));
            localModeRow.appendChild(localModeCopy);
            var localModeSwitch = E('button', 'vnr2-sw' + (v3.state.localScriptMode ? ' on' : ''));
            localModeSwitch.appendChild(E('i', ''));
            localModeSwitch.onclick = function() {
                v3.setLocalScriptMode(!localModeSwitch.classList.contains('on'));
                refreshContinuous();
            };
            localModeRow.appendChild(localModeSwitch);
            queuePane.appendChild(localModeRow);
            var modeSegment = V('vnr3-segment');
            [
                { id: 'once', label: '播放一次' },
                { id: 'repeat', label: '循环播放' },
                { id: 'shuffle', label: '随机循环' }
            ].forEach(function(modeItem) {
                modeSegment.appendChild(button(modeItem.label, function() {
                    v3.state.localScriptPlayMode = modeItem.id;
                    v3.save();
                    refreshContinuous();
                }, v3.state.localScriptPlayMode === modeItem.id ? 'on' : ''));
            });
            queuePane.appendChild(modeSegment);
            var queueList = V('vnr3-queue-list');
            if (!queue.length) {
                queueList.appendChild(V('vnr3-hint', '从左侧已存台本点“＋”加入。'));
            }
            queue.forEach(function(id, queueIndex) {
                var item = v3.continuousById(id);
                if (!item) return;
                var row = V('vnr3-queue-row');
                row.appendChild(V('vnr3-queue-index', String(queueIndex + 1)));
                var queueCopy = V('');
                queueCopy.appendChild(V('vnr3-version-name', item.title || '未命名台本'));
                var originPlaylist = v3.playlist(item.playlistId || 'now-playing');
                queueCopy.appendChild(V('vnr3-version-meta', originPlaylist && originPlaylist.name || '未知歌单'));
                row.appendChild(queueCopy);
                var rowOps = V('vnr3-segment');
                if (queueIndex > 0) {
                    var up = E('button', 'vnr3-mini-action', '↑');
                    up.onclick = function() {
                        var x = queue[queueIndex - 1]; queue[queueIndex - 1] = queue[queueIndex]; queue[queueIndex] = x;
                        v3.save(); refreshContinuous();
                    };
                    rowOps.appendChild(up);
                }
                var remove = E('button', 'vnr3-mini-action', '×');
                remove.title = '从播放列表移除';
                remove.onclick = function() { queue.splice(queueIndex, 1); v3.save(); refreshContinuous(); };
                rowOps.appendChild(remove);
                row.appendChild(rowOps);
                queueList.appendChild(row);
            });
            queuePane.appendChild(queueList);
            var queueOps = V('vnr3-inline-ops');
            queueOps.appendChild(button('播放这个列表', function() {
                if (!queue.length) { _toast('请先从左侧加入台本'); return; }
                v3.playLocalScriptQueue();
                refreshContinuous();
            }, 'primary'));
            queuePane.appendChild(queueOps);
            dashboard.appendChild(queuePane);
            box.appendChild(dashboard);
        }
        if (!version) {
            box.appendChild(V('vnr2-empty', '这个歌单还没有完整台本。可以请求 AI 生成，也可以新建空白台本后自己编辑。'));
            return;
        }
        var editorSurface = V('vnr3-editor-surface');
        box.appendChild(editorSurface);
        var nodes = version.nodes || [];
        var audioDetails = E('details', 'vnr3-speech-node');
        var audioSummary = E('summary', 'vnr3-title', '音频匹配设置 · ' + ((version.audioAssets || []).length) + ' 个音频');
        audioDetails.appendChild(audioSummary);
        audioDetails.appendChild(V('vnr3-hint', '支持一次上传多个文件或粘贴多个音频 URL。文件名中的段落序号会自动匹配；改台本名称不会破坏已有匹配。一个音频可勾选多个段落，每段也可关联多个音频。'));
        var fileInput = E('input', 'vnr3-input');
        fileInput.type = 'file';
        fileInput.accept = 'audio/*';
        fileInput.multiple = true;
        fileInput.onchange = function() {
            v3.addAudioFiles(version.id, fileInput.files, function(err, added) {
                _toast(err || ('已添加 ' + added.length + ' 个音频'));
                refreshContinuous();
            });
        };
        audioDetails.appendChild(fileInput);
        var urlInput = E('textarea', 'vnr3-node-text');
        urlInput.placeholder = '每行一个音频 URL';
        audioDetails.appendChild(urlInput);
        audioDetails.appendChild(button('添加音频 URL', function() {
            v3.addAudioUrls(version.id, urlInput.value.split(/\n+/), function(err, added) {
                _toast(err || ('已添加 ' + added.length + ' 个 URL 音频'));
                refreshContinuous();
            });
        }));
        var speechOnly = nodes.filter(function(node) { return node.type !== 'pause'; });
        (version.audioAssets || []).forEach(function(asset) {
            var assetCard = V('vnr3-speech-node');
            assetCard.appendChild(V('vnr3-sub', (asset.kind === 'url' ? 'URL · ' : '本地文件 · ') + asset.name));
            speechOnly.forEach(function(node, nodeIndex) {
                var row = V('vnr3-node-ops');
                var check = E('input', ''); check.type = 'checkbox';
                check.checked = !!(version.segmentAudioMap[node.id] || []).some(function(id) { return id === asset.id; });
                check.onchange = function() {
                    var ids = speechOnly.filter(function(candidate) {
                        return candidate === node ? check.checked : !!(version.segmentAudioMap[candidate.id] || []).some(function(id) { return id === asset.id; });
                    }).map(function(candidate) { return candidate.id; });
                    v3.setAudioAssetSegments(version.id, asset.id, ids);
                };
                row.appendChild(check);
                row.appendChild(V('', '第 ' + (nodeIndex + 1) + ' 段 · ' + String(node.displayText || node.ttsText || '').slice(0, 48)));
                assetCard.appendChild(row);
            });
            assetCard.appendChild(button('删除这个音频', function() {
                v3.deleteAudioAsset(version.id, asset.id, function() { refreshContinuous(); });
            }, 'danger'));
            audioDetails.appendChild(assetCard);
        });
        editorSurface.appendChild(audioDetails);
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
        editorSurface.appendChild(list);
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
        editorSurface.appendChild(save);
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
                links[i].classList.toggle('on', u.view === 'playlists' ||
                    (u.view === 'playlist-detail' && u.v3PlaylistId !== 'my-favorites'));
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
                if (favoriteLabel) favoriteLabel.textContent = 'Favorites · ' + ((eng.store.favoriteSongs || []).length);
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
            if (u.view === 'made') {
                var madeScroller = main.querySelector('.vnr2-set');
                if (madeScroller) {
                    madeScroller.addEventListener('wheel', function(e) { e.stopPropagation(); }, { passive: true });
                    madeScroller.addEventListener('touchmove', function(e) { e.stopPropagation(); }, { passive: true });
                    madeScroller.addEventListener('pointerdown', function(e) { e.stopPropagation(); });
                }
            }
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
        var oldAlbumImage = bbar.querySelector('.vnr2-songcard img');
        var oldAlbumKey = oldAlbumImage && oldAlbumImage.__vnrSongKey || '';
        var oldAlbumSrc = oldAlbumImage && (oldAlbumImage.currentSrc || oldAlbumImage.src) || '';
        oldRenderBottomBar();
        var currentAlbumKey = _songKey(curSong()) || '';
        if (bbImg) {
            bbImg.__k = currentAlbumKey;
            bbImg.__vnrSongKey = currentAlbumKey;
            if (oldAlbumSrc && oldAlbumKey === currentAlbumKey) {
                bbImg.src = oldAlbumSrc;
            } else {
                _fetchPic(curSong(), function(url) {
                    if (bbImg && bbImg.__vnrSongKey === currentAlbumKey && url && bbImg.src !== url) bbImg.src = url;
                });
            }
        }
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
            ghosts[1].title = '台本库';
            ghosts[1].innerHTML = icon2('listRect');
            ghosts[1].onclick = openScriptLibrary;
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
                timerButton.classList.add('vnr3-sleep-action');
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
        syncBottomV3();
    };

    function syncBottomV3() {
        var timerButton = bbar.querySelector('.vnr3-sleep-action');
        if (!timerButton) return;
        var label = v3.sleepLabel();
        var labelNode = timerButton.querySelector('.vnr3-timer-label');
        if (label) {
            if (!labelNode) {
                labelNode = E('span', 'vnr3-timer-label');
                timerButton.insertBefore(labelNode, timerButton.firstChild || null);
            }
            labelNode.textContent = label;
        } else if (labelNode) {
            labelNode.remove();
        }
    }

    try {
        TOP.addEventListener('vnm-radio-v3-refresh', function() {
            try {
                stage.querySelectorAll('.vnr3-bg-row').forEach(function(row) {
                    if (row && typeof row.__vnr3SyncBackground === 'function') row.__vnr3SyncBackground();
                });
                if (u.mode === 'studio') {
                    /* 计时、TTS 进度等高频状态只原位更新。整块重绘会让进度条、
                       hover 和打开的 details 在每次 refresh 时闪烁或复位。 */
                    syncBottomV3();
                }
            } catch (e) {}
        });
    } catch (e) {}
})();
