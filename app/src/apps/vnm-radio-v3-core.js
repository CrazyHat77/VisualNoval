/* vnm-radio v3 core augmentation.
 * This file is inserted into vnm-radio.json by app/scripts/build-radio-v3.js.
 * It deliberately uses ES5 syntax because the radio runs inside SillyTavern webviews.
 */
(function vnr3InstallCore() {
    if (eng.v3 && eng.v3.version >= 3.96) return;

    var v3 = eng.v3 = {
        version: 3.96,
        audio: {},
        continuousRuntime: null,
        sleepTimer: null,
        uiRefresh: function() {
            try {
                /* 高频播放进度不能调用 eng.emit()：它会让整个 studio 重新绘制，
                   造成封面、进度条、hover 与展开面板持续闪烁。 */
                TOP.dispatchEvent(new TOP.CustomEvent('vnm-radio-v3-refresh'));
            } catch (e) {}
        }
    };

    function bool(v, d) {
        if (v === undefined || v === null) return !!d;
        return v !== false && v !== 'false' && v !== 0 && v !== '0';
    }

    function clone(v) {
        try {
            return JSON.parse(JSON.stringify(v));
        } catch (e) {
            return v;
        }
    }

    function uid(prefix) {
        return (prefix || 'v3') + '-' + Date.now().toString(36) + '-' + Math.floor(Math.random() * 1679616).toString(36);
    }

    function cleanSong(song) {
        song = song || {};
        return {
            id: song.id || uid('song'),
            title: String(song.title || song.name || song.query || '').trim(),
            artist: String(song.artist || song.author || '').trim(),
            url: String(song.url || '').trim(),
            cover: String(song.cover || song.coverUrl || song.pic || song.picture || '').trim(),
            album: String(song.album || '').trim(),
            source: String(song.source || '').trim(),
            sourceId: String(song.sourceId || song._trackId || '').trim(),
            pendingMatch: !!song.pendingMatch,
            matchError: String(song.matchError || '').trim(),
            advanced: song.advanced ? clone(song.advanced) : null,
            scriptVersions: Object.prototype.toString.call(song.scriptVersions) === '[object Array]' ? clone(song.scriptVersions) : [],
            selectedScriptId: String(song.selectedScriptId || ''),
            selectedScriptIds: Object.prototype.toString.call(song.selectedScriptIds) === '[object Array]' ? clone(song.selectedScriptIds) : [],
            scriptSelectionMode: song.scriptSelectionMode === 'random' ? 'random' : 'single'
        };
    }

    function songKey(song) {
        song = song || {};
        return _normMusic((song.title || song.name || song.query || '') + ' ' + (song.artist || song.author || ''));
    }

    function defaultPlaylist() {
        return {
            id: 'now-playing',
            system: true,
            name: '正在播放',
            description: '当前电台播放队列',
            cover: '',
            coverMode: 'latest',
            songs: [],
            order: 0,
            updatedAt: Date.now(),
            playMode: 'sequence',
            autoScripts: false,
            scriptBatchSize: 30
        };
    }

    function ensureState() {
        var st = eng.store.v3Radio;
        if (!st || typeof st !== 'object') st = eng.store.v3Radio = {};
        if (Object.prototype.toString.call(st.playlists) !== '[object Array]') st.playlists = [];
        var sys = null;
        for (var i = 0; i < st.playlists.length; i++) {
            if (st.playlists[i] && st.playlists[i].id === 'now-playing') sys = st.playlists[i];
        }
        if (!sys) {
            sys = defaultPlaylist();
            st.playlists.unshift(sys);
        }
        sys.system = true;
        sys.name = sys.name || '正在播放';
        if (Object.prototype.toString.call(sys.songs) !== '[object Array]') sys.songs = [];
        var favorites = null;
        for (var j = 0; j < st.playlists.length; j++) {
            if (st.playlists[j] && st.playlists[j].id === 'my-favorites') favorites = st.playlists[j];
        }
        if (!favorites) {
            favorites = {
                id: 'my-favorites',
                system: true,
                favoriteSystem: true,
                name: 'Favorites',
                description: '在电台中点击爱心收藏的歌曲',
                cover: '',
                coverMode: 'latest',
                songs: [],
                order: 1,
                updatedAt: Date.now(),
                playMode: 'sequence',
                autoScripts: false,
                scriptBatchSize: 30
            };
            st.playlists.splice(Math.min(1, st.playlists.length), 0, favorites);
        }
        favorites.system = true;
        favorites.favoriteSystem = true;
        favorites.name = 'Favorites';
        var knownCovers = {};
        st.playlists.forEach(function(pl) {
            if (!pl || pl.id === 'my-favorites') return;
            (pl.songs || []).forEach(function(song) {
                var key = songKey(song);
                var cover = song && (song.cover || song.coverUrl || song.pic || song.picture);
                if (key && cover) knownCovers[key] = cover;
            });
        });
        favorites.songs = ((eng.store && eng.store.favoriteSongs) || []).map(function(song) {
            if (!song.id) song.id = uid('fav');
            var clean = cleanSong(song);
            if (!clean.cover) clean.cover = knownCovers[songKey(clean)] || '';
            return clean;
        });
        favorites.updatedAt = Date.now();
        st.mode = /^(recommend|playlist|companion)$/.test(st.mode || '') ? st.mode : 'recommend';
        st.activePlaylistId = st.activePlaylistId || 'now-playing';
        st.shortPersonas = st.shortPersonas || {};
        st.continuousVersions = Object.prototype.toString.call(st.continuousVersions) === '[object Array]' ? st.continuousVersions : [];
        st.activeContinuousIds = st.activeContinuousIds || {};
        st.continuousVersions.forEach(function(version) {
            if (!version) return;
            if (!version.playlistId) version.playlistId = 'now-playing';
            version.favorite = !!version.favorite;
            version.audioCacheKeys = Object.prototype.toString.call(version.audioCacheKeys) === '[object Array]' ? version.audioCacheKeys : [];
            version.audioFiles = version.audioFiles && typeof version.audioFiles === 'object' ? version.audioFiles : {};
            version.audioAssets = Object.prototype.toString.call(version.audioAssets) === '[object Array]' ? version.audioAssets : [];
            version.segmentAudioMap = version.segmentAudioMap && typeof version.segmentAudioMap === 'object' ? version.segmentAudioMap : {};
        });
        if (st.activeContinuousId && !st.activeContinuousIds['now-playing']) {
            st.activeContinuousIds['now-playing'] = st.activeContinuousId;
        }
        st.favoriteContinuousIds = Object.prototype.toString.call(st.favoriteContinuousIds) === '[object Array]' ? st.favoriteContinuousIds : [];
        st.backgroundSelection = st.backgroundSelection || {};
        st.backgroundChecked = st.backgroundChecked || {};
        st.pendingImport = null;
        st.sleep = st.sleep || null;
        st.scriptPlaylistSelection = st.scriptPlaylistSelection && typeof st.scriptPlaylistSelection === 'object' ? st.scriptPlaylistSelection : {};
        st.scriptPlaybackQueues = st.scriptPlaybackQueues && typeof st.scriptPlaybackQueues === 'object' ? st.scriptPlaybackQueues : {};
        if (Object.prototype.toString.call(st.localScriptQueue) !== '[object Array]') {
            st.localScriptQueue = [];
            Object.keys(st.scriptPlaybackQueues).forEach(function(playlistId) {
                (st.scriptPlaybackQueues[playlistId] || []).forEach(function(id) {
                    if (st.localScriptQueue.indexOf(id) < 0) st.localScriptQueue.push(id);
                });
            });
        }
        var availableContinuousIds = {};
        st.continuousVersions.forEach(function(version) { if (version && version.id) availableContinuousIds[version.id] = true; });
        var seenLocalIds = {};
        st.localScriptQueue = st.localScriptQueue.filter(function(id) {
            if (!availableContinuousIds[id] || seenLocalIds[id]) return false;
            seenLocalIds[id] = true;
            return true;
        });
        st.localScriptPlayMode = /^(once|repeat|shuffle)$/.test(st.localScriptPlayMode || '') ? st.localScriptPlayMode : 'once';
        st.localScriptMode = !!st.localScriptMode;
        st.schema = 6;
        return st;
    }

    v3.state = ensureState();

    v3.save = function() {
        ensureState();
        eng.saveStore();
    };

    v3.playlists = function() {
        return ensureState().playlists;
    };

    v3.playlist = function(id) {
        var arr = v3.playlists();
        for (var i = 0; i < arr.length; i++) if (arr[i] && arr[i].id === id) return arr[i];
        return null;
    };

    v3.currentPlaylist = function() {
        return v3.playlist(v3.state.activePlaylistId) || v3.playlist('now-playing');
    };

    v3.nowSongs = function() {
        var out = [];
        if (eng.current && eng.current.song) {
            var a = cleanSong(eng.current.song);
            a.queueItemId = eng.current.id;
            a.needsScript = !!eng.current.needsScript;
            a.scriptFresh = eng.current.scriptFresh !== false;
            a.say = eng.current.say || '';
            out.push(a);
        }
        (eng.queue || []).forEach(function(it) {
            if (!it || !it.song) return;
            var s = cleanSong(it.song);
            s.queueItemId = it.id;
            s.needsScript = !!it.needsScript;
            s.scriptFresh = it.scriptFresh !== false;
            s.say = it.say || '';
            out.push(s);
        });
        return out;
    };

    v3.syncNow = function() {
        var pl = v3.playlist('now-playing');
        if (!pl) return;
        pl.songs = v3.nowSongs().map(cleanSong);
        pl.updatedAt = Date.now();
        v3.save();
    };

    v3.createPlaylist = function(data) {
        data = data || {};
        var pl = {
            id: uid('pl'),
            system: false,
            name: String(data.name || '未命名歌单').trim() || '未命名歌单',
            description: String(data.description || '').trim(),
            cover: String(data.cover || '').trim(),
            coverMode: data.cover ? 'custom' : 'latest',
            songs: [],
            order: v3.playlists().length,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            playMode: data.playMode || 'sequence',
            autoScripts: !!data.autoScripts,
            scriptBatchSize: Math.max(1, Math.min(200, _num(data.scriptBatchSize, 30)))
        };
        v3.playlists().push(pl);
        v3.state.activePlaylistId = pl.id;
        v3.save();
        v3.uiRefresh();
        return pl;
    };

    v3.updatePlaylist = function(id, patch) {
        var pl = v3.playlist(id);
        if (!pl) return null;
        patch = patch || {};
        ['name', 'description', 'cover', 'playMode'].forEach(function(k) {
            if (patch[k] !== undefined) pl[k] = String(patch[k] || '').trim();
        });
        if (patch.autoScripts !== undefined) pl.autoScripts = !!patch.autoScripts;
        if (patch.scriptBatchSize !== undefined) pl.scriptBatchSize = Math.max(1, Math.min(200, _num(patch.scriptBatchSize, 30)));
        if (patch.cover !== undefined) pl.coverMode = patch.cover ? 'custom' : 'latest';
        pl.updatedAt = Date.now();
        v3.save();
        v3.uiRefresh();
        return pl;
    };

    v3.deletePlaylist = function(id) {
        if (!id || id === 'now-playing' || id === 'my-favorites') return false;
        var arr = v3.playlists();
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] && arr[i].id === id) {
                arr.splice(i, 1);
                if (v3.state.activePlaylistId === id) v3.state.activePlaylistId = 'now-playing';
                v3.save();
                v3.uiRefresh();
                return true;
            }
        }
        return false;
    };

    v3.addSongs = function(id, songs, replace) {
        var pl = v3.playlist(id);
        if (!pl) return { added: 0, duplicate: 0 };
        var base = replace ? [] : (pl.songs || []).map(cleanSong);
        var seen = {};
        base.forEach(function(s) {
            var k = songKey(s);
            if (k) seen[k] = 1;
        });
        var added = 0, duplicate = 0;
        (songs || []).forEach(function(raw) {
            var s = cleanSong(raw);
            if (!s.title) return;
            var k = songKey(s);
            if (k && seen[k]) {
                duplicate++;
                return;
            }
            if (k) seen[k] = 1;
            base.push(s);
            added++;
        });
        pl.songs = base;
        pl.updatedAt = Date.now();
        v3.save();
        v3.uiRefresh();
        return { added: added, duplicate: duplicate };
    };

    v3.removeSongs = function(id, ids) {
        var pl = v3.playlist(id);
        if (!pl || id === 'now-playing') return;
        var set = {};
        (ids || []).forEach(function(x) { set[x] = 1; });
        pl.songs = (pl.songs || []).filter(function(s) { return !set[s.id]; });
        pl.updatedAt = Date.now();
        v3.save();
        v3.uiRefresh();
    };

    v3.copySongs = function(fromId, songIds, toId, move) {
        var from = v3.playlist(fromId), to = v3.playlist(toId);
        if (!from || !to || from === to) return { added: 0, duplicate: 0 };
        var set = {};
        (songIds || []).forEach(function(id) { set[id] = 1; });
        var selected = (from.songs || []).filter(function(s) { return set[s.id]; });
        var result = v3.addSongs(toId, selected, false);
        if (move) v3.removeSongs(fromId, selected.map(function(s) { return s.id; }));
        return result;
    };

    v3.mergePlaylists = function(fromId, toId, move) {
        var from = v3.playlist(fromId);
        if (!from) return { added: 0, duplicate: 0 };
        var ids = (from.songs || []).map(function(s) { return s.id; });
        return v3.copySongs(fromId, ids, toId, !!move);
    };

    v3.manualSongs = function(text) {
        var out = [];
        String(text || '').split(/\r?\n/).forEach(function(line) {
            line = line.trim();
            if (!line) return;
            var p = line.split(/\s+-\s+/);
            var title = String(p.shift() || '').trim();
            if (!title) return;
            out.push(cleanSong({
                title: title,
                artist: String(p.shift() || '').trim(),
                url: String(p.shift() || '').trim(),
                cover: p.join(' - ').trim()
            }));
        });
        return out;
    };

    function neteasePlaylistId(text) {
        var source = String(text || '').replace(/&amp;/gi, '&');
        try { source += '\n' + decodeURIComponent(source); } catch (_) {}
        var patterns = [
            /(?:music\.163\.com|y\.music\.163\.com)[^\s"'<>]*?[?&#]id=(\d+)/i,
            /(?:music\.163\.com|y\.music\.163\.com)[^\s"'<>]*?\/playlist\/(\d+)/i,
            /(?:playlistId|playlist_id|resourceId|resource_id)["'\s:=]+(\d{5,})/i
        ];
        for (var i = 0; i < patterns.length; i++) {
            var match = source.match(patterns[i]);
            if (match) return match[1];
        }
        return '';
    }

    function neteaseShareUrl(text) {
        var match = String(text || '').match(/https?:\/\/(?:163cn\.tv|(?:y\.)?music\.163\.com)\/[^\s<>"']+/i);
        return match ? match[0].replace(/[)\]}>，。！？、；;]+$/g, '') : '';
    }

    function resolveNeteasePlaylistId(input) {
        var directId = neteasePlaylistId(input);
        if (directId) return Promise.resolve(directId);

        var shortUrl = neteaseShareUrl(input);
        if (!shortUrl || !/https?:\/\/163cn\.tv\//i.test(shortUrl)) {
            return Promise.reject(new Error('无法从分享内容中识别歌单 ID，请粘贴网易云歌单分享链接'));
        }

        // 浏览器不能直接读取跨域 302 的 Location。先尝试直接请求（部分宿主会代转），
        // 再使用支持 CORS 的短链展开接口，确保手机端不依赖 Bridge 扩展。
        return TOP.fetch(shortUrl, { redirect: 'follow' }).then(function(r) {
            var id = neteasePlaylistId(r && r.url);
            if (id) return id;
            return r.text().then(function(body) {
                id = neteasePlaylistId(body);
                if (!id) throw new Error('短链接直连未返回歌单 ID');
                return id;
            });
        }).catch(function() {
            return TOP.fetch('https://unshorten.me/json/' + encodeURIComponent(shortUrl))
                .then(function(r) {
                    if (!r.ok) throw new Error('短链接展开 HTTP ' + r.status);
                    return r.json();
                })
                .then(function(result) {
                    var id = neteasePlaylistId(result && (result.resolved_url || result.resolvedUrl || result.url));
                    if (!id) throw new Error('短链接展开结果中没有歌单 ID');
                    return id;
                });
        }).catch(function(e) {
            throw new Error('网易云短链接展开失败：' + ((e && e.message) || String(e)) + '。也可以在网易云浏览器页面复制带 id=数字 的长链接');
        });
    }

    v3.importNetease = function(url, done) {
        resolveNeteasePlaylistId(url).then(function(id) {
        var sources = [
            function() {
                return TOP.fetch('https://api.injahow.cn/meting/?server=netease&type=playlist&id=' + encodeURIComponent(id))
                    .then(function(r) { if (!r.ok) throw new Error('Meting HTTP ' + r.status); return r.json(); })
                    .then(function(d) {
                        if (!d || !d.length) throw new Error('Meting 返回为空');
                        return {
                            id: id,
                            name: '导入歌单',
                            cover: (d[0] && (d[0].pic || d[0].picture)) || '',
                            songs: d.map(function(t) {
                                return cleanSong({
                                    title: t.name,
                                    artist: t.artist || t.author,
                                    cover: t.pic || t.picture || '',
                                    source: 'netease',
                                    sourceId: t.id || ''
                                });
                            })
                        };
                    });
            },
            function() {
                var api = 'https://music.163.com/api/playlist/detail?id=' + encodeURIComponent(id);
                return TOP.fetch('https://corsproxy.io/?' + encodeURIComponent(api))
                    .then(function(r) { if (!r.ok) throw new Error('网易云歌单 HTTP ' + r.status); return r.json(); })
                    .then(function(d) {
                        var pl = d && (d.playlist || d.result), tracks = pl && pl.tracks;
                        if (!tracks || !tracks.length) throw new Error('网易云歌单返回为空');
                        return {
                            id: id,
                            name: pl.name || '导入歌单',
                            cover: pl.coverImgUrl || '',
                            songs: tracks.map(function(t) {
                                return cleanSong({
                                    title: t.name,
                                    artist: (t.artists || t.ar || []).map(function(a) { return a.name; }).join(' / '),
                                    cover: (t.album && t.album.picUrl) || (t.al && t.al.picUrl) || '',
                                    source: 'netease',
                                    sourceId: t.id || ''
                                });
                            })
                        };
                    });
            }
        ];
        (function attempt(i, errors) {
            if (i >= sources.length) {
                done && done('歌单解析失败：' + errors.join('；'));
                return;
            }
            sources[i]().then(function(result) {
                done && done(null, result);
            }).catch(function(e) {
                errors.push((e && e.message) || String(e));
                attempt(i + 1, errors);
            });
        })(0, []);
        }).catch(function(e) {
            done && done((e && e.message) || String(e));
        });
    };

    function queueItemFromSong(song) {
        song = cleanSong(song);
        var it = _itemFromSong(song, 'manual');
        it.song.cover = song.cover || '';
        it.song.coverUrl = song.cover || '';
        it.song.album = song.album || '';
        it.song.sourceId = song.sourceId || '';
        if (!it.song._trackId && song.sourceId) it.song._trackId = song.sourceId;
        var versions = song.scriptVersions || [];
        var selected = null;
        if (song.scriptSelectionMode === 'random' && song.selectedScriptIds && song.selectedScriptIds.length) {
            var candidates = versions.filter(function(version) {
                return version && song.selectedScriptIds.indexOf(version.id) >= 0 && version.say;
            });
            if (candidates.length) selected = candidates[Math.floor(Math.random() * candidates.length)];
        }
        if (!selected && song.selectedScriptId) {
            for (var i = 0; i < versions.length; i++) if (versions[i].id === song.selectedScriptId) selected = versions[i];
        }
        if (!selected && versions.length) selected = versions[0];
        if (selected && selected.say) {
            it.say = selected.say;
            it.host = selected.host || '';
            it.needsScript = false;
            it.scriptFresh = true;
        } else {
            it.say = '';
            it.needsScript = true;
            it.scriptFresh = false;
        }
        it.librarySongId = song.id;
        return it;
    }

    v3.loadPlaylist = function(id, append) {
        var pl = v3.playlist(id);
        if (!pl) return false;
        var songs = (pl.songs || []).map(cleanSong);
        if (pl.playMode === 'shuffle') {
            for (var i = songs.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1)), tmp = songs[i];
                songs[i] = songs[j];
                songs[j] = tmp;
            }
        }
        var items = songs.map(queueItemFromSong);
        if (append) eng.queue = (eng.queue || []).concat(items);
        else {
            eng.queue = items;
            if (!eng.current || !eng.running) eng.current = null;
        }
        eng.saveQueue();
        v3.state.mode = 'playlist';
        v3.state.activePlaylistId = id;
        v3.save();
        if (!eng.running) {
            eng.running = true;
            eng.paused = false;
        }
        if (!eng.current) eng.next();
        if (pl.autoScripts) TOP.setTimeout(function() { v3.requestCurrentMode(false); }, 60);
        v3.uiRefresh();
        return true;
    };

    v3.setMode = function(mode) {
        if (!/^(recommend|playlist|companion)$/.test(mode || '')) return;
        if (mode !== 'companion' && v3.continuousRuntime) v3.stopContinuous();
        if (mode === 'companion' && !v3.continuousRuntime) {
            try {
                if (eng.voice) {
                    eng.voice.onended = null;
                    eng.voice.onerror = null;
                    eng.voice.pause();
                    eng.voice.src = '';
                }
            } catch (e) {}
            eng.duck(false);
        }
        v3.state.mode = mode;
        v3.save();
        v3.uiRefresh();
    };

    v3.songScriptsSuppressed = function() {
        return v3.state.mode === 'companion' || !!v3.continuousRuntime;
    };

    v3.modeLabel = function(mode) {
        mode = mode || v3.state.mode;
        return mode === 'playlist' ? '歌单模式' : (mode === 'companion' ? '陪伴模式' : '推荐模式');
    };

    function trimScriptVersions(list, maxNormal) {
        list = Object.prototype.toString.call(list) === '[object Array]' ? list : [];
        maxNormal = Math.max(1, _num(maxNormal, 5));
        var favorite = [], normal = [];
        list.forEach(function(version) {
            if (!version || !version.say) return;
            if (version.favorite) favorite.push(version);
            else if (normal.length < maxNormal) normal.push(version);
        });
        return favorite.concat(normal);
    }

    function itemSongRefs(item) {
        item = item || {};
        var song = item.song || {};
        var key = songKey(song), refs = [], seen = [];
        v3.playlists().forEach(function(pl) {
            (pl.songs || []).forEach(function(saved) {
                if (!saved) return;
                if (item.librarySongId && saved.id === item.librarySongId || key && songKey(saved) === key) {
                    if (seen.indexOf(saved) < 0) {
                        seen.push(saved);
                        refs.push(saved);
                    }
                }
            });
        });
        var favorite = _favByKey(key);
        if (favorite && seen.indexOf(favorite) < 0) refs.push(favorite);
        return refs;
    }

    v3.scriptVersionsForItem = function(item) {
        var refs = itemSongRefs(item), out = [], ids = {};
        refs.forEach(function(song) {
            (song.scriptVersions || []).forEach(function(version) {
                if (!version || !version.say) return;
                var id = version.id || ('script-' + songKey(song) + '-' + (version.t || 0));
                if (ids[id]) return;
                ids[id] = 1;
                out.push(version);
            });
        });
        out.sort(function(a, b) { return _num(b.t, 0) - _num(a.t, 0); });
        if (!out.length && item && item.say) {
            out.push({
                id: 'current-' + item.id,
                t: 0,
                host: item.host || '',
                say: item.say,
                favorite: false,
                ephemeral: true,
                label: '当前队列台本'
            });
        }
        return out;
    };

    v3.saveSongScript = function(item, data) {
        item = item || {};
        data = data || {};
        var say = String(data.say || '').trim();
        if (!say) return null;
        var id = data.id && String(data.id).indexOf('current-') !== 0 ? data.id : uid('script');
        var refs = itemSongRefs(item);
        if (!refs.length) {
            var now = v3.playlist('now-playing');
            if (now) {
                var saved = cleanSong(item.song || {});
                saved.id = item.librarySongId || saved.id || uid('song');
                now.songs.push(saved);
                item.librarySongId = saved.id;
                refs.push(saved);
            }
        }
        var savedVersion = null;
        refs.forEach(function(song) {
            song.scriptVersions = song.scriptVersions || [];
            var version = null;
            for (var i = 0; i < song.scriptVersions.length; i++) {
                if (song.scriptVersions[i] && song.scriptVersions[i].id === id) version = song.scriptVersions[i];
            }
            if (!version) {
                version = { id: id, t: Date.now() };
                song.scriptVersions.unshift(version);
            }
            version.t = Date.now();
            version.host = String(data.host || item.host || '');
            version.say = say;
            version.favorite = !!data.favorite;
            version.label = data.label || version.label || '手动保存';
            song.scriptVersions = trimScriptVersions(song.scriptVersions, 5);
            song.selectedScriptId = id;
            song.selectedScriptIds = [id];
            song.scriptSelectionMode = 'single';
            savedVersion = version;
        });
        item.say = say;
        item.host = String(data.host || item.host || '');
        item.needsScript = false;
        item.scriptFresh = true;
        item.spoken = false;
        eng.saveQueue();
        v3.save();
        v3.uiRefresh();
        return savedVersion;
    };

    v3.selectSongScript = function(item, id) {
        var versions = v3.scriptVersionsForItem(item), selected = null;
        for (var i = 0; i < versions.length; i++) if (versions[i].id === id) selected = versions[i];
        if (!selected) return false;
        itemSongRefs(item).forEach(function(song) {
            song.selectedScriptId = id;
            song.selectedScriptIds = [id];
            song.scriptSelectionMode = 'single';
        });
        item.say = selected.say || '';
        item.host = selected.host || '';
        item.needsScript = !item.say;
        item.scriptFresh = !!item.say;
        item.spoken = false;
        eng.saveQueue();
        v3.save();
        v3.uiRefresh();
        return true;
    };

    v3.toggleSongScriptFavorite = function(item, id) {
        var next = null;
        itemSongRefs(item).forEach(function(song) {
            (song.scriptVersions || []).forEach(function(version) {
                if (version && version.id === id) {
                    if (next === null) next = !version.favorite;
                    version.favorite = next;
                }
            });
            song.scriptVersions = trimScriptVersions(song.scriptVersions, 5);
        });
        v3.save();
        v3.uiRefresh();
        return next;
    };

    var COMPANION_PROMPT_DEFAULT = [
        '你是专业的私人电台陪伴台本写作者。请让用户选择的主持人以角色本人的身份，共同主持一段可以持续播放的长篇陪伴节目。',
        '',
        '【主持人】',
        '{{主持人列表}}',
        '',
        '【主持人角色设定】',
        '{{角色设定}}',
        '',
        '【用户】',
        '{{用户名称}}',
        '{{用户设定}}',
        '',
        '【角色与世界背景】',
        '{{世界书}}',
        '',
        '【电台专用世界书】',
        '{{电台世界书}}',
        '',
        '【当前剧情上下文】',
        '{{剧情上下文}}',
        '',
        '{{聊天总结}}',
        '',
        '{{最近主播对话}}',
        '',
        '【用户本次要求】',
        '{{用户输入}}',
        '',
        '【本次任务】',
        '创作约 {{目标字数}} 字的连续长篇陪伴台本。主持人要自然地陪伴 {{用户名称}}，可以聊天、讲述、回应用户、分享想法或围绕当前语境展开话题，内容应连贯、耐听，避免机械报幕、空洞寒暄和反复重复相同意思。',
        '字数统计必须严格以所有 speech.ttsText 中实际会被主持人口播的正文合计为准，并使该口播正文达到约 {{目标字数}} 字。JSON 键名与结构、host、displayText 中与口播重复的内容、VoiceTag、pause 标记、秒数、转义符、空白及任何元数据均不计入此字数要求；不得用增加标签或结构字符来凑字数。',
        '',
        '如果有多名主持人，他们是共同主持这段节目：可以轮流说话、互相接话、讨论、打趣、补充或回应对方，也可以由一位主导、其他人自然加入。不要固定轮流顺序，不要求每段所有人都发言，但整篇应让适合参与的主持人真正参与交流。每个 speech.host 必须使用【主持人】中出现的名字。',
        '',
        '【停顿规则】',
        '{{停顿数量要求}}',
        '{{停顿秒数要求}}',
        '停顿是主持人说完一段内容后留给用户的独立安静时段，不是语气停顿。需要停顿时，必须在 nodes 数组中插入独立字符串标记 [pause=Ns]，例如停顿 24 秒就输出 "[pause=24s]"。标记不得放进 speech.ttsText 或 speech.displayText，也不得让主持人念出。播放停顿标记时，系统会停止请求语音并恢复背景声音，倒计时结束后再继续后面的 speech。',
        '',
        '【语言与节点规则】',
        '1. speech.ttsText 是发送给 TTS 的文本，只能使用 {{朗读语言}}。',
        '2. speech.displayText 是显示给用户看的文本，只能使用 {{显示语言}}；当显示语言与朗读语言相同时，两者内容可以相同。',
        '3. speech.host 必须与当前这段话的说话者一致。',
        '4. 每个 speech 应是一段适合单独请求语音的完整话语，不要把一句话无意义地拆成许多极短节点。',
        '5. 停顿只能使用独立的 "[pause=Ns]" 字符串标记；N 必须是允许区间内的秒数。',
        '',
        '【输出要求】',
        '{{输出格式要求}}',
        '不要输出 Markdown、代码块、标题、解释或 JSON 之外的任何文字。JSON 中所有字符串必须正确转义并完整闭合。'
    ].join('\n');

    function addFields() {
        var existing = {};
        FIELDS.forEach(function(f) {
            existing[f.key] = 1;
            if (f.key === 'autoRequest') f.label = '自动请求下一批（推荐模式）';
        });
        var list = [
            { group: '请求模式', key: 'v3ShortPersonaEnabled', type: 'toggle', label: '使用 Artist 中设置的电台简短人设', default: false },
            { group: '请求模式', key: 'v3OmitRecentHostTalk', type: 'toggle', label: '不发送历史台本（保留主动聊天）', default: false },
            { group: '请求模式', key: 'v3CompanionAutoRequest', type: 'toggle', label: '自动请求新台本（陪伴模式）', default: true },
            { group: '请求模式', key: 'v3CompanionWords', type: 'number', label: '陪伴模式目标字数', default: 3000, min: 300, max: 20000, step: 100 },
            { group: '请求模式', key: 'v3PauseMinCount', type: 'number', label: '连续台本最少停顿节点', default: 3, min: 0, max: 100 },
            { group: '请求模式', key: 'v3PauseMaxCount', type: 'number', label: '连续台本最多停顿节点', default: 8, min: 0, max: 100 },
            { group: '请求模式', key: 'v3PauseMinSeconds', type: 'number', label: '单次停顿最少秒数', default: 5, min: 0, max: 3600 },
            { group: '请求模式', key: 'v3PauseMaxSeconds', type: 'number', label: '单次停顿最多秒数', default: 30, min: 0, max: 3600 },
            { group: '请求模式', key: 'v3TtsPrefetch', type: 'number', label: '连续台本提前准备语音块数', default: 2, min: 1, max: 8 },
            { group: '提示词', key: 'v3TaskModulePrompt', type: 'textarea-presets', label: '当前任务要求模块', rows: 6, variables: ['{{当前任务要求}}'], default: '请严格执行当前请求模式定义的任务；不要额外推荐用户没有要求的内容。' },
            { group: '提示词', key: 'v3RandomModulePrompt', type: 'textarea-presets', label: '随机播放独立台本模块', rows: 7, variables: ['{{随机播放要求}}'], default: '当前曲目将以随机顺序播放。每首歌曲的台本必须能够独立成立，不得引用上一首或下一首，不得使用“刚才那首”“接下来”“延续前面的话题”等依赖固定顺序的表达。不同歌曲之间不得形成必须按顺序理解的情节、对话或情绪递进。' },
            { group: '提示词', key: 'v3LyricsModulePrompt', type: 'textarea-presets', label: '模型自行检索歌词模块', rows: 6, variables: ['{{歌词检索要求}}'], default: '你可以根据准确的歌名和歌手自行尝试回忆或查找歌词来理解歌曲；如果无法可靠找到，就忽略歌词。禁止编造歌词、伪造歌词内容或假装已经找到。' },
            { group: '提示词', key: 'v3CompanionPrompt', type: 'textarea-presets', label: '陪伴模式完整提示词', rows: 20, variables: ['{{主持人列表}}', '{{用户名称}}', '{{用户设定}}', '{{角色设定}}', '{{世界书}}', '{{电台世界书}}', '{{剧情上下文}}', '{{聊天总结}}', '{{最近主播对话}}', '{{用户输入}}', '{{目标字数}}', '{{停顿数量要求}}', '{{停顿秒数要求}}', '{{朗读语言}}', '{{显示语言}}', '{{输出格式要求}}'], default: COMPANION_PROMPT_DEFAULT },
            { group: '提示词', key: 'v3RecommendOnlyPrompt', type: 'textarea-presets', label: '只推荐歌曲模块', rows: 8, variables: ['{{只推荐歌曲要求}}'], default: '只推荐真实存在的歌曲，不写台本、不写主持人对白。只返回歌曲 title 与 artist，不要编造 URL。' }
        ];
        list.forEach(function(f) {
            if (!existing[f.key]) {
                FIELDS.push(f);
                if (cfg[f.key] === undefined) cfg[f.key] = f["default"];
            }
        });
        var moduleBlock = '\n\n【动态任务模块】\n{{当前任务要求}}\n{{随机播放要求}}\n{{歌词检索要求}}\n{{输出格式要求}}';
        ['promptTemplate', 'scriptRewritePrompt'].forEach(function(k) {
            if (cfg[k]) {
                cfg[k] = cfg[k].replace(/\n?\{\{人设注入要求\}\}/g, '').replace(/\n?\{\{连续台本要求\}\}/g, '');
            }
            if (cfg[k] && cfg[k].indexOf('{{当前任务要求}}') < 0) cfg[k] += moduleBlock;
        });
        if (cfg.v3CompanionPrompt) {
            cfg.v3CompanionPrompt = cfg.v3CompanionPrompt
                .replace(/\n*【酒馆历史】\n\{\{酒馆历史\}\}/g, '')
                .replace(/\n*【Horae 总结】\n\{\{Horae总结\}\}/g, '')
                .replace(/\n*【柏宝书总结】\n\{\{柏宝书总结\}\}/g, '')
                .replace('pause 是主持人说完一段内容后留给用户的独立安静时段，不是语气停顿。pause 前后应在内容上自然衔接；播放 pause 时系统会停止请求语音并恢复背景声音，倒计时结束后再继续后面的 speech。', '停顿是主持人说完一段内容后留给用户的独立安静时段，不是语气停顿。需要停顿时，必须在 nodes 数组中插入独立字符串标记 [pause=Ns]，例如停顿 24 秒就输出 "[pause=24s]"。标记不得放进 speech.ttsText 或 speech.displayText，也不得让主持人念出。播放停顿标记时，系统会停止请求语音并恢复背景声音，倒计时结束后再继续后面的 speech。')
                .replace('5. pause 节点只能包含 type 与 seconds，不要给 pause 添加主持人或文本。', '5. 停顿只能使用独立的 "[pause=Ns]" 字符串标记；N 必须是允许区间内的秒数。');
        }
        var wordRule = '字数统计必须严格以所有 speech.ttsText 中实际会被主持人口播的正文合计为准，并使该口播正文达到约 {{目标字数}} 字。JSON 键名与结构、host、displayText 中与口播重复的内容、VoiceTag、pause 标记、秒数、转义符、空白及任何元数据均不计入此字数要求；不得用增加标签或结构字符来凑字数。';
        if (cfg.v3CompanionPrompt && cfg.v3CompanionPrompt.indexOf('speech.ttsText 中实际会被主持人口播') < 0) {
            cfg.v3CompanionPrompt += '\n\n【口播正文的字数口径】\n' + wordRule;
        }
        if (!cfg.v3CompanionAutoRequestDefaultV2) {
            cfg.v3CompanionAutoRequest = true;
            cfg.v3CompanionAutoRequestDefaultV2 = true;
        }
        function normalizeRecentTalkSlot(text) {
            return String(text || '').replace(/【最近主播对话】\s*\{\{最近主播对话\}\}/g, '{{最近主播对话}}');
        }
        function normalizeChatSummarySlot(text) {
            return String(text || '').replace(/【电台聊天总结】\s*\{\{聊天总结\}\}/g, '{{聊天总结}}');
        }
        FIELDS.forEach(function(fieldDef) {
            if (!fieldDef) return;
            if (typeof fieldDef["default"] === 'string') {
                if (fieldDef["default"].indexOf('{{最近主播对话}}') >= 0) fieldDef["default"] = normalizeRecentTalkSlot(fieldDef["default"]);
                if (fieldDef["default"].indexOf('{{聊天总结}}') >= 0) fieldDef["default"] = normalizeChatSummarySlot(fieldDef["default"]);
            }
            if (fieldDef.key && typeof cfg[fieldDef.key] === 'string') {
                if (cfg[fieldDef.key].indexOf('{{最近主播对话}}') >= 0) cfg[fieldDef.key] = normalizeRecentTalkSlot(cfg[fieldDef.key]);
                if (cfg[fieldDef.key].indexOf('{{聊天总结}}') >= 0) cfg[fieldDef.key] = normalizeChatSummarySlot(cfg[fieldDef.key]);
            }
        });
        _saveCfg();
    }
    addFields();

    function isAutomaticScriptHistory(message) {
        return !!(message && (message.kind === 'script' || message.scriptId));
    }

    function radioHistoryContextStats() {
        var history = (eng.store && eng.store.chatHistory) || [];
        var scriptCount = 0, proactiveCount = 0;
        history.forEach(function(message) {
            if (isAutomaticScriptHistory(message)) scriptCount++;
            else proactiveCount++;
        });
        return {
            totalMessages: history.length,
            automaticScriptMessages: scriptCount,
            proactiveChatMessages: proactiveCount,
            filterAutomaticScripts: bool(cfg.v3OmitRecentHostTalk, false),
            mixedSummaryOmitted: bool(cfg.v3OmitRecentHostTalk, false) && !!(eng.store && eng.store.chatSummary)
        };
    }

    _recentRadioTalk = function(limit) {
        limit = _num(limit, cfg.recommendChatMessages === undefined ? 6 : cfg.recommendChatMessages);
        var history = (eng.store && eng.store.chatHistory) || [];
        if (bool(cfg.v3OmitRecentHostTalk, false)) {
            history = history.filter(function(message) {
                return !isAutomaticScriptHistory(message);
            });
        }
        if (!history.length || limit <= 0) return '';
        var body = history.slice(-limit).map(function(message) {
            return (message.role === 'user' ? '用户' : '主播') + ': ' + (message.display || message.content || '');
        }).filter(function(line) { return !!String(line || '').trim(); }).join('\n');
        return body ? '【最近主播对话】\n' + body : '';
    };

    function radioChatSummaryBlock() {
        /* 旧 chatSummary 是由全部 chatHistory 混合生成，无法可靠区分台本与主动聊天。
           严格过滤打开时只允许使用独立维护的主动聊天记录。 */
        var strict = bool(cfg.v3OmitRecentHostTalk, false);
        var summary = String(eng.store && (strict ? eng.store.proactiveChatSummary : eng.store.chatSummary) || '').trim();
        return summary ? '【电台聊天总结】\n' + summary : '';
    }

    /* 基础版会在聊天过长时压缩并删除旧消息。压缩前，把其中尚未记录过的
       用户主动消息及对应 API 回复单独保存，自动播放台本永远不进入这里。 */
    var maybeSummarizeChatWithMixedHistory = _maybeSummarizeChat;
    _maybeSummarizeChat = function() {
        try {
            var recentCount = _num(cfg.chatRecentMessages, 10);
            var summaryBatch = _num(cfg.chatSummaryBatch, 40);
            var history = (eng.store && eng.store.chatHistory) || [];
            if (history.length > recentCount + summaryBatch) {
                var old = history.slice(0, history.length - recentCount);
                var captured = old.filter(function(message) {
                    return !isAutomaticScriptHistory(message) && !message.v3ProactiveSummaryCaptured;
                });
                if (captured.length) {
                    var added = captured.map(function(message) {
                        message.v3ProactiveSummaryCaptured = true;
                        return (message.role === 'user' ? '用户' : '主播') + ': ' + (message.display || message.content || '');
                    }).filter(function(line) {
                        return !!String(line || '').trim();
                    }).join('\n');
                    var previous = String(eng.store.proactiveChatSummary || '').trim();
                    var combined = [previous, added].filter(Boolean).join('\n');
                    eng.store.proactiveChatSummary = combined.slice(-12000);
                    eng.saveStore();
                }
            }
        } catch (captureError) {}
        return maybeSummarizeChatWithMixedHistory.apply(this, arguments);
    };

    if (eng.request && !eng.request.__vnrRouteDebugWrapped) {
        var requestWithRouteSource = eng.request;
        var requestWithRoute = function(note, done, label, type) {
            var routeDebug = {
                route: 'eng.request',
                mode: v3.state.mode,
                requestType: type || 'request',
                label: label || '请求曲目+台本',
                omitRecentHostTalk: bool(cfg.v3OmitRecentHostTalk, false),
                recentHostTalkChars: _recentRadioTalk(cfg.recommendChatMessages).length,
                startedAt: new Date().toISOString()
            };
            eng.lastApiRoute = routeDebug;
            try { TOP.__vnmRadioLastRoute = routeDebug; } catch (e) {}
            try { TOP.localStorage.setItem('vnm-radio-last-route-debug', JSON.stringify(routeDebug)); } catch (e2) {}
            return requestWithRouteSource.apply(eng, arguments);
        };
        requestWithRoute.__vnrRouteDebugWrapped = true;
        eng.request = requestWithRoute;
    }
    if (eng.sendChat && !eng.sendChat.__vnrRouteDebugWrapped) {
        var sendChatWithRouteSource = eng.sendChat;
        var sendChatWithRoute = function(text, retry) {
            var routeDebug = {
                route: 'eng.sendChat',
                mode: v3.state.mode,
                retry: !!retry,
                label: '主播连线聊天',
                omitRecentHostTalk: bool(cfg.v3OmitRecentHostTalk, false),
                recentHostTalkChars: _recentRadioTalk(cfg.recommendChatMessages).length,
                startedAt: new Date().toISOString()
            };
            eng.lastApiRoute = routeDebug;
            try { TOP.__vnmRadioLastRoute = routeDebug; } catch (e) {}
            try { TOP.localStorage.setItem('vnm-radio-last-route-debug', JSON.stringify(routeDebug)); } catch (e2) {}
            return sendChatWithRouteSource.apply(eng, arguments);
        };
        sendChatWithRoute.__vnrRouteDebugWrapped = true;
        eng.sendChat = sendChatWithRoute;
    }

    var oldBuildCommon = _buildCommon;
    _buildCommon = function(tpl, extra) {
        extra = extra || {};
        var summarySlot = '__VNM_RADIO_CHAT_SUMMARY_BLOCK__';
        var preparedTpl = String(tpl || '').replace(/\{\{聊天总结\}\}/g, summarySlot);
        var out = oldBuildCommon(preparedTpl, extra);
        out = out.split(summarySlot).join(radioChatSummaryBlock());
        var pl = v3.currentPlaylist() || {};
        var random = v3.state.mode === 'playlist' && pl.playMode === 'shuffle' ? (cfg.v3RandomModulePrompt || '') : '';
        var task = extra.taskRequirement || (cfg.v3TaskModulePrompt || '');
        var lyrics = v3.state.mode === 'playlist' ? (cfg.v3LyricsModulePrompt || '') : '';
        var map = {
            '当前任务要求': task,
            '随机播放要求': random,
            '歌词检索要求': lyrics,
            '输出格式要求': extra.outputRequirement || '',
            '只推荐歌曲要求': extra.recommendOnly ? (cfg.v3RecommendOnlyPrompt || '') : '',
            '目标字数': extra.targetWords || '',
            '停顿数量要求': extra.pauseCountRequirement || '',
            '停顿秒数要求': extra.pauseSecondsRequirement || ''
        };
        for (var k in map) if (map.hasOwnProperty(k)) out = out.replace(new RegExp('\\{\\{' + k + '\\}\\}', 'g'), map[k]);
        return out;
    };

    var oldHostRoleText = _hostRoleText;
    _hostRoleText = function(hosts) {
        if (!bool(cfg.v3ShortPersonaEnabled, false)) return oldHostRoleText(hosts);
        return (hosts || []).map(function(ch) {
            var id = _charId(ch);
            var shortText = String(v3.state.shortPersonas[id] || '').trim();
            return '【' + (ch.name || '未命名') + '】\n' + (shortText || ch.persona || '');
        }).join('\n\n');
    };

    function pickedQueueItems(limit) {
        var all = (eng.current ? [eng.current] : []).concat(eng.queue || []);
        var targets = all.filter(function(it) { return it && (it.needsScript || !it.say || it.scriptFresh === false); });
        limit = Math.max(1, _num(limit, 30));
        var pl = v3.currentPlaylist() || {};
        if (pl.playMode === 'shuffle' && targets.length > limit) {
            targets = targets.slice();
            for (var i = targets.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1)), tmp = targets[i];
                targets[i] = targets[j]; targets[j] = tmp;
            }
        }
        return targets.slice(0, limit);
    }

    v3.requestLinkedScripts = function(manual, selectedIds) {
        if (v3.songScriptsSuppressed()) {
            if (manual) _toast('陪伴模式正在使用长台本，不请求歌曲台本');
            return;
        }
        if (eng.scriptBusy) return;
        if (!manual && !v3.consumeAutoRequest()) {
            _toast('睡眠模式的自动请求次数已用完');
            return;
        }
        var pl = v3.currentPlaylist() || {};
        var targets = pickedQueueItems(pl.scriptBatchSize || 30);
        if (selectedIds && selectedIds.length) {
            var set = {};
            selectedIds.forEach(function(id) { set[id] = 1; });
            targets = ((eng.current ? [eng.current] : []).concat(eng.queue || [])).filter(function(it) { return it && set[it.id]; });
        }
        if (!targets.length) {
            _toast('当前播放列表没有需要补写的台本');
            return;
        }
        eng.scriptBusy = true;
        targets.forEach(function(it, i) { it.v3ScriptKey = 'track_' + (i + 1) + '_' + it.id; });
        var lines = targets.map(function(it) {
            var s = it.song || {};
            return it.v3ScriptKey + '. ' + (s.title || s.query || '未命名歌曲') + (s.artist ? ' - ' + s.artist : '');
        }).join('\n');
        var output = '{"scripts":[{"key":"原样曲目key","host":"主持人名字","say":"[VoiceTag:主持人名字:朗读语言:发送给TTS的文本]“显示文本”"}]}';
        var prompt = _buildCommon(cfg.scriptRewritePrompt || cfg.promptTemplate || '', {
            songList: lines,
            taskRequirement: '不要推荐歌曲。请只为给定曲目逐首编写对应台本。',
            outputRequirement: '最终只返回合法 JSON：' + output
        });
        _setApiStatus('loading', 'v3-linked', '请求曲目关联台本', '', '');
        _chat([{ role: 'system', content: prompt }, { role: 'user', content: '请为这些曲目补写对应台本，并严格保留每个 key。' }], function(text) {
            eng.scriptBusy = false;
            var scripts = _scriptsFromReturn(text) || [];
            var byKey = {};
            scripts.forEach(function(s) { byKey[s.key] = s; });
            var count = 0;
            targets.forEach(function(it) {
                var sc = byKey[it.v3ScriptKey];
                delete it.v3ScriptKey;
                if (!sc || !sc.say) return;
                it.say = sc.say;
                it.host = sc.host || '';
                it.needsScript = false;
                it.scriptFresh = true;
                it.spoken = false;
                count++;
                v3.saveSongScript(it, {
                    host: it.host,
                    say: it.say,
                    favorite: false,
                    label: '关联台本'
                });
            });
            eng.saveQueue();
            v3.save();
            _clearApiStatus('v3-linked');
            _toast('已更新 ' + count + ' 首歌曲的台本');
            v3.uiRefresh();
            if (eng.current && eng.current.say && !eng.current.spoken) _speakItem(eng.current, false);
        }, function(e) {
            eng.scriptBusy = false;
            targets.forEach(function(it) { delete it.v3ScriptKey; });
            _setApiStatus('error', 'v3-linked', '请求曲目关联台本', e, '');
            _toast('关联台本请求失败: ' + e);
        });
    };

    function companionPauseRules() {
        var minC = Math.max(0, _num(cfg.v3PauseMinCount, 3));
        var maxC = Math.max(0, _num(cfg.v3PauseMaxCount, 8));
        var count;
        if (minC && maxC) count = '停顿节点数量不少于 ' + Math.min(minC, maxC) + ' 个且不多于 ' + Math.max(minC, maxC) + ' 个。';
        else if (minC) count = '停顿节点数量不少于 ' + minC + ' 个。';
        else if (maxC) count = '停顿节点数量不多于 ' + maxC + ' 个。';
        else count = '停顿节点数量由内容自然决定。';
        var minSeconds = Math.max(0, _num(cfg.v3PauseMinSeconds, 5));
        var maxSeconds = Math.max(0, _num(cfg.v3PauseMaxSeconds, 30));
        return {
            count: count,
            seconds: '每个停顿必须作为 nodes 数组中的独立字符串输出，严格使用 "[pause=Ns]" 格式；N 必须在 ' + Math.min(minSeconds, maxSeconds) + ' 到 ' + Math.max(minSeconds, maxSeconds) + ' 之间。例如 24 秒写成 "[pause=24s]"。不得把标记写进主持人的朗读文本。'
        };
    }

    function companionRawNodes(obj) {
        if (Object.prototype.toString.call(obj) === '[object Array]') return { key: '$', value: obj };
        obj = obj || {};
        var candidates = [
            ['nodes', obj.nodes], ['segments', obj.segments], ['items', obj.items],
            ['script', obj.script],
            ['script.nodes', obj.script && obj.script.nodes],
            ['script.segments', obj.script && obj.script.segments],
            ['data.nodes', obj.data && obj.data.nodes],
            ['data.segments', obj.data && obj.data.segments],
            ['radioScript.nodes', obj.radioScript && obj.radioScript.nodes],
            ['radio_script.nodes', obj.radio_script && obj.radio_script.nodes]
        ];
        for (var i = 0; i < candidates.length; i++) {
            if (Object.prototype.toString.call(candidates[i][1]) === '[object Array]') {
                return { key: candidates[i][0], value: candidates[i][1] };
            }
        }
        function findNested(value, path, depth) {
            if (!value || typeof value !== 'object' || depth > 3) return null;
            var keys = Object.keys(value);
            for (var j = 0; j < keys.length; j++) {
                var child = value[keys[j]], childPath = path ? path + '.' + keys[j] : keys[j];
                if (Object.prototype.toString.call(child) === '[object Array]' && /nodes|segments|items|script/i.test(keys[j])) {
                    return { key: childPath, value: child };
                }
            }
            for (var k = 0; k < keys.length; k++) {
                var nested = findNested(value[keys[k]], path ? path + '.' + keys[k] : keys[k], depth + 1);
                if (nested) return nested;
            }
            return null;
        }
        var nestedResult = findNested(obj, '', 0);
        if (nestedResult) return nestedResult;
        return { key: '', value: [] };
    }

    function recordCompanionDebug(debug) {
        debug = debug || {};
        if (!debug.route) debug.route = eng.lastApiRoute || null;
        if (debug.source !== 'request-start' && !debug.apiSnapshot && eng.lastApiDebug) {
            try { debug.apiSnapshot = JSON.parse(JSON.stringify(eng.lastApiDebug)); } catch (eApi) {}
        }
        debug.recordedAt = new Date().toISOString();
        try { TOP.__vnmRadioLastCompanionDebug = debug; } catch (e) {}
        try { TOP.localStorage.setItem('vnm-radio-last-companion-debug', JSON.stringify(debug)); } catch (e2) {}
        try {
            TOP.localStorage.setItem('vnm-radio-last-companion-bundle', JSON.stringify({
                route: debug.route || null,
                api: debug.apiSnapshot || null,
                parser: debug
            }));
        } catch (e3) {}
        return debug;
    }

    function parseCompanion(text, debug) {
        var obj = _jsonFromText(text);
        var picked = companionRawNodes(obj);
        var raw = picked.value;
        if (Object.prototype.toString.call(raw) !== '[object Array]') raw = [];
        var hosts = _selectedHosts(eng.store || {});
        var fallback = hosts[0] && hosts[0].name || '主持人';
        var out = [];

        function pauseValue(seconds) {
            var min = Math.max(0, _num(cfg.v3PauseMinSeconds, 5));
            var max = Math.max(0, _num(cfg.v3PauseMaxSeconds, 30));
            return _clamp(_num(seconds, min || 5), Math.min(min, max), Math.max(min, max));
        }

        function pushPause(seconds) {
            out.push({ id: uid('pause'), type: 'pause', seconds: pauseValue(seconds) });
        }

        function markedParts(value) {
            value = String(value || '');
            var parts = [], re = /\[pause\s*=\s*(\d+(?:\.\d+)?)\s*s\]/ig, at = 0, m;
            while ((m = re.exec(value))) {
                if (m.index > at) parts.push({ type: 'speech', text: value.slice(at, m.index) });
                parts.push({ type: 'pause', seconds: m[1] });
                at = re.lastIndex;
            }
            if (at < value.length) parts.push({ type: 'speech', text: value.slice(at) });
            return parts;
        }

        function pushMarkedSpeech(host, tts, display) {
            var ttsParts = markedParts(tts);
            var displayParts = markedParts(display);
            var displaySpeech = displayParts.filter(function(p) { return p.type === 'speech'; });
            var displayIndex = 0;
            ttsParts.forEach(function(part) {
                if (part.type === 'pause') {
                    pushPause(part.seconds);
                    return;
                }
                var spoken = String(part.text || '').trim();
                var shown = displaySpeech[displayIndex] ? String(displaySpeech[displayIndex].text || '').trim() : spoken;
                displayIndex++;
                if (!spoken && !shown) return;
                out.push({ id: uid('speech'), type: 'speech', host: host, ttsText: spoken || shown, displayText: shown || spoken });
            });
        }

        var ignored = [];
        raw.forEach(function(n, rawIndex) {
            if (!n) return;
            if (typeof n === 'string') {
                var marker = /^\s*\[pause\s*=\s*(\d+(?:\.\d+)?)\s*s\]\s*$/i.exec(n);
                if (marker) pushPause(marker[1]);
                else pushMarkedSpeech(fallback, n, n);
                return;
            }
            if (n.type === 'pause' || n.pauseSeconds !== undefined || n.seconds !== undefined && !n.ttsText && !n.text) {
                pushPause(n.seconds !== undefined ? n.seconds : (n.pauseSeconds !== undefined ? n.pauseSeconds : n.duration));
                return;
            }
            var host = String(n.host || n.speaker || n.character || fallback).trim();
            var tts = String(n.ttsText || n.tts || n.speech || n.text || n.content || '').trim();
            var display = String(n.displayText || n.display || n.translation || tts).trim();
            if (!tts && !display) {
                ignored.push({ index: rawIndex, reason: '对象没有可识别的 ttsText/tts/speech/text/displayText 字段', value: n });
                return;
            }
            pushMarkedSpeech(host, tts || display, display || tts);
        });
        if (debug) {
            debug.contentJsonValid = !!obj;
            debug.parsedTopLevelType = Object.prototype.toString.call(obj);
            debug.parsedTopLevelKeys = obj && typeof obj === 'object' && Object.prototype.toString.call(obj) !== '[object Array]' ? Object.keys(obj) : [];
            debug.nodesSourceKey = picked.key;
            debug.rawNodeCount = raw.length;
            debug.rawFirstNode = raw.length ? raw[0] : null;
            debug.rawLastNode = raw.length ? raw[raw.length - 1] : null;
            debug.playableNodeCount = out.length;
            debug.speechCount = out.filter(function(n) { return n.type === 'speech'; }).length;
            debug.pauseCount = out.filter(function(n) { return n.type === 'pause'; }).length;
            debug.playableFirstNode = out.length ? out[0] : null;
            debug.playableLastNode = out.length ? out[out.length - 1] : null;
            debug.ignoredNodes = ignored;
            debug.failureReason = !obj ? '返回内容不是可解析的 JSON' : (!picked.key ? 'JSON 中未找到支持的 nodes/segments/items 数组' : (!out.length ? '节点数组存在，但没有节点能转换为 speech 或 pause' : ''));
        }
        return out;
    }

    v3.debugParseCompanion = function(text) {
        var debug = { source: 'manual-console', content: String(text || ''), contentChars: String(text || '').length };
        debug.nodes = parseCompanion(text, debug);
        return recordCompanionDebug(debug);
    };

    TOP._vnmRadioDiagnoseCompanion = function() {
        var api = TOP.__vnmRadioLastApi || null;
        var parser = TOP.__vnmRadioLastCompanionDebug || null;
        var route = TOP.__vnmRadioLastRoute || null;
        var bundle = null;
        try { bundle = JSON.parse(TOP.localStorage.getItem('vnm-radio-last-companion-bundle') || 'null'); } catch (eBundle) {}
        try { if (!api) api = JSON.parse(TOP.localStorage.getItem('vnm-radio-last-api-debug') || 'null'); } catch (e) {}
        try { if (!parser) parser = JSON.parse(TOP.localStorage.getItem('vnm-radio-last-companion-debug') || 'null'); } catch (e2) {}
        try { if (!route) route = JSON.parse(TOP.localStorage.getItem('vnm-radio-last-route-debug') || 'null'); } catch (eRoute) {}
        if (bundle && bundle.parser) parser = bundle.parser;
        if (bundle && bundle.api) api = bundle.api;
        else if (!api && parser && parser.apiSnapshot) api = parser.apiSnapshot;
        if (bundle && bundle.route) route = bundle.route;
        else if (!route && parser && parser.route) route = parser.route;
        var response = null, content = parser && parser.content || '';
        try {
            response = api && api.responseText ? JSON.parse(api.responseText) : null;
            if (!content) content = response && response.choices && response.choices[0] && response.choices[0].message && response.choices[0].message.content || '';
        } catch (e3) {}
        var responseContent = response && response.choices && response.choices[0] && response.choices[0].message && response.choices[0].message.content || '';
        var parserWasMissingOrStale = !parser || (responseContent && String(parser.content || '') !== String(responseContent));
        if (parserWasMissingOrStale && responseContent) {
            parser = { source: 'diagnostic-reparse', content: String(responseContent), contentChars: String(responseContent).length };
            try {
                parser.nodes = parseCompanion(responseContent, parser);
            } catch (reparseError) {
                parser.nodes = [];
                parser.failureReason = '诊断重新解析抛出异常：' + (reparseError && reparseError.message || String(reparseError));
            }
            parser.originalParserWasMissingOrStale = true;
            recordCompanionDebug(parser);
            content = responseContent;
        }
        var choice = response && response.choices && response.choices[0] || {};
        var parsedContent = _jsonFromText(responseContent);
        var firstReturnedItem = Object.prototype.toString.call(parsedContent) === '[object Array]' ? parsedContent[0] :
            parsedContent && (parsedContent.nodes || parsedContent.items || parsedContent.scripts || parsedContent.songs || [])[0];
        var formatDiagnosis = '';
        if (route && route.route === 'eng.request' && firstReturnedItem && firstReturnedItem.type === 'speech' &&
            !(firstReturnedItem.title || firstReturnedItem.song || firstReturnedItem.music || firstReturnedItem.track)) {
            formatDiagnosis = '请求实际走的是推荐模式 eng.request，但模型返回了陪伴模式 speech 数组；推荐模式需要歌曲 items/title/artist，所以应用会判定格式不符合。';
        } else if (route && route.route === 'eng.sendChat') {
            formatDiagnosis = '请求实际走的是 Songs 主页的“主播连线聊天”，这条入口只增加聊天消息，不会创建新的连续台本。要生成历史台本，请使用陪伴模式的请求按钮或台本库里的“请求完整台本”。';
        } else if (parser && parser.originalParserWasMissingOrStale && parser.playableNodeCount > 0) {
            formatDiagnosis = '原诊断缺少或错配了解析记录；本次已用同一份完整 content 重新解析成功。请刷新/重载新版 Radio 后再请求一次。';
        } else if (parser && parser.failureReason) {
            formatDiagnosis = parser.failureReason;
        }
        var historyStats = radioHistoryContextStats();
        var noStoredRequest = !api && !route && (!parser || parser.source === 'request-start');
        var conclusion = noStoredRequest ?
            '当前页面没有找到已完成的陪伴请求诊断记录。请刷新到新版后重新请求一次；新版会把路由、HTTP 原文和解析结果绑定保存。' :
            (api && api.httpStatus === 200 && choice.finish_reason === 'stop' ?
                ('API 正常完整返回。' + (formatDiagnosis ? ' ' + formatDiagnosis : '若应用仍报失败，请重点看 parser.failureReason / ignoredNodes。')) :
                '请结合 HTTP 状态、finish_reason、providerError 与 parser.failureReason 判断。');
        var report = {
            conclusion: conclusion,
            requestRoute: route && route.route,
            mode: route && route.mode,
            omitRecentHostTalk: bool(cfg.v3OmitRecentHostTalk, false),
            recentHostTalkChars: _recentRadioTalk(cfg.recommendChatMessages).length,
            historyContext: historyStats,
            diagnosis: formatDiagnosis || parser && parser.failureReason || conclusion,
            nodesSource: parser && parser.nodesSourceKey,
            playableNodes: parser && parser.playableNodeCount,
            speechCount: parser && parser.speechCount,
            pauseCount: parser && parser.pauseCount,
            failureReason: parser && parser.failureReason || '',
            api: {
                state: api && api.state,
                httpStatus: api && api.httpStatus,
                httpStatusText: api && api.httpStatusText,
                durationMs: api && api.durationMs,
                model: response && response.model || api && api.request && api.request.model,
                requestedMaxTokens: api && api.request && api.request.max_tokens,
                finishReason: choice.finish_reason || '',
                usage: response && response.usage || null,
                providerError: response && response.error || api && api.error || ''
            },
            route: route,
            formatDiagnosis: formatDiagnosis,
            parser: parser,
            fullContent: String(content || ''),
            rawResponseText: api && api.responseText || ''
        };
        try {
            TOP.console.group('VNM Radio 陪伴台本完整诊断');
            TOP.console.log('结论：' + report.conclusion);
            TOP.console.log('API / 解析摘要：', report);
            TOP.console.log('完整模型 content（字符串，不会折叠）：\n' + report.fullContent);
            TOP.console.log('完整 HTTP responseText（字符串，不会折叠）：\n' + report.rawResponseText);
            TOP.console.log('复制全部报告：copy(JSON.stringify(_vnmRadioDiagnoseCompanion(), null, 2))');
            TOP.console.groupEnd();
        } catch (e4) {}
        return report;
    };

    v3.requestCompanion = function(manual, options) {
        options = options || {};
        if (v3.state.localScriptMode) {
            if (manual) _toast('本地台本播放模式已开启，不会请求新的陪伴台本');
            return false;
        }
        if (eng.busy) return false;
        if (!manual && !v3.consumeAutoRequest()) return false;
        eng.busy = true;
        var words = Math.max(300, _num(cfg.v3CompanionWords, 3000));
        var pauseRules = companionPauseRules();
        var output = '{"nodes":[{"type":"speech","host":"主持人名字","ttsText":"发送给TTS的文本","displayText":"显示文本"},"[pause=15s]",{"type":"speech","host":"主持人名字","ttsText":"停顿后继续发送给TTS的文本","displayText":"停顿后继续显示的文本"}]}';
        var prompt = _buildCommon(cfg.v3CompanionPrompt || COMPANION_PROMPT_DEFAULT, {
            targetWords: String(words),
            pauseCountRequirement: pauseRules.count,
            pauseSecondsRequirement: pauseRules.seconds,
            outputRequirement: '最终只返回合法 JSON：' + output
        });
        var routeDebug = {
            route: 'v3.requestCompanion',
            mode: v3.state.mode,
            manual: !!manual,
            playImmediately: options.play !== false,
            playlistId: options.playlistId || (v3.currentPlaylist() || {}).id || 'now-playing',
            omitRecentHostTalk: bool(cfg.v3OmitRecentHostTalk, false),
            recentHostTalkChars: _recentRadioTalk(cfg.recommendChatMessages).length,
            historyContext: radioHistoryContextStats(),
            startedAt: new Date().toISOString()
        };
        eng.lastApiRoute = routeDebug;
        try { TOP.__vnmRadioLastRoute = routeDebug; } catch (eRoute) {}
        try { TOP.localStorage.setItem('vnm-radio-last-route-debug', JSON.stringify(routeDebug)); } catch (eRouteStore) {}
        recordCompanionDebug({
            source: 'request-start',
            route: routeDebug,
            request: { targetWords: words, systemPromptChars: prompt.length, userPromptChars: 10 }
        });
        _setApiStatus('loading', 'v3-companion', '请求连续台本', '', '');
        _chat([{ role: 'system', content: prompt }, { role: 'user', content: '请生成连续陪伴台本。' }], function(text) {
            eng.busy = false;
            var companionDebug = {
                source: 'request-success',
                route: routeDebug,
                request: { targetWords: words, systemPromptChars: prompt.length, userPromptChars: 10 },
                content: String(text || ''),
                contentChars: String(text || '').length
            };
            var nodes = [];
            try {
                nodes = parseCompanion(text, companionDebug);
            } catch (parseError) {
                companionDebug.failureReason = '陪伴台本解析抛出异常：' + (parseError && parseError.message || String(parseError));
                companionDebug.parseException = parseError && parseError.stack || String(parseError);
            }
            recordCompanionDebug(companionDebug);
            if (!nodes.length) {
                _setApiStatus('error', 'v3-companion', '请求连续台本', '返回中没有可播放节点', '');
                _toast('连续台本格式无法解析');
                return;
            }
            var version = {
                id: uid('continuous'),
                playlistId: options.playlistId || (v3.currentPlaylist() || {}).id || 'now-playing',
                createdAt: Date.now(),
                title: '陪伴台本 ' + new Date().toLocaleString(),
                nodes: nodes,
                raw: text,
                favorite: false,
                edited: false
            };
            v3.state.continuousVersions.unshift(version);
            var favorites = v3.state.continuousVersions.filter(function(x) { return x.favorite; });
            var normalByPlaylist = {}, normal = [];
            v3.state.continuousVersions.filter(function(x) { return !x.favorite; }).forEach(function(x) {
                var pid = x.playlistId || 'now-playing';
                normalByPlaylist[pid] = normalByPlaylist[pid] || 0;
                if (normalByPlaylist[pid] < 5) {
                    normalByPlaylist[pid]++;
                    normal.push(x);
                }
            });
            v3.state.continuousVersions = favorites.concat(normal);
            v3.save();
            _clearApiStatus('v3-companion');
            if (options.play === false) {
                _toast('下一份陪伴台本已准备好');
                if (options.onReady) options.onReady(version);
            } else {
                v3.state.activeContinuousIds[version.playlistId] = version.id;
                v3.state.activeContinuousId = version.id;
                v3.save();
                _toast('连续台本已生成');
                v3.playContinuous(version.id);
            }
            v3.uiRefresh();
        }, function(e) {
            eng.busy = false;
            recordCompanionDebug({
                source: 'request-error',
                route: routeDebug,
                request: { targetWords: words, systemPromptChars: prompt.length, userPromptChars: 10 },
                providerError: e && e.message || String(e || '未知错误')
            });
            _setApiStatus('error', 'v3-companion', '请求连续台本', e, '');
            _toast('连续台本请求失败: ' + e);
            if (options.onError) options.onError(e);
        });
        return true;
    };

    v3.activeContinuous = function(playlistId) {
        playlistId = playlistId || (v3.currentPlaylist() || {}).id || 'now-playing';
        var arr = v3.state.continuousVersions || [];
        var activeId = v3.state.activeContinuousIds[playlistId] || '';
        for (var i = 0; i < arr.length; i++) if (arr[i].playlistId === playlistId && arr[i].id === activeId) return arr[i];
        for (var j = 0; j < arr.length; j++) if ((arr[j].playlistId || 'now-playing') === playlistId) return arr[j];
        return null;
    };

    v3.deleteContinuousVersion = function(id) {
        var version = v3.continuousById(id);
        if (!version || version.favorite) return false;
        if (v3.continuousRuntime && v3.continuousRuntime.versionId === id) v3.stopContinuous();
        var next = [];
        (v3.state.continuousVersions || []).forEach(function(item) {
            if (item && item.id !== id) next.push(item);
        });
        v3.state.continuousVersions = next;
        var playlistId = version.playlistId || 'now-playing';
        if (v3.state.activeContinuousIds[playlistId] === id) {
            var replacement = null;
            for (var i = 0; i < next.length; i++) {
                if ((next[i].playlistId || 'now-playing') === playlistId) {
                    replacement = next[i];
                    break;
                }
            }
            v3.state.activeContinuousIds[playlistId] = replacement ? replacement.id : '';
        }
        if (v3.state.activeContinuousId === id) v3.state.activeContinuousId = '';
        v3.state.localScriptQueue = (v3.state.localScriptQueue || []).filter(function(itemId) { return itemId !== id; });
        (version.audioCacheKeys || []).forEach(function(key) { cacheRecordDelete('audio', key).catch(function() {}); });
        (version.audioAssets || []).forEach(function(asset) {
            if (asset && asset.blobKey) cacheRecordDelete('audio', asset.blobKey).catch(function() {});
        });
        v3.save();
        v3.uiRefresh();
        return true;
    };

    function hostForName(name) {
        return _charByName(name || '', _selectedHosts(eng.store || {})) || _selectedHosts(eng.store || {})[0] || null;
    }

    v3.continuousById = function(id) {
        var found = null;
        (v3.state.continuousVersions || []).forEach(function(version) {
            if (version && version.id === id) found = version;
        });
        return found;
    };

    var audioCacheDbPromise = null;

    function openAudioCacheDb() {
        if (audioCacheDbPromise) return audioCacheDbPromise;
        audioCacheDbPromise = new TOP.Promise(function(resolve, reject) {
            if (!TOP.indexedDB) {
                reject(new Error('当前浏览器不支持本地语音缓存'));
                return;
            }
            var req = TOP.indexedDB.open('vnm-radio-audio-cache-v1', 1);
            req.onupgradeneeded = function() {
                var db = req.result;
                if (!db.objectStoreNames.contains('audio')) db.createObjectStore('audio', { keyPath: 'key' });
                if (!db.objectStoreNames.contains('meta')) db.createObjectStore('meta', { keyPath: 'key' });
            };
            req.onsuccess = function() { resolve(req.result); };
            req.onerror = function() { reject(req.error || new Error('本地语音缓存打开失败')); };
        });
        return audioCacheDbPromise;
    }

    function cacheRecordGet(storeName, key) {
        return openAudioCacheDb().then(function(db) {
            return new TOP.Promise(function(resolve, reject) {
                var req = db.transaction(storeName, 'readonly').objectStore(storeName).get(key);
                req.onsuccess = function() { resolve(req.result || null); };
                req.onerror = function() { reject(req.error || new Error('读取本地缓存失败')); };
            });
        });
    }

    function cacheRecordPut(storeName, value) {
        return openAudioCacheDb().then(function(db) {
            return new TOP.Promise(function(resolve, reject) {
                var req = db.transaction(storeName, 'readwrite').objectStore(storeName).put(value);
                req.onsuccess = function() { resolve(value); };
                req.onerror = function() { reject(req.error || new Error('写入本地缓存失败')); };
            });
        });
    }

    function cacheRecordDelete(storeName, key) {
        return openAudioCacheDb().then(function(db) {
            return new TOP.Promise(function(resolve, reject) {
                var req = db.transaction(storeName, 'readwrite').objectStore(storeName)["delete"](key);
                req.onsuccess = function() { resolve(); };
                req.onerror = function() { reject(req.error || new Error('删除本地缓存失败')); };
            });
        });
    }

    function speechNodes(version) {
        return (version && version.nodes || []).filter(function(node) { return node && node.type !== 'pause'; });
    }

    function audioAssetBlobKey(versionId, assetId) {
        return 'asset|' + versionId + '|' + assetId;
    }

    function autoMatchAsset(version, name) {
        var nodes = speechNodes(version);
        if (!nodes.length) return [];
        var lower = String(name || '').toLowerCase();
        var numberMatch = lower.match(/(?:^|[^\d])0*(\d{1,4})(?:[^\d]|$)/);
        if (numberMatch) {
            var index = _num(numberMatch[1], 0) - 1;
            if (nodes[index]) return [nodes[index].id];
        }
        var normalized = lower.replace(/\.[a-z0-9]{2,5}$/i, '').replace(/[\s_\-.[\]()（）【】]+/g, '');
        for (var i = 0; i < nodes.length; i++) {
            var text = String(nodes[i].displayText || nodes[i].ttsText || '').toLowerCase().replace(/[\s_\-.,，。！？!?；;:：'"“”‘’]+/g, '');
            if (normalized.length >= 6 && text.indexOf(normalized.slice(0, Math.min(18, normalized.length))) >= 0) return [nodes[i].id];
        }
        return [];
    }

    function mapAsset(version, assetId, nodeIds) {
        version.segmentAudioMap = version.segmentAudioMap || {};
        speechNodes(version).forEach(function(node) {
            var list = Object.prototype.toString.call(version.segmentAudioMap[node.id]) === '[object Array]' ? version.segmentAudioMap[node.id] : [];
            version.segmentAudioMap[node.id] = list.filter(function(id) { return id !== assetId; });
        });
        (nodeIds || []).forEach(function(nodeId) {
            var list = version.segmentAudioMap[nodeId] || (version.segmentAudioMap[nodeId] = []);
            if (list.indexOf(assetId) < 0) list.push(assetId);
        });
    }

    v3.setAudioAssetSegments = function(versionId, assetId, nodeIds) {
        var version = v3.continuousById(versionId);
        if (!version) return false;
        mapAsset(version, assetId, nodeIds || []);
        v3.save();
        v3.uiRefresh();
        return true;
    };

    v3.addAudioFiles = function(versionId, files, done) {
        var version = v3.continuousById(versionId);
        files = Array.prototype.slice.call(files || []);
        if (!version || !files.length) {
            done && done('没有选择音频文件');
            return;
        }
        version.audioAssets = version.audioAssets || [];
        var index = 0, added = [];
        function next() {
            if (index >= files.length) {
                v3.save();
                v3.uiRefresh();
                done && done(null, added);
                return;
            }
            var file = files[index++];
            var asset = {
                id: uid('audio'),
                name: file.name || ('音频 ' + index),
                kind: 'file',
                blobKey: '',
                createdAt: Date.now()
            };
            asset.blobKey = audioAssetBlobKey(version.id, asset.id);
            cacheRecordPut('audio', {
                key: asset.blobKey,
                versionId: version.id,
                assetId: asset.id,
                createdAt: Date.now(),
                type: file.type || 'audio/mpeg',
                blob: file
            }).then(function() {
                version.audioAssets.push(asset);
                mapAsset(version, asset.id, autoMatchAsset(version, asset.name));
                added.push(asset);
                next();
            }).catch(function(e) { done && done((e && e.message) || String(e)); });
        }
        next();
    };

    v3.addAudioUrls = function(versionId, urls, done) {
        var version = v3.continuousById(versionId);
        urls = (urls || []).map(function(url) { return String(url || '').trim(); }).filter(Boolean);
        if (!version || !urls.length) {
            done && done('没有可添加的音频 URL');
            return;
        }
        version.audioAssets = version.audioAssets || [];
        var added = [];
        urls.forEach(function(url, index) {
            var pathname = url.split(/[?#]/)[0];
            var decodedName = '';
            try { decodedName = decodeURIComponent(pathname.slice(pathname.lastIndexOf('/') + 1)); } catch (e) { decodedName = pathname.slice(pathname.lastIndexOf('/') + 1); }
            var asset = {
                id: uid('audio'),
                name: decodedName || ('URL 音频 ' + (index + 1)),
                kind: 'url',
                url: url,
                createdAt: Date.now()
            };
            version.audioAssets.push(asset);
            mapAsset(version, asset.id, autoMatchAsset(version, asset.name));
            added.push(asset);
        });
        v3.save();
        v3.uiRefresh();
        done && done(null, added);
    };

    v3.deleteAudioAsset = function(versionId, assetId, done) {
        var version = v3.continuousById(versionId);
        if (!version) return;
        var asset = null;
        version.audioAssets = (version.audioAssets || []).filter(function(item) {
            if (item.id === assetId) asset = item;
            return item.id !== assetId;
        });
        mapAsset(version, assetId, []);
        var finish = asset && asset.blobKey ? cacheRecordDelete('audio', asset.blobKey) : TOP.Promise.resolve();
        finish.catch(function() {}).then(function() {
            v3.save();
            v3.uiRefresh();
            done && done(null);
        });
    };

    function simpleHash(text) {
        text = String(text || '');
        var hash = 2166136261;
        for (var i = 0; i < text.length; i++) {
            hash ^= text.charCodeAt(i);
            hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
        }
        return (hash >>> 0).toString(36);
    }

    function voiceSignature(host) {
        var ch = hostForName(host) || {};
        return [
            _ttsProviderFor(ch),
            ch.ttsVoiceId || ch.fishVoiceId || '',
            ch.ttsSpeed || 1,
            ch.ttsLanguage || ''
        ].join('|');
    }

    function audioCacheKey(version, item) {
        return [
            'continuous',
            version.id,
            item.id,
            simpleHash((item.host || '') + '\n' + (item.ttsText || '') + '\n' + voiceSignature(item.host))
        ].join('|');
    }

    function safeFilePart(text) {
        return String(text || '').replace(/[<>:"/\\|?*\x00-\x1f]/g, '_').replace(/[.\s]+$/g, '').slice(0, 80) || 'radio-script';
    }

    function ensureDirectoryPermission(handle, request) {
        if (!handle) return TOP.Promise.resolve(false);
        var options = { mode: 'readwrite' };
        if (!handle.queryPermission) return TOP.Promise.resolve(true);
        return handle.queryPermission(options).then(function(state) {
            if (state === 'granted') return true;
            if (request && handle.requestPermission) return handle.requestPermission(options).then(function(next) { return next === 'granted'; });
            return false;
        });
    }

    function getCacheDirectory(requestPermission) {
        return cacheRecordGet('meta', 'directory-handle').then(function(record) {
            var handle = record && record.handle;
            if (!handle) return null;
            return ensureDirectoryPermission(handle, requestPermission).then(function(ok) { return ok ? handle : null; });
        }).catch(function() { return null; });
    }

    v3.chooseCacheDirectory = function(done) {
        var picker = TOP.showDirectoryPicker;
        if (typeof picker !== 'function') {
            done && done('当前浏览器不支持选择电脑目录；仍可使用浏览器本地缓存');
            return;
        }
        picker.call(TOP, { mode: 'readwrite', id: 'vnm-radio-audio-cache' }).then(function(handle) {
            return cacheRecordPut('meta', { key: 'directory-handle', handle: handle }).then(function() {
                v3.state.cacheDirectoryName = handle.name || '已选择目录';
                v3.save();
                done && done(null, v3.state.cacheDirectoryName);
            });
        }).catch(function(e) {
            if (e && e.name === 'AbortError') return;
            done && done((e && e.message) || String(e));
        });
    };

    function blobFromUrl(url) {
        return TOP.fetch(url).then(function(response) {
            if (!response.ok) throw new Error('读取语音片段失败 HTTP ' + response.status);
            return response.blob();
        });
    }

    function getDirectoryCachedBlob(version, item) {
        var fileName = version.audioFiles && version.audioFiles[item.cacheKey];
        if (!fileName || !version.audioDirectoryFolder) return TOP.Promise.resolve(null);
        return getCacheDirectory(false).then(function(root) {
            if (!root) return null;
            return root.getDirectoryHandle(version.audioDirectoryFolder).then(function(dir) {
                return dir.getFileHandle(fileName).then(function(fileHandle) { return fileHandle.getFile(); });
            });
        }).catch(function() { return null; });
    }

    function getCachedAudioBlob(version, item) {
        return cacheRecordGet('audio', item.cacheKey).then(function(record) {
            if (record && record.blob) return record.blob;
            return getDirectoryCachedBlob(version, item);
        }).catch(function() {
            return getDirectoryCachedBlob(version, item);
        });
    }

    function putCachedAudioBlob(version, item, blob) {
        version.audioCacheKeys = version.audioCacheKeys || [];
        if (version.audioCacheKeys.indexOf(item.cacheKey) < 0) version.audioCacheKeys.push(item.cacheKey);
        version.audioCachedAt = Date.now();
        return cacheRecordPut('audio', {
            key: item.cacheKey,
            versionId: version.id,
            itemId: item.id,
            createdAt: Date.now(),
            type: blob.type || 'audio/mpeg',
            blob: blob
        });
    }

    function writeBlobFile(dir, name, blob) {
        return dir.getFileHandle(name, { create: true }).then(function(handle) {
            return handle.createWritable();
        }).then(function(writer) {
            return writer.write(blob).then(function() { return writer.close(); });
        });
    }

    function splitSpeechSentences(text) {
        text = String(text || '').trim();
        if (!text) return [];
        var matches = text.match(/[^。！？!?；;\n]+[。！？!?；;]?/g) || [text];
        return matches.map(function(part) { return String(part || '').trim(); }).filter(Boolean);
    }

    function runtimeItems(version) {
        var out = [];
        var source = version.nodes || [];
        var segmentMap = version.segmentAudioMap || {};

        function appendSpeech(n) {
            var ttsText = String(n.ttsText || '').trim();
            if (!ttsText) return;
            var displayText = String(n.displayText || n.ttsText || '').trim();
            out.push({
                id: n.id,
                nodeId: n.id,
                nodeIds: n.nodeIds || [n.id],
                type: 'speech',
                host: n.host,
                ttsText: ttsText,
                displayText: displayText || ttsText,
                captionSentences: splitSpeechSentences(displayText || ttsText),
                firstPart: true,
                url: '',
                requesting: false,
                error: ''
            });
        }

        function finalize() {
            out.forEach(function(item) {
                if (item.type === 'speech') item.cacheKey = audioCacheKey(version, item);
            });
            var sourceOrder = {};
            speechNodes(version).forEach(function(node, index) { sourceOrder[node.id] = index; });
            var mapping = version.segmentAudioMap || {};
            var firstNodeByAsset = {};
            Object.keys(mapping).forEach(function(nodeId) {
                (mapping[nodeId] || []).forEach(function(assetId) {
                    if (!firstNodeByAsset[assetId] || sourceOrder[nodeId] < sourceOrder[firstNodeByAsset[assetId]]) firstNodeByAsset[assetId] = nodeId;
                });
            });
            out.forEach(function(item) {
                if (item.type !== 'speech') return;
                var mapped = [];
                (item.nodeIds || [item.nodeId]).forEach(function(nodeId) {
                    (mapping[nodeId] || []).forEach(function(assetId) {
                        if (mapped.indexOf(assetId) < 0) mapped.push(assetId);
                    });
                });
                item.mappedCovered = mapped.length > 0;
                item.mappedAssetIds = item.firstPart ? mapped.filter(function(assetId) {
                    return (item.nodeIds || [item.nodeId]).indexOf(firstNodeByAsset[assetId]) >= 0;
                }) : [];
                item.skipMapped = item.mappedCovered && !item.mappedAssetIds.length;
            });
            return out;
        }

        var pending = null;
        function flushPending() {
            if (!pending) return;
            appendSpeech(pending);
            pending = null;
        }
        source.forEach(function(n) {
            if (n.type === 'pause') {
                flushPending();
                out.push({ id: n.id, type: 'pause', seconds: n.seconds });
                return;
            }
            var hasMappedAudio = !!(segmentMap[n.id] && segmentMap[n.id].length);
            if (hasMappedAudio) {
                flushPending();
                appendSpeech(n);
                return;
            }
            if (!pending || pending.host !== n.host) {
                flushPending();
                pending = {
                    id: n.id,
                    nodeIds: [n.id],
                    host: n.host,
                    ttsText: String(n.ttsText || '').trim(),
                    displayText: String(n.displayText || n.ttsText || '').trim()
                };
                return;
            }
            pending.nodeIds.push(n.id);
            pending.ttsText += (pending.ttsText ? '\n' : '') + String(n.ttsText || '').trim();
            pending.displayText += (pending.displayText ? '\n' : '') + String(n.displayText || n.ttsText || '').trim();
        });
        flushPending();
        return finalize();
    }

    function companionAutoRequestEnabled() {
        return !v3.state.localScriptMode && bool(cfg.v3CompanionAutoRequest, true) && v3.state.mode === 'companion';
    }

    function nextCompanionTriggerIndex(items) {
        items = items || [];
        var lastSpeech = -1, i;
        /* 末尾 pause 仍会播放，但不参与“何时请求下一台本”的计算。 */
        for (i = items.length - 1; i >= 0; i--) {
            if (items[i] && items[i].type === 'speech') {
                lastSpeech = i;
                break;
            }
        }
        if (lastSpeech < 0) return -1;
        /* 最后一个有效 pause 后面的整组朗读，是最后一组有效台本。 */
        for (i = lastSpeech - 1; i >= 0; i--) {
            if (items[i] && items[i].type === 'pause') return i + 1;
        }
        return 0;
    }
    v3.nextCompanionTriggerIndex = nextCompanionTriggerIndex;

    function requestNextCompanion(rt) {
        if (!rt || rt.stopped || rt.nextRequested || !companionAutoRequestEnabled()) return false;
        if (v3.continuousSequence) return false;
        rt.nextRequested = true;
        rt.nextPending = true;
        rt.nextError = '';
        var started = v3.requestCompanion(false, {
            play: false,
            playlistId: rt.version && rt.version.playlistId || 'now-playing',
            onReady: function(version) {
                rt.nextPending = false;
                rt.nextVersionId = version.id;
                if (rt.stopped || v3.continuousRuntime !== rt) return;
                if (rt.waitingForNext) v3.playContinuous(version.id);
                else v3.uiRefresh();
            },
            onError: function(error) {
                rt.nextPending = false;
                rt.nextRequested = false;
                rt.nextError = error || '下一份台本请求失败';
                if (rt.waitingForNext) {
                    rt.finished = true;
                    rt.waitingForNext = false;
                }
                v3.uiRefresh();
            }
        });
        if (!started) {
            rt.nextRequested = false;
            rt.nextPending = false;
            return false;
        }
        v3.uiRefresh();
        return true;
    }

    function mappedAssetById(version, id) {
        var found = null;
        (version.audioAssets || []).forEach(function(asset) { if (asset && asset.id === id) found = asset; });
        return found;
    }

    function loadMappedAssetUrls(version, item) {
        var ids = item.mappedAssetIds || [];
        var jobs = ids.map(function(id) {
            var asset = mappedAssetById(version, id);
            if (!asset) return TOP.Promise.resolve(null);
            if (asset.kind === 'url' && asset.url) return TOP.Promise.resolve({ url: asset.url, assetId: asset.id, objectUrl: false });
            if (!asset.blobKey) return TOP.Promise.resolve(null);
            return cacheRecordGet('audio', asset.blobKey).then(function(record) {
                if (!record || !record.blob) return null;
                var url = (TOP.URL || URL).createObjectURL(record.blob);
                return { url: url, assetId: asset.id, objectUrl: true };
            });
        });
        return TOP.Promise.all(jobs).then(function(rows) { return rows.filter(Boolean); });
    }

    function prefetchContinuous(rt) {
        if (!rt || rt.stopped) return;
        var wanted = Math.max(1, _num(cfg.v3TtsPrefetch, 2)), active = 0;
        for (var i = rt.index; i < rt.items.length && active < wanted; i++) {
            var item = rt.items[i];
            if (item.type === 'pause') break;
            if (item.type !== 'speech' || item.url || item.urls || item.skipMapped || item.requesting || item.error) continue;
            if (i === rt.nextTriggerIndex) requestNextCompanion(rt);
            item.requesting = true;
            active++;
            (function(job) {
                if (job.mappedAssetIds && job.mappedAssetIds.length) {
                    loadMappedAssetUrls(rt.version, job).then(function(rows) {
                        job.requesting = false;
                        if (rows.length) {
                            job.urls = rows;
                            job.url = rows[0].url;
                            job.mappedIndex = 0;
                        } else {
                            job.error = '匹配的本地/URL 音频不可用';
                        }
                        v3.uiRefresh();
                        if (rt.waitingFor === job.id) playContinuousNext(rt);
                        prefetchContinuous(rt);
                    }).catch(function(e) {
                        job.requesting = false;
                        job.error = (e && e.message) || String(e);
                        if (rt.waitingFor === job.id) playContinuousNext(rt);
                    });
                    return;
                }
                getCachedAudioBlob(rt.version, job).then(function(blob) {
                    if (rt.stopped) return;
                    if (blob) {
                        job.requesting = false;
                        job.cached = true;
                        job.url = (TOP.URL || URL).createObjectURL(blob);
                        job.cachedObjectUrl = job.url;
                        v3.uiRefresh();
                        if (rt.waitingFor === job.id) playContinuousNext(rt);
                        prefetchContinuous(rt);
                        return;
                    }
                    _tts(job.ttsText, hostForName(job.host), function(url) {
                        job.requesting = false;
                        job.url = url;
                        if (rt.version.audioCacheEnabled) {
                            blobFromUrl(url).then(function(generatedBlob) {
                                return putCachedAudioBlob(rt.version, job, generatedBlob);
                            }).then(function() {
                                v3.save();
                            }).catch(function() {});
                        }
                        v3.uiRefresh();
                        if (rt.waitingFor === job.id) playContinuousNext(rt);
                        prefetchContinuous(rt);
                    }, function(e) {
                        job.requesting = false;
                        job.error = e || 'TTS失败';
                        v3.uiRefresh();
                        if (rt.waitingFor === job.id) playContinuousNext(rt);
                        prefetchContinuous(rt);
                    });
                }).catch(function(e) {
                    job.requesting = false;
                    job.error = (e && e.message) || String(e);
                    v3.uiRefresh();
                });
            })(item);
        }
    }

    function clearCaptionTimer(rt) {
        if (!rt || !rt.captionTimer) return;
        try { TOP.clearInterval(rt.captionTimer); } catch (e) {}
        rt.captionTimer = null;
    }

    function recordContinuousSentence(rt, item, index, text) {
        text = String(text || '').trim();
        if (!rt || !item || !text) return;
        var key = String(item.id || rt.index) + ':' + index;
        rt.recordedCaptionKeys = rt.recordedCaptionKeys || {};
        if (rt.recordedCaptionKeys[key]) return;
        rt.recordedCaptionKeys[key] = true;
        var playlist = v3.playlist(rt.version && rt.version.playlistId || 'now-playing');
        var history = eng.store.chatHistory = eng.store.chatHistory || [];
        history.push({
            id: uid('continuous-message'),
            scriptId: rt.versionId,
            segmentIndex: index,
            role: 'assistant',
            kind: 'script',
            scriptKind: 'companion',
            host: item.host || '',
            song: playlist && playlist.name || '当前播放列表',
            content: text,
            display: text,
            tts: text,
            t: Date.now()
        });
        if (history.length > 400) history.splice(0, history.length - 400);
        eng.saveStore();
        try { TOP.dispatchEvent(new TOP.CustomEvent('vnm-radio-chat-refresh')); } catch (e) {}
    }

    function startCaptionTracking(rt, item, audio) {
        clearCaptionTimer(rt);
        var sentences = item.captionSentences || [];
        if (!sentences.length) sentences = [item.displayText || item.ttsText || ''];
        rt.currentText = sentences[0] || '';
        rt.currentCaptionIndex = 0;
        recordContinuousSentence(rt, item, 0, rt.currentText);
        if (rt.captionPopup && rt.captionPopup.setText) {
            rt.captionPopup.setText((item.host ? item.host + '：' : '') + rt.currentText);
        }
        if (sentences.length < 2) return;
        var weights = [], total = 0;
        sentences.forEach(function(sentence) {
            var weight = Math.max(1, String(sentence || '').replace(/\s+/g, '').length);
            weights.push(weight);
            total += weight;
        });
        rt.captionTimer = TOP.setInterval(function() {
            if (rt.stopped || rt.audio !== audio) {
                clearCaptionTimer(rt);
                return;
            }
            var duration = Number(audio.duration) || 0;
            if (!duration || !isFinite(duration)) return;
            var target = Math.max(0, Math.min(1, (Number(audio.currentTime) || 0) / duration)) * total;
            var sum = 0, index = 0;
            for (var i = 0; i < weights.length; i++) {
                sum += weights[i];
                index = i;
                if (target <= sum) break;
            }
            rt.currentText = sentences[index] || sentences[sentences.length - 1] || '';
            if (rt.currentCaptionIndex !== index) {
                rt.currentCaptionIndex = index;
                recordContinuousSentence(rt, item, index, rt.currentText);
            }
            if (rt.captionPopup && rt.captionPopup.setText) {
                rt.captionPopup.setText((item.host ? item.host + '：' : '') + rt.currentText);
            }
        }, 180);
    }

    function startHostGap(rt) {
        var delay = 1000 + Math.floor(Math.random() * 1501);
        rt.hostGapDoneIndex = rt.index;
        rt.hostGapUntil = Date.now() + delay;
        rt.hostGapRemainingMs = delay;
        rt.currentItem = { type: 'host-gap' };
        rt.currentHost = '';
        rt.currentText = '主持人切换，稍停 ' + (delay / 1000).toFixed(1) + ' 秒';
        eng.duck(false);
        rt.hostGapTimer = TOP.setInterval(function() {
            if (rt.stopped) {
                TOP.clearInterval(rt.hostGapTimer);
                rt.hostGapTimer = null;
                return;
            }
            if (rt.paused) return;
            rt.hostGapRemainingMs = Math.max(0, rt.hostGapUntil - Date.now());
            if (rt.hostGapRemainingMs <= 0) {
                TOP.clearInterval(rt.hostGapTimer);
                rt.hostGapTimer = null;
                rt.currentItem = null;
                playContinuousNext(rt);
            }
        }, 100);
        prefetchContinuous(rt);
    }

    function playContinuousNext(rt) {
        if (!rt || rt.stopped || rt.paused || v3.continuousRuntime !== rt) return;
        if (rt.index >= rt.items.length) {
            eng.duck(false);
            rt.currentItem = null;
            rt.currentText = '';
            rt.currentHost = '';
            if (v3.continuousSequence && v3.continuousSequence.mode === 'shuffle' && v3.continuousSequence.ids.length) {
                var previousIndex = v3.continuousSequence.index;
                var randomIndex = Math.floor(Math.random() * v3.continuousSequence.ids.length);
                if (v3.continuousSequence.ids.length > 1 && randomIndex === previousIndex) {
                    randomIndex = (randomIndex + 1) % v3.continuousSequence.ids.length;
                }
                v3.continuousSequence.index = randomIndex;
                v3.playContinuous(v3.continuousSequence.ids[randomIndex], { preserveSequence: true });
                return;
            }
            if (v3.continuousSequence && v3.continuousSequence.index < v3.continuousSequence.ids.length - 1) {
                v3.continuousSequence.index++;
                v3.playContinuous(v3.continuousSequence.ids[v3.continuousSequence.index], { preserveSequence: true });
                return;
            }
            if (v3.continuousSequence) {
                if (v3.continuousSequence.mode === 'repeat' && v3.continuousSequence.ids.length) {
                    v3.continuousSequence.index = 0;
                    v3.playContinuous(v3.continuousSequence.ids[0], { preserveSequence: true });
                    return;
                }
                v3.continuousSequence = null;
                rt.finished = true;
                v3.uiRefresh();
                return;
            }
            if (companionAutoRequestEnabled()) {
                if (rt.nextVersionId) {
                    v3.playContinuous(rt.nextVersionId);
                    return;
                }
                if (rt.nextPending) {
                    rt.waitingForNext = true;
                    v3.uiRefresh();
                    return;
                }
                if (!rt.nextRequested && requestNextCompanion(rt)) {
                    rt.waitingForNext = true;
                    v3.uiRefresh();
                    return;
                }
            }
            rt.finished = true;
            if (v3.state.sleep && v3.state.sleep.loopExisting && !v3.state.sleep.expired) {
                rt.index = 0;
                rt.lastSpokenHost = '';
                rt.hostGapDoneIndex = -1;
                rt.items.forEach(function(x) { if (x.type === 'speech') { x.error = ''; } });
                playContinuousNext(rt);
                return;
            }
            v3.uiRefresh();
            return;
        }
        var item = rt.items[rt.index];
        if (item.type === 'pause') {
            eng.duck(false);
            rt.lastSpokenHost = '';
            rt.currentItem = item;
            rt.currentText = '停顿 ' + Math.max(0, _num(item.seconds, 0)) + ' 秒';
            rt.currentHost = '';
            var seconds = Math.max(0, _num(item.seconds, 0));
            rt.pauseUntil = Date.now() + seconds * 1000;
            rt.pauseTimer = TOP.setInterval(function() {
                if (rt.stopped) {
                    TOP.clearInterval(rt.pauseTimer);
                    rt.pauseTimer = null;
                    return;
                }
                rt.pauseRemaining = Math.max(0, Math.ceil((rt.pauseUntil - Date.now()) / 1000));
                v3.uiRefresh();
                if (Date.now() >= rt.pauseUntil) {
                    TOP.clearInterval(rt.pauseTimer);
                    rt.pauseTimer = null;
                    rt.pauseRemaining = 0;
                    rt.index++;
                    playContinuousNext(rt);
                }
            }, 250);
            prefetchContinuous(rt);
            return;
        }
        if (item.skipMapped) {
            rt.index++;
            playContinuousNext(rt);
            return;
        }
        if (rt.lastSpokenHost && item.host && rt.lastSpokenHost !== item.host && rt.hostGapDoneIndex !== rt.index) {
            startHostGap(rt);
            return;
        }
        prefetchContinuous(rt);
        if (!item.url && !item.error) {
            rt.waitingFor = item.id;
            return;
        }
        rt.waitingFor = '';
        if (item.error || !item.url) {
            rt.index++;
            playContinuousNext(rt);
            return;
        }
        try {
            var firstCaption = item.captionSentences && item.captionSentences.length ?
                item.captionSentences[0] : (item.displayText || item.ttsText);
            var cap = item.firstPart ? _popup((item.host ? item.host + '：' : '') + firstCaption) : null;
            rt.currentItem = item;
            rt.currentText = item.displayText || item.ttsText || '';
            rt.currentHost = item.host || '';
            rt.captionPopup = cap;
            eng.duck(true);
            var audio = new TOP.Audio(item.url);
            audio.__vnmContinuous = true;
            rt.audio = audio;
            eng.voice = audio;
            audio.muted = !!(eng.store && eng.store.muted);
            startCaptionTracking(rt, item, audio);
            audio.onended = function() {
                eng.duck(false);
                if (cap) cap.close();
                if (rt.captionPopup === cap) rt.captionPopup = null;
                clearCaptionTimer(rt);
                if (eng.voice === audio) eng.voice = null;
                rt.audio = null;
                if (item.urls && item.mappedIndex + 1 < item.urls.length) {
                    item.mappedIndex++;
                    item.url = item.urls[item.mappedIndex].url;
                    playContinuousNext(rt);
                    return;
                }
                rt.lastSpokenHost = item.host || rt.lastSpokenHost || '';
                if (rt.stopAfterCurrent) {
                    rt.stopped = true;
                    v3.continuousRuntime = null;
                    v3.uiRefresh();
                    return;
                }
                rt.index++;
                playContinuousNext(rt);
            };
            audio.onerror = function() {
                eng.duck(false);
                if (cap) cap.close();
                if (rt.captionPopup === cap) rt.captionPopup = null;
                clearCaptionTimer(rt);
                if (eng.voice === audio) eng.voice = null;
                rt.audio = null;
                rt.index++;
                playContinuousNext(rt);
            };
            audio.play();
        } catch (e) {
            eng.duck(false);
            clearCaptionTimer(rt);
            rt.index++;
            playContinuousNext(rt);
        }
    }

    v3.playContinuous = function(id, options) {
        options = options || {};
        var version = v3.continuousById(id);
        if (!version) return;
        v3.stopContinuous(!!options.preserveSequence);
        v3.state.mode = 'companion';
        try {
            if (eng.voice) {
                eng.voice.onended = null;
                eng.voice.onerror = null;
                eng.voice.pause();
                eng.voice.src = '';
            }
        } catch (e) {}
        v3.state.activeContinuousId = version.id;
        v3.state.activeContinuousIds[version.playlistId || 'now-playing'] = version.id;
        var runtimeList = runtimeItems(version);
        var rt = v3.continuousRuntime = {
            versionId: id,
            version: version,
            items: runtimeList,
            index: 0,
            stopped: false,
            finished: false,
            waitingFor: '',
            paused: false,
            currentItem: null,
            currentText: '',
            currentHost: '',
            lastSpokenHost: '',
            hostGapDoneIndex: -1,
            nextTriggerIndex: nextCompanionTriggerIndex(runtimeList),
            nextRequested: false,
            nextPending: false,
            nextVersionId: '',
            waitingForNext: false,
            nextError: '',
            recordedCaptionKeys: {}
        };
        v3.save();
        prefetchContinuous(rt);
        playContinuousNext(rt);
        v3.uiRefresh();
    };

    v3.playContinuousSequence = function(ids) {
        ids = (ids || []).filter(function(id) { return !!v3.continuousById(id); });
        if (!ids.length) return false;
        v3.continuousSequence = { ids: ids.slice(), index: 0, mode: 'once' };
        v3.playContinuous(ids[0], { preserveSequence: true });
        return true;
    };

    v3.playLocalScriptQueue = function() {
        var ids = (v3.state.localScriptQueue || []).filter(function(id) { return !!v3.continuousById(id); });
        if (!ids.length) return false;
        var mode = v3.state.localScriptPlayMode || 'once';
        var index = mode === 'shuffle' && ids.length > 1 ? Math.floor(Math.random() * ids.length) : 0;
        v3.continuousSequence = { ids: ids.slice(), index: index, mode: mode, local: true };
        v3.playContinuous(ids[index], { preserveSequence: true });
        return true;
    };

    v3.setLocalScriptMode = function(on) {
        v3.state.localScriptMode = !!on;
        v3.save();
        v3.uiRefresh();
    };

    v3.pauseContinuous = function() {
        var rt = v3.continuousRuntime;
        if (!rt || rt.stopped || rt.paused) return false;
        rt.paused = true;
        if (rt.pauseTimer) {
            TOP.clearInterval(rt.pauseTimer);
            rt.pauseTimer = null;
            rt.pauseRemainingMs = Math.max(0, rt.pauseUntil - Date.now());
        }
        if (rt.hostGapTimer) {
            TOP.clearInterval(rt.hostGapTimer);
            rt.hostGapTimer = null;
            rt.hostGapRemainingMs = Math.max(0, rt.hostGapUntil - Date.now());
        }
        try { if (rt.audio) rt.audio.pause(); } catch (e) {}
        eng.duck(false);
        v3.uiRefresh();
        return true;
    };

    v3.resumeContinuous = function() {
        var rt = v3.continuousRuntime;
        if (!rt || rt.stopped || !rt.paused) return false;
        rt.paused = false;
        if (rt.currentItem && rt.currentItem.type === 'host-gap') {
            rt.hostGapUntil = Date.now() + Math.max(0, rt.hostGapRemainingMs || 0);
            rt.hostGapTimer = TOP.setInterval(function() {
                if (rt.stopped || rt.paused) return;
                rt.hostGapRemainingMs = Math.max(0, rt.hostGapUntil - Date.now());
                if (rt.hostGapRemainingMs <= 0) {
                    TOP.clearInterval(rt.hostGapTimer);
                    rt.hostGapTimer = null;
                    rt.currentItem = null;
                    playContinuousNext(rt);
                }
            }, 100);
        } else if (rt.currentItem && rt.currentItem.type === 'pause') {
            rt.pauseUntil = Date.now() + Math.max(0, rt.pauseRemainingMs || rt.pauseRemaining * 1000 || 0);
            rt.pauseTimer = TOP.setInterval(function() {
                if (rt.stopped || rt.paused) return;
                rt.pauseRemaining = Math.max(0, Math.ceil((rt.pauseUntil - Date.now()) / 1000));
                v3.uiRefresh();
                if (Date.now() >= rt.pauseUntil) {
                    TOP.clearInterval(rt.pauseTimer);
                    rt.pauseTimer = null;
                    rt.pauseRemaining = 0;
                    rt.index++;
                    playContinuousNext(rt);
                }
            }, 250);
        } else if (rt.audio) {
            eng.duck(true);
            try { rt.audio.play(); } catch (e) {}
        } else {
            playContinuousNext(rt);
        }
        v3.uiRefresh();
        return true;
    };

    v3.currentContinuousLine = function() {
        var rt = v3.continuousRuntime;
        if (!rt || rt.stopped) return null;
        var playlist = v3.playlist(rt.version && rt.version.playlistId || 'now-playing');
        return {
            versionId: rt.versionId,
            versionTitle: rt.version && rt.version.title || '',
            playlistId: rt.version && rt.version.playlistId || 'now-playing',
            playlistName: playlist && playlist.name || '当前播放列表',
            host: rt.currentHost || '',
            text: rt.currentText || '',
            paused: !!rt.paused,
            finished: !!rt.finished,
            waiting: !!rt.waitingForNext
        };
    };

    v3.stopContinuous = function(preserveSequence) {
        var rt = v3.continuousRuntime;
        if (!preserveSequence) v3.continuousSequence = null;
        if (!rt) return;
        rt.stopped = true;
        try { if (rt.pauseTimer) TOP.clearInterval(rt.pauseTimer); } catch (e) {}
        try { if (rt.hostGapTimer) TOP.clearInterval(rt.hostGapTimer); } catch (e1) {}
        clearCaptionTimer(rt);
        try { if (rt.captionPopup) rt.captionPopup.close(); } catch (eCaption) {}
        rt.captionPopup = null;
        try { if (rt.audio) rt.audio.pause(); } catch (e2) {}
        if (eng.voice === rt.audio) eng.voice = null;
        (rt.items || []).forEach(function(item) {
            if (!item) return;
            if (item.cachedObjectUrl) {
                try { (TOP.URL || URL).revokeObjectURL(item.cachedObjectUrl); } catch (e3) {}
                item.cachedObjectUrl = '';
            }
            (item.urls || []).forEach(function(row) {
                if (row && row.objectUrl) {
                    try { (TOP.URL || URL).revokeObjectURL(row.url); } catch (e4) {}
                }
            });
        });
        eng.duck(false);
        v3.continuousRuntime = null;
        v3.uiRefresh();
    };

    v3.requestCurrentMode = function(manual) {
        var mode = v3.state.mode;
        if (mode === 'playlist') v3.requestLinkedScripts(manual);
        else if (mode === 'companion') v3.requestCompanion(manual);
        else eng.request(eng.store.userNote || '');
    };

    v3.manualRequest = function() {
        v3.manualApiBypass = true;
        try { v3.requestCurrentMode(true); }
        finally { v3.manualApiBypass = false; }
    };

    v3.recommendSongsOnly = function(songs, note, done) {
        if (eng.busy) return;
        eng.busy = true;
        var list = (songs || []).map(function(s, i) {
            return (i + 1) + '. ' + (s.title || '') + (s.artist ? ' - ' + s.artist : '');
        }).join('\n');
        var prompt = _buildCommon((cfg.promptTemplate || '') + '\n\n{{只推荐歌曲要求}}', {
            songList: list,
            userInput: note || '',
            recommendOnly: true,
            taskRequirement: '参考给定歌曲和临时要求，推荐一批真实存在的新歌曲，不写台本。',
            outputRequirement: '只返回 {"songs":[{"title":"真实歌名","artist":"真实歌手"}]}'
        });
        _chat([{ role: 'system', content: prompt }, { role: 'user', content: '参考曲目：\n' + list + '\n\n临时要求：\n' + (note || '无') }], function(text) {
            eng.busy = false;
            var obj = _tryJson(text) || {}, arr = obj.songs || obj.items || [];
            var out = [];
            (arr || []).forEach(function(x) {
                var s = x.song || x;
                if (s && (s.title || s.name)) out.push(cleanSong(s));
            });
            done && done(null, out);
            v3.uiRefresh();
        }, function(e) {
            eng.busy = false;
            done && done(e || '推荐失败');
        });
    };

    v3.startSleep = function(minutes, requestLimit, loopExisting, stopBehavior) {
        v3.cancelSleep(false);
        minutes = Math.max(0.05, parseFloat(minutes) || 30);
        var sleep = v3.state.sleep = {
            active: true,
            startedAt: Date.now(),
            endsAt: Date.now() + minutes * 60000,
            durationMinutes: minutes,
            requestLimit: Math.max(0, _num(requestLimit, 5)),
            remainingRequests: Math.max(0, _num(requestLimit, 5)),
            limitEnabled: true,
            loopExisting: !!loopExisting,
            stopBehavior: stopBehavior || 'current',
            expired: false
        };
        v3.save();
        v3.sleepTimer = TOP.setInterval(function() {
            var s = v3.state.sleep;
            if (!s || !s.active) return;
            s.remainingMs = Math.max(0, s.endsAt - Date.now());
            if (s.remainingMs <= 0 && !s.expired) v3.expireSleep();
            v3.uiRefresh();
        }, 500);
        v3.uiRefresh();
    };

    v3.consumeAutoRequest = function() {
        var s = v3.state.sleep;
        if (!s || !s.active || !s.limitEnabled) return true;
        if (s.expired || s.remainingRequests <= 0) return false;
        s.remainingRequests--;
        v3.save();
        v3.uiRefresh();
        return true;
    };

    v3.expireSleep = function() {
        var s = v3.state.sleep;
        if (!s) return;
        s.expired = true;
        s.remainingMs = 0;
        /* 倒计时只禁止续播；当前歌曲自然播完后，再一次性停止所有声道。 */
        v3.sleepStopPending = true;
        v3.save();
        var check = TOP.setInterval(function() {
            if (!s.active || !s.expired) {
                TOP.clearInterval(check);
                return;
            }
            var musicDone = true;
            try {
                var music = eng.music;
                var hasTrack = !!(music && (music.currentSrc || music.src));
                var duration = music && Number(music.duration) || 0;
                musicDone = !hasTrack || !!music.ended ||
                    (duration > 0 && isFinite(duration) && Number(music.currentTime || 0) >= duration - 0.12);
            } catch (e) {}
            if (!musicDone) return;
            TOP.clearInterval(check);
            try { if (eng.music) eng.music.pause(); } catch (e1) {}
            try {
                if (eng.voice && (!v3.continuousRuntime || eng.voice !== v3.continuousRuntime.audio)) {
                    eng.voice.pause();
                    eng.voice.src = '';
                    eng.voice = null;
                }
            } catch (e2) {}
            v3.stopContinuous();
            v3.stopAllBackgrounds();
            v3.sleepStopPending = false;
            eng.running = false;
            eng.paused = true;
            s.active = false;
            try { if (v3.sleepTimer) TOP.clearInterval(v3.sleepTimer); } catch (e3) {}
            v3.sleepTimer = null;
            v3.save();
            v3.uiRefresh();
        }, 400);
        v3.uiRefresh();
    };

    v3.cancelSleep = function(save) {
        try { if (v3.sleepTimer) TOP.clearInterval(v3.sleepTimer); } catch (e) {}
        v3.sleepTimer = null;
        v3.sleepStopPending = false;
        if (v3.state.sleep) v3.state.sleep.active = false;
        if (save !== false) v3.save();
        v3.uiRefresh();
    };

    v3.sleepLabel = function() {
        var s = v3.state.sleep;
        if (!s || !s.active) return '';
        var ms = Math.max(0, s.endsAt - Date.now()), total = Math.ceil(ms / 1000);
        var h = Math.floor(total / 3600), m = Math.floor((total % 3600) / 60), sec = total % 60;
        function two(n) { return n < 10 ? '0' + n : String(n); }
        return (h ? h + ':' : '') + (h ? two(m) : m) + ':' + two(sec);
    };

    function advancedKey(song) {
        return song && (song.id || songKey(song));
    }
    v3.backgroundKey = advancedKey;

    function backgroundBaseVolume(adv) {
        adv = adv || {};
        if ((adv.volumeMode || 'global') === 'custom') return _clamp(_num(adv.volume, 55) / 100, 0, 1);
        return _clamp(_num(v3.state.backgroundMasterVolume, 100) / 100, 0, 1);
    }

    function backgroundTargetVolume(adv, ducked) {
        adv = adv || {};
        var base = backgroundBaseVolume(adv);
        if (!ducked) return base;
        var mode = adv.duckMode;
        if (!mode) mode = adv.duck === true ? 'custom' : (adv.duck === false ? 'none' : 'follow');
        if (mode === 'none') return base;
        if (mode === 'custom') return _clamp(_num(adv.duckVolume, 20) / 100, 0, 1);
        if (cfg.speechDuck === false) return base;
        return _clamp(_num(cfg.duckVolume, 20) / 100, 0, 1);
    }

    v3.refreshBackgroundVolumes = function() {
        Object.keys(v3.audio).forEach(function(k) {
            var rec = v3.audio[k], adv = rec.song.advanced || {};
            if (rec.audio) rec.audio.volume = backgroundTargetVolume(adv, !!v3.backgroundDucked);
        });
    };

    v3.advancedSongs = function() {
        var out = [], seen = {};
        v3.playlists().forEach(function(pl) {
            (pl.songs || []).forEach(function(song) {
                if (!song.advanced || !song.url) return;
                var k = advancedKey(song);
                if (!seen[k]) { seen[k] = 1; out.push(song); }
            });
        });
        return out;
    };

    v3.playBackground = function(song) {
        song = song || {};
        var k = advancedKey(song);
        if (!k || !song.url) return;
        var existing = v3.audio[k];
        if (existing && existing.audio) {
            try {
                existing.audio.play();
                existing.paused = false;
                existing.masterPaused = false;
                v3.state.backgroundSelection[k] = true;
                v3.save();
                v3.uiRefresh();
                return;
            } catch (resumeError) {}
        }
        v3.stopBackground(k);
        try {
            var a = new TOP.Audio(song.url);
            var adv = song.advanced || {};
            a.loop = adv.loop !== false;
            a.volume = backgroundTargetVolume(adv, !!v3.backgroundDucked);
            a.muted = !!(eng.store && eng.store.muted);
            a.onerror = function() {
                v3.state.backgroundSelection[k] = false;
                adv.error = '播放失败';
                v3.save();
                v3.uiRefresh();
            };
            a.play();
            v3.audio[k] = { audio: a, song: song, paused: false, masterPaused: false };
            v3.state.backgroundSelection[k] = true;
            v3.state.backgroundChecked[k] = true;
            adv.error = '';
            v3.save();
            v3.uiRefresh();
        } catch (e) {
            song.advanced.error = (e && e.message) || '播放失败';
            v3.uiRefresh();
        }
    };

    v3.backgroundIsPlaying = function(key) {
        var rec = v3.audio[key];
        return !!(rec && rec.audio && !rec.audio.paused && !rec.paused);
    };

    v3.pauseBackground = function(key, master, silent) {
        var rec = v3.audio[key];
        if (!rec || !rec.audio) return false;
        try { rec.audio.pause(); } catch (e) {}
        rec.paused = true;
        rec.masterPaused = !!master;
        v3.state.backgroundSelection[key] = false;
        if (!silent) {
            v3.save();
            v3.uiRefresh();
        }
        return true;
    };

    v3.resumeBackground = function(key, master, silent) {
        var rec = v3.audio[key];
        if (!rec || !rec.audio) return false;
        try { rec.audio.play(); } catch (e) { return false; }
        rec.paused = false;
        rec.masterPaused = false;
        v3.state.backgroundSelection[key] = true;
        if (!silent) {
            v3.save();
            v3.uiRefresh();
        }
        return true;
    };

    v3.stopBackground = function(key) {
        var rec = v3.audio[key];
        if (rec && rec.audio) {
            try { rec.audio.pause(); rec.audio.src = ''; } catch (e) {}
        }
        delete v3.audio[key];
        v3.state.backgroundSelection[key] = false;
        v3.save();
        v3.uiRefresh();
    };

    v3.playSelectedBackgrounds = function() {
        v3.advancedSongs().forEach(function(song) {
            if (v3.state.backgroundChecked[advancedKey(song)]) v3.playBackground(song);
        });
    };

    v3.stopAllBackgrounds = function() {
        Object.keys(v3.audio).forEach(function(k) { v3.stopBackground(k); });
    };

    /* 主播放键的图标始终由歌曲状态决定。辅助声道只跟随总暂停/继续，
       各自单独开启或暂停不会反向改变歌曲按钮。 */
    v3.masterPauseSnapshot = v3.masterPauseSnapshot || { continuous: null, backgrounds: {} };
    var playPauseMusicOnly = eng.playPause;
    eng.playPause = function(note) {
        var pausing = !!(eng.running && !eng.paused);
        var rt = v3.continuousRuntime;
        if (pausing) {
            v3.masterPauseSnapshot = { continuous: null, backgrounds: {} };
            if (rt && !rt.stopped && !rt.paused) {
                v3.masterPauseSnapshot.continuous = rt;
            }
            Object.keys(v3.audio).forEach(function(key) {
                if (v3.backgroundIsPlaying(key)) v3.masterPauseSnapshot.backgrounds[key] = true;
            });
            playPauseMusicOnly.apply(eng, arguments);
            if (v3.masterPauseSnapshot.continuous === rt) v3.pauseContinuous();
            Object.keys(v3.masterPauseSnapshot.backgrounds).forEach(function(key) {
                v3.pauseBackground(key, true, true);
            });
            v3.save();
            v3.uiRefresh();
            return;
        }

        var continuousAudio = rt && rt.audio && eng.voice === rt.audio ? rt.audio : null;
        if (continuousAudio) eng.voice = null;
        try {
            playPauseMusicOnly.apply(eng, arguments);
        } finally {
            if (continuousAudio && v3.continuousRuntime === rt && !rt.stopped) eng.voice = continuousAudio;
        }
        var snapshot = v3.masterPauseSnapshot || { continuous: null, backgrounds: {} };
        if (snapshot.continuous && snapshot.continuous === v3.continuousRuntime && snapshot.continuous.paused) {
            v3.resumeContinuous();
        }
        Object.keys(snapshot.backgrounds || {}).forEach(function(key) {
            var rec = v3.audio[key];
            if (rec && rec.masterPaused) v3.resumeBackground(key, true, true);
        });
        v3.masterPauseSnapshot = { continuous: null, backgrounds: {} };
        v3.save();
        v3.uiRefresh();
    };

    v3.toggleContinuousFromHostOrb = function() {
        if (v3.state.mode !== 'companion') return false;
        var rt = v3.continuousRuntime;
        if (!rt || rt.stopped || rt.finished) return false;
        if (rt.paused) {
            v3.resumeContinuous();
            if (v3.masterPauseSnapshot && v3.masterPauseSnapshot.continuous === rt) {
                v3.masterPauseSnapshot.continuous = null;
            }
        } else {
            v3.pauseContinuous();
            if (v3.masterPauseSnapshot) v3.masterPauseSnapshot.continuous = null;
        }
        return true;
    };

    var oldDuck = eng.duck;
    eng.duck = function(on) {
        oldDuck(on);
        v3.backgroundDucked = !!on;
        v3.refreshBackgroundVolumes();
    };

    v3.fadeStopAll = function(ms) {
        ms = Math.max(250, _num(ms, 8000));
        var audios = [];
        if (eng.music) audios.push(eng.music);
        if (eng.voice) audios.push(eng.voice);
        Object.keys(v3.audio).forEach(function(k) { if (v3.audio[k].audio) audios.push(v3.audio[k].audio); });
        var starts = audios.map(function(a) { return Number(a.volume) || 0; }), start = Date.now();
        var timer = TOP.setInterval(function() {
            var p = Math.min(1, (Date.now() - start) / ms);
            audios.forEach(function(a, i) { try { a.volume = starts[i] * (1 - p); } catch (e) {} });
            if (p >= 1) {
                TOP.clearInterval(timer);
                audios.forEach(function(a) { try { a.pause(); } catch (e) {} });
                v3.stopAllBackgrounds();
                v3.stopContinuous();
            }
        }, 80);
    };

    function downloadBlob(blob, name) {
        var url = (TOP.URL || URL).createObjectURL(blob);
        var a = TOPDOC.createElement('a');
        a.href = url;
        a.download = name;
        a.style.display = 'none';
        (TOPDOC.body || TOPDOC.documentElement).appendChild(a);
        a.click();
        TOP.setTimeout(function() {
            try { a.remove(); (TOP.URL || URL).revokeObjectURL(url); } catch (e) {}
        }, 3000);
    }

    v3.cacheContinuous = function(versionId, progress, done) {
        var version = v3.continuousById(versionId);
        if (!version) {
            done && done('没有台本');
            return;
        }
        var allItems = runtimeItems(version);
        var speechItems = allItems.filter(function(item) { return item.type === 'speech'; });
        if (!speechItems.length) {
            done && done('台本中没有可生成的朗读段');
            return;
        }
        version.audioCacheEnabled = true;
        TOP.Promise.resolve().then(function() {
            var index = 0;
            function next() {
                if (index >= speechItems.length) {
                    var validKeys = speechItems.map(function(item) { return item.cacheKey; });
                    (version.audioCacheKeys || []).forEach(function(key) {
                        if (validKeys.indexOf(key) < 0) cacheRecordDelete('audio', key).catch(function() {});
                    });
                    version.audioCacheKeys = validKeys;
                    version.audioCacheComplete = true;
                    version.audioCacheCount = speechItems.length;
                    version.audioCachedAt = Date.now();
                    version.audioCacheLayout = 'host-turn-v1';
                    delete version.audioDirectoryFolder;
                    delete version.audioFiles;
                    v3.save();
                    v3.uiRefresh();
                    done && done(null, { count: speechItems.length });
                    return;
                }
                var item = speechItems[index];
                progress && progress(index + 1, speechItems.length, item);
                function persist(blob) {
                    return putCachedAudioBlob(version, item, blob);
                }
                getCachedAudioBlob(version, item).then(function(blob) {
                    if (blob) return persist(blob);
                    return new TOP.Promise(function(resolve, reject) {
                        _tts(item.ttsText, hostForName(item.host), function(url) {
                            blobFromUrl(url).then(resolve).catch(reject);
                        }, reject);
                    }).then(persist);
                }).then(function() {
                    index++;
                    v3.save();
                    next();
                }).catch(function(e) {
                    done && done((e && e.message) || String(e));
                });
            }
            next();
        }).catch(function(e) {
            done && done((e && e.message) || String(e));
        });
    };

    v3.clearContinuousCache = function(versionId, done) {
        var version = v3.continuousById(versionId);
        if (!version) {
            done && done('没有台本');
            return;
        }
        var keys = (version.audioCacheKeys || []).slice();
        var index = 0;
        function next() {
            if (index >= keys.length) {
                version.audioCacheKeys = [];
                version.audioCacheComplete = false;
                version.audioCacheCount = 0;
                version.audioCachedAt = 0;
                version.audioCacheEnabled = false;
                v3.save();
                v3.uiRefresh();
                done && done(null);
                return;
            }
            cacheRecordDelete('audio', keys[index++]).then(next).catch(next);
        }
        next();
    };

    v3.exportContinuous = function(versionId, progress, done) {
        var version = null;
        (v3.state.continuousVersions || []).forEach(function(v) { if (v.id === versionId) version = v; });
        if (!version) { done && done('没有台本'); return; }
        var items = runtimeItems(version).filter(function(x) { return x.type === 'speech'; });
        var chunks = [], index = 0;
        function next() {
            if (index >= items.length) {
                var blob = new TOP.Blob(chunks, { type: 'audio/mpeg' });
                downloadBlob(blob, (version.title || '连续台本') + '.mp3');
                downloadBlob(new TOP.Blob([JSON.stringify(version, null, 2)], { type: 'application/json' }), (version.title || '连续台本') + '.json');
                done && done(null);
                return;
            }
            var item = items[index++];
            progress && progress(index, items.length);
            _tts(item.ttsText, hostForName(item.host), function(url) {
                TOP.fetch(url).then(function(r) { return r.arrayBuffer(); }).then(function(buf) {
                    chunks.push(buf);
                    next();
                }).catch(function(e) { done && done(e.message || String(e)); });
            }, function(e) { done && done(e || 'TTS失败'); });
        }
        next();
    };

    v3.exportData = function() {
        var payload = {
            version: 3,
            exportedAt: new Date().toISOString(),
            radio: clone(v3.state)
        };
        downloadBlob(new TOP.Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }), 'vnm-radio-backup.json');
    };

    v3.importData = function(text) {
        var obj = typeof text === 'string' ? JSON.parse(text) : text;
        if (!obj || !obj.radio || !obj.version) throw new Error('不是有效的电台备份');
        eng.store.v3Radio = clone(obj.radio);
        v3.state = ensureState();
        v3.save();
        v3.uiRefresh();
    };

    var oldSpeakItem = _speakItem;
    _speakItem = function(item, force, after) {
        if (v3.songScriptsSuppressed()) {
            if (item) item.spoken = false;
            eng.duck(false);
            if (after) after(false);
            return;
        }
        return oldSpeakItem(item, force, after);
    };

    var oldRequestScripts = eng.requestScripts;
    eng.requestScripts = function() {
        if (v3.songScriptsSuppressed()) {
            _toast('陪伴模式正在使用长台本，不请求歌曲台本');
            return;
        }
        return oldRequestScripts.apply(eng, arguments);
    };

    var oldNextForContinuous = eng.next;
    eng.next = function() {
        var rt = v3.continuousRuntime;
        var continuousVoice = rt && rt.audio && eng.voice === rt.audio ? rt.audio : null;
        if (continuousVoice) eng.voice = null;
        try {
            return oldNextForContinuous.apply(eng, arguments);
        } finally {
            if (continuousVoice && v3.continuousRuntime === rt && !rt.stopped) eng.voice = continuousVoice;
        }
    };

    _trimScripts = function(favoriteSong) {
        if (!favoriteSong) return;
        favoriteSong.scriptVersions = trimScriptVersions(favoriteSong.scriptVersions, _num(cfg.scriptHistoryMax, 3));
    };

    var oldRemoveScriptVersion = eng.removeScriptVersion;
    eng.removeScriptVersion = function(song, versionId) {
        var versions = (_favByKey(_songKey(song)) || {}).scriptVersions || [];
        for (var i = 0; i < versions.length; i++) {
            if (versions[i] && versions[i].id === versionId && versions[i].favorite) {
                _toast('已收藏的台本版本受保护，请先取消收藏');
                return;
            }
        }
        return oldRemoveScriptVersion.apply(eng, arguments);
    };

    var oldSaveQueue = eng.saveQueue;
    eng.saveQueue = function() {
        oldSaveQueue();
        try { v3.syncNow(); } catch (e) {}
    };
})();
