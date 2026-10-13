// ==UserScript==
// @name         YouTube Stop Autoplay + HQ Thumbnail
// @namespace    https://github.com/aykq/userscripts
// @version      1.19
// @description  Stops YouTube videos from autoplaying and shows a high quality thumbnail until you click. Adds scroll controls for volume (up to 300%), speed (0.25x-8x) and seeking, remembers your video quality, and jumps to chapter starts with a middle click on the progress bar.
// @author       aykq
// @license      MIT
// @homepageURL  https://github.com/aykq/userscripts
// @supportURL   https://github.com/aykq/userscripts/issues
// @downloadURL  https://raw.githubusercontent.com/aykq/userscripts/main/scripts/yt-watch-stop-autoplay.user.js
// @updateURL    https://raw.githubusercontent.com/aykq/userscripts/main/scripts/yt-watch-stop-autoplay.user.js
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    let playAllowed = false;
    let currentVideoId = null;
    let overlayEl = null;

    function isMainVideo(el) {
        return el instanceof HTMLMediaElement &&
            (el.closest('#movie_player') || el.closest('#shorts-player') || el.closest('#c4-player'));
    }

    function isLiveVideo(video) {
        const player = video.closest('#movie_player, #shorts-player, #c4-player');
        return !!(player && typeof player.getVideoData === 'function' && player.getVideoData().isLive);
    }

    const opaqueStyle = document.createElement('style');
    opaqueStyle.id = 'yt-stop-autoplay-opaque';
    opaqueStyle.textContent = `
        /* Opaque overlays and no backdrop blur, off by default. To turn it on, delete this line and the lone closing line below the last rule of this group.
        html { --yt-sys-color-baseline--overlay-background-medium-light: rgb(0,0,0) !important; --yt-sys-color-baseline--overlay-background-medium: rgb(0,0,0) !important; }
        html, [light] { --yt-frosted-glass-desktop: rgba(255,255,255,1) !important; }
        html[dark], [dark] { --yt-frosted-glass-desktop: rgba(15,15,15,1) !important; }
        * { backdrop-filter: none !important; -webkit-backdrop-filter: none !important; }
        html[dark] #frosted-glass { background-color: rgb(15,15,15) !important; }
        html:not([dark]) #frosted-glass { background-color: rgb(255,255,255) !important; }
        .ytPlayerQuickActionButtonsHost,
        .ytp-suggested-action-badge,
        .ytp-featured-product.ytp-suggested-action-badge,
        .ytTooltipContainerPlayerTooltipContentBlurred,
        .ytPlayerOverlayVideoDetailsRendererFrostedGlass { background-color: rgb(0,0,0) !important; }
        .ytChannelAttributionViewModelHost { background-color: rgb(40,40,40) !important; }
        */
        html, [light], html[dark], [dark] { --yt-spec-red-indicator: #FF0000 !important; }
        .ytp-play-progress,
        .ytChapteredProgressBarChapteredPlayerBarChapterSeen,
        .ytChapteredProgressBarChapteredPlayerBarFill,
        .ytFocusedChapterProgressBarLineProgressBarPlayed,
        .ytProgressBarLineProgressBarPlayed,
        .ytThumbnailOverlayProgressBarHostWatchedProgressBarSegment,
        .ytwThumbnailOverlayResumePlaybackRendererThumbnailOverlayResumePlaybackProgress,
        #progress.yt-page-navigation-progress,
        ytd-thumbnail-overlay-resume-playback-renderer #progress.ytd-thumbnail-overlay-resume-playback-renderer { background: #FF0000 !important; }
        .ytp-scrubber-button,
        .ytProgressBarPlayheadProgressBarPlayheadDot { background-color: #FF0000 !important; }
    `;
    (document.head || document.documentElement).appendChild(opaqueStyle);

    const nativePlay = HTMLMediaElement.prototype.play;

    HTMLMediaElement.prototype.play = function (...args) {
        if (isMainVideo(this) && !playAllowed) {
            return Promise.reject(new DOMException('play() blocked', 'NotAllowedError'));
        }
        return nativePlay.apply(this, args);
    };

    document.addEventListener('play', (event) => {
        const target = event.target;
        if (isMainVideo(target) && !playAllowed) {
            target.pause();
            if (!isLiveVideo(target)) target.currentTime = 0;
        }
    }, true);

    function findActivePlayer() {
        for (const id of ['movie_player', 'shorts-player', 'c4-player']) {
            const player = document.getElementById(id);
            if (!player || typeof player.getVideoData !== 'function') continue;
            const videoId = player.getVideoData().video_id;
            if (!videoId) continue;
            const video = player.querySelector('video.html5-main-video');
            if (video) return { player, video, videoId };
        }
        return null;
    }

    function removeOverlay() {
        if (overlayEl) {
            overlayEl.remove();
            overlayEl = null;
        }
    }

    function buildThumbnailUrl(videoId, quality) {
        return `https://i.ytimg.com/vi/${videoId}/${quality}.jpg`;
    }

    function showOverlay(player, videoId) {
        removeOverlay();

        const overlay = document.createElement('div');
        overlay.id = 'ytp-custom-thumbnail-overlay';
        Object.assign(overlay.style, {
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            zIndex: '9999',
            cursor: 'pointer',
            backgroundColor: '#000',
        });

        const img = document.createElement('img');
        Object.assign(img.style, {
            width: '100%',
            height: '100%',
            objectFit: 'contain',
        });
        img.src = buildThumbnailUrl(videoId, 'maxresdefault');
        img.addEventListener('error', function onError() {
            img.removeEventListener('error', onError);
            img.src = buildThumbnailUrl(videoId, 'hqdefault');
        }, { once: true });
        img.addEventListener('load', function onLoad() {
            img.removeEventListener('load', onLoad);
            if (img.naturalWidth === 120 && img.naturalHeight === 90) {
                img.src = buildThumbnailUrl(videoId, 'hqdefault');
            }
        }, { once: true });

        overlay.appendChild(img);
        overlayEl = overlay;

        overlay.addEventListener('click', () => {
            playAllowed = true;
            removeOverlay();

            const video = player.querySelector('video.html5-main-video');
            if (video) tryEnsureAudioGraph(video);

            if (typeof player.playVideo === 'function') {
                player.playVideo();
            } else if (video) {
                video.play();
            }
            if (video && isLiveVideo(video) && typeof player.seekToLiveHead === 'function') {
                player.seekToLiveHead();
            }
        }, { once: true });

        if (!player.style.position) {
            player.style.position = 'relative';
        }
        player.appendChild(overlay);
    }

    const PRELOAD_THUMBNAILS = true;
    const PRELOAD_IDLE_MS = 200;
    const PRELOAD_GAP_MS = 50;
    const PRELOAD_MAX_HELD = 24;

    function setupThumbnailPreload() {
        const CARD_LINKS = 'ytd-thumbnail a[href], a.ytLockupViewModelContentImage';
        const warmed = new Set();
        const held = [];
        let lastScroll = performance.now();
        let scanTimer = 0;
        let pending = [];
        let pumping = false;

        const inViewport = (el) => {
            const r = el.getBoundingClientRect();
            return r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth;
        };

        const loadThumb = (videoId, quality) => new Promise((resolve) => {
            const im = new Image();
            im.onload = () => resolve(im);
            im.onerror = () => resolve(null);
            im.src = buildThumbnailUrl(videoId, quality);
            held.push(im);
            if (held.length > PRELOAD_MAX_HELD) held.shift();
            setTimeout(() => resolve(null), 8000);
        });

        const warm = async (videoId) => {
            const im = await loadThumb(videoId, 'maxresdefault');
            if (!im || (im.naturalWidth === 120 && im.naturalHeight === 90)) {
                await loadThumb(videoId, 'hqdefault');
            }
        };

        const pump = async () => {
            if (pumping) return;
            pumping = true;
            while (pending.length && !document.hidden && performance.now() - lastScroll > PRELOAD_IDLE_MS) {
                const videoId = pending.shift();
                warmed.add(videoId);
                await warm(videoId);
                await new Promise((r) => setTimeout(r, PRELOAD_GAP_MS));
            }
            pumping = false;
        };

        const scan = () => {
            const ids = new Set();
            for (const a of document.querySelectorAll(CARD_LINKS)) {
                if (a.hostname !== location.hostname) continue;
                const id = a.pathname === '/watch'
                    ? new URLSearchParams(a.search).get('v')
                    : /^\/shorts\/([\w-]{11})/.exec(a.pathname)?.[1];
                if (id && !warmed.has(id) && inViewport(a)) ids.add(id);
            }
            pending = [...ids];
            pump();
        };

        window.addEventListener('scroll', () => {
            lastScroll = performance.now();
            clearTimeout(scanTimer);
            scanTimer = setTimeout(scan, PRELOAD_IDLE_MS);
        }, { capture: true, passive: true });
        document.addEventListener('yt-navigate-finish', () => setTimeout(scan, 1500));
        setTimeout(scan, 2000);
    }

    if (PRELOAD_THUMBNAILS) setupThumbnailPreload();

    const MAX_VOLUME_PERCENT = 300;
    const VOLUME_STEP_PERCENT = 5;
    let audioCtx = null;
    let gainNode = null;
    let boostSource = null;
    let boostSourceVideo = null;
    let currentVolumePercent = 100;

    function ensureAudioGraph(video) {
        if (boostSourceVideo === video && gainNode) return;

        if (boostSource) {
            try { boostSource.disconnect(); } catch (e) {}
        }

        audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
        if (!audioCtx.__ytStopAutoplayResumeWatched) {
            audioCtx.__ytStopAutoplayResumeWatched = true;
            audioCtx.addEventListener('statechange', () => {
                if (audioCtx.state === 'suspended') audioCtx.resume().catch(() => {});
            });
        }
        boostSource = audioCtx.createMediaElementSource(video);
        gainNode = audioCtx.createGain();
        gainNode.gain.value = 1;
        boostSource.connect(gainNode).connect(audioCtx.destination);
        boostSourceVideo = video;
    }

    function tryEnsureAudioGraph(video) {
        try {
            ensureAudioGraph(video);
        } catch (e) {}
    }

    function syncVolumeFromPlayer(player) {
        const nativeNow = player.getVolume();
        if (typeof nativeNow !== 'number' || Number.isNaN(nativeNow)) return;

        const boostNow = gainNode ? gainNode.gain.value : 1;
        const live = (boostNow > 1 && nativeNow >= 100) ? 100 * boostNow : nativeNow;

        if (Math.abs(live - currentVolumePercent) > 1) {
            currentVolumePercent = live;
        }
    }

    function stepVolume(current, direction) {
        const s = VOLUME_STEP_PERCENT;
        const next = direction > 0
            ? Math.floor(current / s) * s + s
            : Math.ceil(current / s) * s - s;
        return Math.min(MAX_VOLUME_PERCENT, Math.max(0, next));
    }

    function applyVolumePercent(player, video, percent) {
        const nativeVolume = Math.min(100, percent);
        if (player.getVolume() !== nativeVolume) {
            player.setVolume(nativeVolume);
        }

        if (percent > 100) {
            tryEnsureAudioGraph(video);
        }
        if (!gainNode) return;

        if (audioCtx.state === 'suspended') {
            audioCtx.resume().catch(() => {});
        }
        gainNode.gain.value = percent > 100 ? percent / 100 : 1;
    }

    function stopCurrentVideo(video) {
        try {
            video.pause();
            if (!isLiveVideo(video)) video.currentTime = 0;
        } catch (e) {}
    }

    const QUALITY_STORAGE_KEY = 'ytStopAutoplay_forcedQuality';
    const QUALITY_ORDER = ['tiny', 'small', 'medium', 'large', 'hd720', 'hd1080', 'hd1440', 'hd2160', 'highres'];
    const QUALITY_BY_HEIGHT = {
        144: 'tiny', 240: 'small', 360: 'medium', 480: 'large', 720: 'hd720',
        1080: 'hd1080', 1440: 'hd1440', 2160: 'hd2160', 4320: 'highres',
    };

    function getStoredQuality() {
        try {
            return localStorage.getItem(QUALITY_STORAGE_KEY);
        } catch (e) {
            return null;
        }
    }

    function setStoredQuality(quality) {
        try {
            localStorage.setItem(QUALITY_STORAGE_KEY, quality);
        } catch (e) {}
    }

    function clearStoredQuality() {
        try {
            localStorage.removeItem(QUALITY_STORAGE_KEY);
        } catch (e) {}
    }

    function pickQuality(stored, available) {
        const real = available.filter((q) => QUALITY_ORDER.includes(q));
        if (!real.length || real.includes(stored)) return stored;
        const limit = QUALITY_ORDER.indexOf(stored);
        const fitting = real.filter((q) => QUALITY_ORDER.indexOf(q) <= limit);
        if (!fitting.length) return null;
        return fitting.reduce((a, b) => (QUALITY_ORDER.indexOf(a) > QUALITY_ORDER.indexOf(b) ? a : b));
    }

    function forceStoredQuality(player) {
        const stored = getStoredQuality();
        if (!QUALITY_ORDER.includes(stored) || typeof player.setPlaybackQualityRange !== 'function') return;

        const available = typeof player.getAvailableQualityLevels === 'function'
            ? player.getAvailableQualityLevels() : [];
        const target = pickQuality(stored, available);
        if (!target) return;

        player.setPlaybackQualityRange(target, target);
    }

    document.addEventListener('click', (event) => {
        const item = event.target instanceof Element && event.target.closest('.ytp-quality-menu .ytp-menuitem');
        if (!item) return;
        const height = /^\s*(\d{3,4})p/.exec(item.textContent || '')?.[1];
        const quality = height && QUALITY_BY_HEIGHT[height];
        if (quality) {
            setStoredQuality(quality);
        } else {
            clearStoredQuality();
        }
    }, true);

    const ZONE_HANDLERS = {
        '0-0': adjustPlaybackSpeed,
        '1-0': adjustPlaybackSpeed,
        '0-1': seekVideo,
        '1-1': seekVideo,
        '0-2': adjustVolume,
        '1-2': adjustVolume,
    };

    function getZoneKey(event, player) {
        const rect = player.getBoundingClientRect();
        const relX = (event.clientX - rect.left) / rect.width;
        const relY = (event.clientY - rect.top) / rect.height;
        const col = Math.min(2, Math.max(0, Math.floor(relX * 3)));
        const row = Math.min(2, Math.max(0, Math.floor(relY * 3)));
        return `${row}-${col}`;
    }

    const YT_PLAYER_STATE_PLAYING = 1;
    const YT_PLAYER_STATE_BUFFERING = 3;

    const MIN_PLAYBACK_RATE = 0.25;
    const MAX_PLAYBACK_RATE = 8;
    let desiredPlaybackRate = 1;

    const PLAYBACK_RATE_STEP = 0.25;

    function applyPlaybackRate(player, video, rate) {
        if (rate <= 2) {
            player.setPlaybackRate(rate);
        }
        video.playbackRate = rate;
    }

    function syncPlaybackRateFromVideo(video) {
        const live = video.playbackRate;
        if (typeof live !== 'number' || Number.isNaN(live) || live <= 0) return;

        if (Math.abs(live - desiredPlaybackRate) > 0.01) {
            desiredPlaybackRate = live;
        }
    }

    function stepPlaybackRate(current, direction) {
        const s = PLAYBACK_RATE_STEP;
        const next = direction > 0
            ? Math.floor(current / s) * s + s
            : Math.ceil(current / s) * s - s;
        return Math.min(MAX_PLAYBACK_RATE, Math.max(MIN_PLAYBACK_RATE, Math.round(next * 100) / 100));
    }

    function adjustPlaybackSpeed(event, player) {
        if (player.getPlayerState() !== YT_PLAYER_STATE_PLAYING) return;

        event.preventDefault();
        event.stopPropagation();

        const video = player.querySelector('video.html5-main-video');
        if (!video) return;

        syncPlaybackRateFromVideo(video);

        const next = stepPlaybackRate(desiredPlaybackRate, event.deltaY < 0 ? 1 : -1);

        if (next !== desiredPlaybackRate) {
            desiredPlaybackRate = next;
            applyPlaybackRate(player, video, next);
            showIndicator(player, `${next}x`);
        }
    }

    function resetPlaybackSpeed(event, player) {
        if (player.getPlayerState() !== YT_PLAYER_STATE_PLAYING) return;

        event.preventDefault();
        event.stopPropagation();

        const video = player.querySelector('video.html5-main-video');
        desiredPlaybackRate = 1;
        player.setPlaybackRate(1);
        if (video) video.playbackRate = 1;
        showIndicator(player, '1x');
    }

    const ZONE_CLICK_HANDLERS = {
        '0-0': resetPlaybackSpeed,
        '1-0': resetPlaybackSpeed,
        '0-1': toggleWatchPlayback,
        '1-1': toggleWatchPlayback,
    };

    function seekVideo(event, player) {
        const state = player.getPlayerState();
        if (state !== YT_PLAYER_STATE_PLAYING && state !== YT_PLAYER_STATE_BUFFERING) return;

        event.preventDefault();
        event.stopPropagation();

        const duration = player.getDuration();
        const current = player.getCurrentTime();
        const step = event.deltaY < 0 ? 5 : -5;
        const next = Math.min(duration, Math.max(0, current + step));

        player.seekTo(next, true);
        showIndicator(player, step > 0 ? '+5s' : '-5s');
    }

    function toggleWatchPlayback(event, player) {
        event.preventDefault();
        event.stopPropagation();

        if (player.getPlayerState() === YT_PLAYER_STATE_PLAYING) {
            player.pauseVideo();
        } else {
            player.playVideo();
        }
    }

    function adjustVolume(event, player) {
        if (player.getPlayerState() !== YT_PLAYER_STATE_PLAYING) return;
        if (typeof player.getVolume !== 'function' || typeof player.setVolume !== 'function') return;

        const video = player.querySelector('video.html5-main-video');
        if (!video) return;

        event.preventDefault();
        event.stopPropagation();

        syncVolumeFromPlayer(player);

        const next = stepVolume(currentVolumePercent, event.deltaY < 0 ? 1 : -1);

        if (next !== currentVolumePercent) {
            currentVolumePercent = next;
            applyVolumePercent(player, video, next);
            showIndicator(player, `${next}%`);
        }
    }

    let indicatorEl = null;
    let indicatorTimeout = null;

    function showIndicator(player, text) {
        if (!indicatorEl) {
            indicatorEl = document.createElement('div');
            Object.assign(indicatorEl.style, {
                position: 'absolute',
                top: '16px',
                left: '50%',
                transform: 'translateX(-50%)',
                padding: '6px 14px',
                borderRadius: '4px',
                backgroundColor: 'rgba(0, 0, 0, 0.75)',
                color: '#fff',
                fontSize: '14px',
                fontFamily: 'Roboto, Arial, sans-serif',
                zIndex: '10000',
                pointerEvents: 'none',
                transition: 'opacity 0.2s ease',
            });
            player.appendChild(indicatorEl);
        }

        indicatorEl.textContent = text;
        indicatorEl.style.opacity = '1';

        clearTimeout(indicatorTimeout);
        indicatorTimeout = setTimeout(() => {
            if (indicatorEl) indicatorEl.style.opacity = '0';
        }, 700);
    }

    function resolveZone(event) {
        if (overlayEl) return null;

        const active = findActivePlayer();
        if (!active) return null;
        const { player, video } = active;

        if (event.target !== video) return null;

        const rect = player.getBoundingClientRect();
        const insidePlayer =
            event.clientX >= rect.left && event.clientX <= rect.right &&
            event.clientY >= rect.top && event.clientY <= rect.bottom;
        if (!insidePlayer) return null;

        return { player, zoneKey: getZoneKey(event, player) };
    }

    window.addEventListener('wheel', (event) => {
        const zone = resolveZone(event);
        if (!zone) return;

        const handler = ZONE_HANDLERS[zone.zoneKey];
        if (handler) handler(event, zone.player);
    }, { passive: false, capture: true });

    window.addEventListener('click', (event) => {
        const zone = resolveZone(event);
        if (!zone) return;

        const handler = ZONE_CLICK_HANDLERS[zone.zoneKey];
        if (handler) handler(event, zone.player);
    }, { capture: true });

    function findChapterStarts(node, seen = new Set()) {
        if (!node || typeof node !== 'object' || seen.has(node)) return null;
        seen.add(node);
        if (Array.isArray(node.chapters) && node.chapters[0]?.chapterRenderer) {
            return node.chapters.map((c) => c.chapterRenderer.timeRangeStartMillis / 1000);
        }
        for (const key of Object.keys(node)) {
            const found = findChapterStarts(node[key], seen);
            if (found) return found;
        }
        return null;
    }

    function getChapterStarts(player) {
        const data = document.querySelector('ytd-watch-flexy')?.data;
        if (data?.currentVideoEndpoint?.watchEndpoint?.videoId !== player.getVideoData().video_id) return null;
        return findChapterStarts(data);
    }

    window.addEventListener('mousedown', (event) => {
        if (event.button !== 1) return;
        if (!(event.target instanceof Element) || !event.target.closest('#movie_player .ytp-progress-bar-container')) return;

        const player = document.getElementById('movie_player');
        const bar = player && player.querySelector('.ytp-progress-bar');
        if (!bar || typeof player.seekTo !== 'function') return;
        const starts = getChapterStarts(player);
        if (!starts || !starts.length) return;

        event.preventDefault();
        event.stopPropagation();

        const rect = bar.getBoundingClientRect();
        const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
        const time = ratio * player.getDuration();
        const start = starts.filter((s) => s <= time).pop() ?? 0;
        player.seekTo(start, true);
    }, { capture: true });

    function handleVideoChange() {
        const waitForPlayer = setInterval(() => {
            const active = findActivePlayer();
            if (!active || active.videoId === currentVideoId) return;
            clearInterval(waitForPlayer);

            currentVideoId = active.videoId;
            playAllowed = false;
            const { player, video, videoId } = active;
            stopCurrentVideo(video);
            showOverlay(player, videoId);
            forceStoredQuality(player);
            setTimeout(() => forceStoredQuality(player), 800);
            currentVolumePercent = Math.min(100, player.getVolume());
            if (gainNode) gainNode.gain.value = 1;

            desiredPlaybackRate = 1;
            video.playbackRate = 1;
            video.addEventListener('ratechange', () => {
                if (desiredPlaybackRate > 2 && video.playbackRate !== desiredPlaybackRate) {
                    video.playbackRate = desiredPlaybackRate;
                }
            });
        }, 100);

        setTimeout(() => clearInterval(waitForPlayer), 15000);
    }

    document.addEventListener('yt-navigate-start', () => {
        playAllowed = false;
    });
    document.addEventListener('yt-navigate-finish', handleVideoChange);
    document.addEventListener('DOMContentLoaded', handleVideoChange);
    handleVideoChange();
})();
