/* vnm-radio v3 core augmentation.
 * This file is inserted into vnm-radio.json by app/scripts/build-radio-v3.js.
 * It deliberately uses ES5 syntax because the radio runs inside SillyTavern webviews.
 */
(function vnr3InstallCore() {
    if (eng.v3 && eng.v3.version >= 3.5) return;

    var v3 = eng.v3 = {
        version: 3.5,
        audio: {},
        continuousRuntime: null,
        sleepTimer: null,
        uiRefresh: function() {
            try {
                eng.emit();
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
            selectedScriptId: String(song.selectedScriptId || '')
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
                name: '我的收藏',
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
        favorites.name = '我的收藏';
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
            if (version && !version.playlistId) version.playlistId = 'now-playing';
        });
        if (st.activeContinuousId && !st.activeContinuousIds['now-playing']) {
            st.activeContinuousIds['now-playing'] = st.activeContinuousId;
        }
        st.favoriteContinuousIds = Object.prototype.toString.call(st.favoriteContinuousIds) === '[object Array]' ? st.favoriteContinuousIds : [];
        st.backgroundSelection = st.backgroundSelection || {};
        st.backgroundChecked = st.backgroundChecked || {};
        st.pendingImport = null;
        st.sleep = st.sleep || null;
        st.schema = 3;
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
        if (song.selectedScriptId) {
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
        v3.state.mode = mode;
        v3.save();
        v3.uiRefresh();
    };

    v3.modeLabel = function(mode) {
        mode = mode || v3.state.mode;
        return mode === 'playlist' ? '歌单模式' : (mode === 'companion' ? '陪伴模式' : '推荐模式');
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
        '【电台聊天总结】',
        '{{聊天总结}}',
        '',
        '【最近主播对话】',
        '{{最近主播对话}}',
        '',
        '【用户本次要求】',
        '{{用户输入}}',
        '',
        '【本次任务】',
        '创作约 {{目标字数}} 字的连续长篇陪伴台本。主持人要自然地陪伴 {{用户名称}}，可以聊天、讲述、回应用户、分享想法或围绕当前语境展开话题，内容应连贯、耐听，避免机械报幕、空洞寒暄和反复重复相同意思。',
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
        FIELDS.forEach(function(f) { existing[f.key] = 1; });
        var list = [
            { group: '请求模式', key: 'v3ShortPersonaEnabled', type: 'toggle', label: '使用 Artist 中设置的电台简短人设', default: false },
            { group: '请求模式', key: 'v3CompanionWords', type: 'number', label: '陪伴模式目标字数', default: 3000, min: 300, max: 20000, step: 100 },
            { group: '请求模式', key: 'v3PauseMinCount', type: 'number', label: '连续台本最少停顿节点', default: 3, min: 0, max: 100 },
            { group: '请求模式', key: 'v3PauseMaxCount', type: 'number', label: '连续台本最多停顿节点', default: 8, min: 0, max: 100 },
            { group: '请求模式', key: 'v3PauseMinSeconds', type: 'number', label: '单次停顿最少秒数', default: 5, min: 0, max: 3600 },
            { group: '请求模式', key: 'v3PauseMaxSeconds', type: 'number', label: '单次停顿最多秒数', default: 30, min: 0, max: 3600 },
            { group: '请求模式', key: 'v3TtsSplitMode', type: 'select', label: '陪伴长台本 TTS 分块方式', default: 'pause', options: [{ v: 'pause', l: '按停顿标记分块' }, { v: 'chars', l: '按最大字数（完整句末切分）' }] },
            { group: '请求模式', key: 'v3TtsChunkChars', type: 'number', label: '按字数分块：单块软上限（仅陪伴模式）', default: 220, min: 60, max: 1000 },
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
        _saveCfg();
    }
    addFields();

    var oldBuildCommon = _buildCommon;
    _buildCommon = function(tpl, extra) {
        extra = extra || {};
        var out = oldBuildCommon(tpl, extra);
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
                if (it.librarySongId) {
                    var lists = v3.playlists();
                    lists.forEach(function(lp) {
                        (lp.songs || []).forEach(function(song) {
                            if (song.id !== it.librarySongId) return;
                            song.scriptVersions = song.scriptVersions || [];
                            song.scriptVersions.unshift({ id: uid('script'), t: Date.now(), host: it.host, say: it.say, favorite: false });
                            var fav = song.scriptVersions.filter(function(x) { return x.favorite; });
                            var normal = song.scriptVersions.filter(function(x) { return !x.favorite; }).slice(0, 5);
                            song.scriptVersions = fav.concat(normal);
                            song.selectedScriptId = song.scriptVersions[0] && song.scriptVersions[0].id || '';
                        });
                    });
                }
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

    function parseCompanion(text) {
        var obj = _tryJson(text) || {};
        var raw = obj.nodes || obj.segments || obj.items || [];
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

        raw.forEach(function(n) {
            if (!n) return;
            if (typeof n === 'string') {
                var marker = /^\s*\[pause\s*=\s*(\d+(?:\.\d+)?)\s*s\]\s*$/i.exec(n);
                if (marker) pushPause(marker[1]);
                else pushMarkedSpeech(fallback, n, n);
                return;
            }
            if (n.type === 'pause' || n.pauseSeconds !== undefined || n.seconds !== undefined && !n.ttsText && !n.text) {
                pushPause(n.seconds !== undefined ? n.seconds : n.pauseSeconds);
                return;
            }
            var host = String(n.host || fallback).trim();
            var tts = String(n.ttsText || n.tts || n.speech || n.text || '').trim();
            var display = String(n.displayText || n.display || n.translation || tts).trim();
            if (!tts && !display) return;
            pushMarkedSpeech(host, tts || display, display || tts);
        });
        return out;
    }

    v3.requestCompanion = function(manual) {
        if (eng.busy) return;
        if (!manual && !v3.consumeAutoRequest()) return;
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
        _setApiStatus('loading', 'v3-companion', '请求连续台本', '', '');
        _chat([{ role: 'system', content: prompt }, { role: 'user', content: '请生成连续陪伴台本。' }], function(text) {
            eng.busy = false;
            var nodes = parseCompanion(text);
            if (!nodes.length) {
                _setApiStatus('error', 'v3-companion', '请求连续台本', '返回中没有可播放节点', '');
                _toast('连续台本格式无法解析');
                return;
            }
            var version = {
                id: uid('continuous'),
                playlistId: (v3.currentPlaylist() || {}).id || 'now-playing',
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
            v3.state.activeContinuousIds[version.playlistId] = version.id;
            v3.state.activeContinuousId = version.id;
            v3.save();
            _clearApiStatus('v3-companion');
            _toast('连续台本已生成');
            v3.playContinuous(version.id);
            v3.uiRefresh();
        }, function(e) {
            eng.busy = false;
            _setApiStatus('error', 'v3-companion', '请求连续台本', e, '');
            _toast('连续台本请求失败: ' + e);
        });
    };

    v3.activeContinuous = function(playlistId) {
        playlistId = playlistId || (v3.currentPlaylist() || {}).id || 'now-playing';
        var arr = v3.state.continuousVersions || [];
        var activeId = v3.state.activeContinuousIds[playlistId] || '';
        for (var i = 0; i < arr.length; i++) if (arr[i].playlistId === playlistId && arr[i].id === activeId) return arr[i];
        for (var j = 0; j < arr.length; j++) if ((arr[j].playlistId || 'now-playing') === playlistId) return arr[j];
        return null;
    };

    function hostForName(name) {
        return _charByName(name || '', _selectedHosts(eng.store || {})) || _selectedHosts(eng.store || {})[0] || null;
    }

    function splitTtsText(text, max) {
        text = String(text || '').trim();
        max = Math.max(60, _num(max, 220));
        if (text.length <= max) return [text];
        var out = [], start = 0, len = text.length;
        var endChars = '。！？!?；;.…\n';
        var closingChars = '"\'”’」』】）》';
        function isEnd(ch) { return endChars.indexOf(ch) >= 0; }
        while (start < len) {
            var target = Math.min(start + max, len);
            if (target >= len) {
                out.push(text.slice(start).trim());
                break;
            }
            var cut = -1, i;
            for (i = target - 1; i >= start; i--) {
                if (isEnd(text.charAt(i))) { cut = i + 1; break; }
            }
            if (cut <= start) {
                for (i = target; i < len; i++) {
                    if (isEnd(text.charAt(i))) { cut = i + 1; break; }
                }
            }
            if (cut <= start) cut = len;
            while (cut < len && closingChars.indexOf(text.charAt(cut)) >= 0) cut++;
            var chunk = text.slice(start, cut).trim();
            if (chunk) out.push(chunk);
            start = cut;
            while (start < len && /\s/.test(text.charAt(start))) start++;
        }
        return out;
    }

    function runtimeItems(version) {
        var out = [];
        var splitMode = cfg.v3TtsSplitMode === 'chars' ? 'chars' : 'pause';
        var source = version.nodes || [];

        function appendSpeech(n) {
            var parts = splitMode === 'chars' ? splitTtsText(n.ttsText, cfg.v3TtsChunkChars) : [String(n.ttsText || '').trim()];
            parts.forEach(function(part, index) {
                if (!part) return;
                out.push({
                    id: n.id + '-' + index,
                    nodeId: n.id,
                    type: 'speech',
                    host: n.host,
                    ttsText: part,
                    displayText: n.displayText,
                    firstPart: index === 0,
                    url: '',
                    requesting: false,
                    error: ''
                });
            });
        }

        if (splitMode === 'chars') {
            source.forEach(function(n) {
                if (n.type === 'pause') out.push({ id: n.id, type: 'pause', seconds: n.seconds });
                else appendSpeech(n);
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
            if (!pending || pending.host !== n.host) {
                flushPending();
                pending = {
                    id: n.id,
                    type: 'speech',
                    host: n.host,
                    ttsText: String(n.ttsText || '').trim(),
                    displayText: String(n.displayText || '').trim()
                };
                return;
            }
            pending.ttsText += (pending.ttsText ? '\n' : '') + String(n.ttsText || '').trim();
            pending.displayText += (pending.displayText ? '\n' : '') + String(n.displayText || '').trim();
        });
        flushPending();
        return out;
    }

    function prefetchContinuous(rt) {
        if (!rt || rt.stopped) return;
        var wanted = Math.max(1, _num(cfg.v3TtsPrefetch, 2)), active = 0;
        for (var i = rt.index; i < rt.items.length && active < wanted; i++) {
            var item = rt.items[i];
            if (item.type === 'pause') break;
            if (item.type !== 'speech' || item.url || item.requesting || item.error) continue;
            item.requesting = true;
            active++;
            (function(job) {
                _tts(job.ttsText, hostForName(job.host), function(url) {
                    job.requesting = false;
                    job.url = url;
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
            })(item);
        }
    }

    function playContinuousNext(rt) {
        if (!rt || rt.stopped || v3.continuousRuntime !== rt) return;
        if (rt.index >= rt.items.length) {
            eng.duck(false);
            rt.finished = true;
            if (v3.state.sleep && v3.state.sleep.loopExisting && !v3.state.sleep.expired) {
                rt.index = 0;
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
            var cap = item.firstPart ? _popup((item.host ? item.host + '：' : '') + (item.displayText || item.ttsText)) : null;
            eng.duck(true);
            var audio = new TOP.Audio(item.url);
            rt.audio = audio;
            eng.voice = audio;
            audio.muted = !!(eng.store && eng.store.muted);
            audio.onended = function() {
                eng.duck(false);
                if (cap) cap.close();
                rt.audio = null;
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
                rt.audio = null;
                rt.index++;
                playContinuousNext(rt);
            };
            audio.play();
        } catch (e) {
            eng.duck(false);
            rt.index++;
            playContinuousNext(rt);
        }
    }

    v3.playContinuous = function(id) {
        var version = null;
        (v3.state.continuousVersions || []).forEach(function(v) { if (v.id === id) version = v; });
        if (!version) return;
        v3.stopContinuous();
        v3.state.activeContinuousId = version.id;
        v3.state.activeContinuousIds[version.playlistId || 'now-playing'] = version.id;
        var rt = v3.continuousRuntime = {
            versionId: id,
            items: runtimeItems(version),
            index: 0,
            stopped: false,
            finished: false,
            waitingFor: ''
        };
        v3.save();
        prefetchContinuous(rt);
        playContinuousNext(rt);
        v3.uiRefresh();
    };

    v3.stopContinuous = function() {
        var rt = v3.continuousRuntime;
        if (!rt) return;
        rt.stopped = true;
        try { if (rt.pauseTimer) TOP.clearInterval(rt.pauseTimer); } catch (e) {}
        try { if (rt.audio) rt.audio.pause(); } catch (e2) {}
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
        eng.running = false;
        v3.save();
        var rt = v3.continuousRuntime;
        if (rt) {
            rt.stopAfterCurrent = true;
            if (!rt.audio) v3.stopContinuous();
        }
        var check = TOP.setInterval(function() {
            var musicDone = !eng.music || eng.music.paused || eng.music.ended;
            var voiceDone = !eng.voice || eng.voice.paused || eng.voice.ended;
            if (!musicDone || !voiceDone) return;
            TOP.clearInterval(check);
            v3.fadeStopAll(8000);
            if (s) { s.active = false; v3.save(); }
        }, 400);
        v3.uiRefresh();
    };

    v3.cancelSleep = function(save) {
        try { if (v3.sleepTimer) TOP.clearInterval(v3.sleepTimer); } catch (e) {}
        v3.sleepTimer = null;
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
            v3.audio[k] = { audio: a, song: song };
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

    var oldSaveQueue = eng.saveQueue;
    eng.saveQueue = function() {
        oldSaveQueue();
        try { v3.syncNow(); } catch (e) {}
    };
})();
