// ==UserScript==
// @name         Kick Player Controls
// @namespace    https://github.com/aykq/userscripts
// @version      2.1
// @description  VODs: arrow keys seek 10 seconds, the wheel over the timeline seeks 10 (30 with Shift). Live and VOD: the wheel over the player changes volume, middle click or M mutes, and the volume slider stays visible.
// @author       aykq
// @license      MIT
// @homepageURL  https://github.com/aykq/userscripts
// @supportURL   https://github.com/aykq/userscripts/issues
// @downloadURL  https://raw.githubusercontent.com/aykq/userscripts/main/scripts/kick-player-controls.user.js
// @updateURL    https://raw.githubusercontent.com/aykq/userscripts/main/scripts/kick-player-controls.user.js
// @match        https://kick.com/*
// @run-at       document-start
// @grant        none
// @noframes
// ==/UserScript==

// Volume wheel, middle click mute and the always visible slider are based on
// "Kick Volume Wheel Control" by Pabli, MIT License: https://greasyfork.org/scripts/517942

(() => {
  'use strict';

  const STEP = 10;
  const BIG_STEP = 30;
  const VOLUME_STEP = 5;
  const WHEEL_NOTCH = 100;
  const SEEKBAR_SLACK = 4;
  const VOD_PATH = /^\/[^/]+\/videos\/[0-9a-f-]{36}\/?$/i;

  const PLAYER = '#injected-embedded-channel-player-video';
  const isVod = () => VOD_PATH.test(location.pathname);
  const getVideo = () => document.getElementById('video-player');
  const getPlayer = () => document.querySelector(PLAYER);
  // Kick class names; if they change, wheel/mute silently fall back to doing nothing.
  const getVolumeGroup = () => document.querySelector(`${PLAYER} [class*="group/volume"]`);
  const getSeekbar = () => document.querySelector(`${PLAYER} [class*="group/seekbar"]`);

  const isTyping = (target) => {
    if (!(target instanceof HTMLElement)) return false;
    const tag = target.tagName.toLowerCase();
    return tag === 'input' || tag === 'textarea' || target.isContentEditable || 'input' in target.dataset;
  };

  const seek = (delta) => {
    const video = getVideo();
    if (!video || !Number.isFinite(video.duration) || video.readyState < 1) return false;
    video.currentTime = Math.min(video.duration - 1, Math.max(0, video.currentTime + delta));
    return true;
  };

  // Kick's slider props (value [0-100], onValueChange) update its player store and the saved volume cookie together.
  // Found by walking React fiber props; if Kick renames them, the wheel silently stops changing volume.
  const getSliderProps = () => {
    const slider = getVolumeGroup()?.querySelector('[role="slider"]');
    if (!slider) return null;
    const key = Object.keys(slider).find((k) => k.startsWith('__reactFiber$'));
    for (let f = key && slider[key], i = 0; f && i < 60; f = f.return, i++) {
      const p = f.memoizedProps;
      if (p && typeof p.onValueChange === 'function' && Array.isArray(p.value)) return p;
    }
    return null;
  };

  const toggleMute = () => getVolumeGroup()?.querySelector('button')?.click();

  // props.value lags until React re-renders, so fast wheel ticks continue from the last value we set.
  let lastSet = { value: null, at: 0 };
  const changeVolume = (steps, retried = false) => {
    if (getVideo()?.muted) {
      if (steps > 0) toggleMute();
      return;
    }
    const props = getSliderProps();
    if (!props) {
      if (!retried) setTimeout(() => changeVolume(steps, true), 80);
      return;
    }
    const recent = lastSet.value !== null && performance.now() - lastSet.at < 400;
    const now = recent ? lastSet.value : Math.round(props.value[0] ?? 50);
    const next = Math.min(100, Math.max(0, Math.round(now / VOLUME_STEP + steps) * VOLUME_STEP));
    if (next === now) return;
    lastSet = { value: next, at: performance.now() };
    props.onValueChange([next]);
  };

  const wakeControls = (e) => {
    const video = getVideo();
    if (!video) return;
    const init = { bubbles: true, clientX: e.clientX, clientY: e.clientY };
    video.dispatchEvent(new PointerEvent('pointermove', init));
    video.dispatchEvent(new MouseEvent('mousemove', init));
  };

  const overSeekbar = (e) => {
    const bar = getSeekbar();
    if (!bar) return false;
    const r = bar.getBoundingClientRect();
    return e.clientX >= r.left && e.clientX <= r.right &&
      e.clientY >= r.top - SEEKBAR_SLACK && e.clientY <= r.bottom + SEEKBAR_SLACK;
  };

  // Capture on window: Kick's own key handler is a bubble listener on window (VOD right arrow = 30s).
  window.addEventListener('keydown', (e) => {
    if (!e.isTrusted || isTyping(e.target)) return;
    if (e.ctrlKey || e.altKey || e.metaKey || e.shiftKey) return;
    if (document.querySelector("[role='dialog'][data-state='open']")) return;

    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      if (!isVod()) return;
      if (!seek(e.key === 'ArrowRight' ? STEP : -STEP)) return;
      e.preventDefault();
      e.stopImmediatePropagation();
    } else if (e.key === 'm' || e.key === 'M') {
      if (!getVolumeGroup()) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      toggleMute();
    }
  }, true);

  let wheelAcc = 0;
  let wheelMode = null;
  window.addEventListener('wheel', (e) => {
    if (e.ctrlKey || e.altKey || e.metaKey) return;
    if (!(e.target instanceof Element) || !e.target.closest(PLAYER)) return;
    if (e.target.closest('[role="menu"], [role="listbox"], [data-radix-popper-content-wrapper]')) return;

    const mode = isVod() && overSeekbar(e) ? (e.shiftKey ? 'seekBig' : 'seek') : (e.shiftKey ? null : 'volume');
    if (!mode) return;

    e.preventDefault();
    e.stopImmediatePropagation();
    wakeControls(e);

    if (mode !== wheelMode) {
      wheelMode = mode;
      wheelAcc = 0;
    }
    // Mouse notches arrive as one event of varying size (100, 120, ...): exactly one step each, or leftovers add extra steps.
    const delta = (e.deltaY || e.deltaX) * (e.deltaMode === 0 ? 1 : WHEEL_NOTCH);
    let steps;
    if (Math.abs(delta) >= WHEEL_NOTCH / 2) {
      wheelAcc = 0;
      steps = delta < 0 ? 1 : -1;
    } else {
      if (Math.sign(delta) !== Math.sign(wheelAcc)) wheelAcc = 0;
      wheelAcc += delta;
      if (Math.abs(wheelAcc) < WHEEL_NOTCH) return;
      steps = wheelAcc < 0 ? 1 : -1;
      wheelAcc = 0;
    }
    if (mode === 'volume') changeVolume(steps);
    else seek(steps * (mode === 'seekBig' ? BIG_STEP : STEP));
  }, { capture: true, passive: false });

  window.addEventListener('mousedown', (e) => {
    if (e.button !== 1 || !(e.target instanceof Element) || !e.target.closest(PLAYER)) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    toggleMute();
  }, true);

  const style = document.createElement('style');
  style.textContent = `
${PLAYER} [class*="group/volume"] > div.hidden { display: flex !important; align-items: center; }
${PLAYER} [class*="group/volume"] > div.hidden::after {
  content: attr(data-volume); font-weight: 600; font-size: .875rem; line-height: 1.25rem; margin-left: .5rem; width: 4ch;
}`;

  // The percentage label reads the slider's aria-valuenow, which Kick only updates through React.
  const syncLabel = () => {
    const group = getVolumeGroup();
    const slider = group?.querySelector('[role="slider"]');
    const box = group?.querySelector(':scope > div');
    if (!slider || !box) return;
    const muted = getVideo()?.muted;
    const label = muted ? '0%' : `${Math.round(Number(slider.getAttribute('aria-valuenow')) || 0)}%`;
    if (box.getAttribute('data-volume') !== label) box.setAttribute('data-volume', label);
  };

  const start = () => {
    document.head.appendChild(style);
    new MutationObserver(syncLabel).observe(document.body, {
      subtree: true, childList: true, attributes: true, attributeFilter: ['aria-valuenow'],
    });
    window.addEventListener('volumechange', syncLabel, true);
    syncLabel();
  };
  if (document.body) start();
  else document.addEventListener('DOMContentLoaded', start, { once: true });
})();
