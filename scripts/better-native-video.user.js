// ==UserScript==
// @name         Better Native Video
// @namespace    https://github.com/aykq/userscripts
// @version      1.4
// @description  Left/Right arrows and the mouse wheel over the timeline seek 10 seconds (30 with Shift) on native HTML5 video controls.
// @author       aykq
// @license      MIT
// @homepageURL  https://github.com/aykq/userscripts
// @supportURL   https://github.com/aykq/userscripts/issues
// @downloadURL  https://raw.githubusercontent.com/aykq/userscripts/main/scripts/better-native-video.user.js
// @updateURL    https://raw.githubusercontent.com/aykq/userscripts/main/scripts/better-native-video.user.js
// @match        *://*/*
// @match        file:///*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(() => {
  'use strict';

  const STEP = 10;
  const SHIFT_STEP = 30;
  const TIMELINE_BAND = 36;
  const WHEEL_NOTCH = 100;

  const findVideo = (e) => {
    for (const node of e.composedPath()) {
      if (node instanceof HTMLVideoElement) return node;
    }
    const fs = document.fullscreenElement;
    if (fs instanceof HTMLVideoElement) return fs;
    return null;
  };

  const seek = (video, delta) => {
    const end = Number.isFinite(video.duration) ? video.duration : Infinity;
    video.currentTime = Math.min(end, Math.max(0, video.currentTime + delta));
  };

  const install = () => {
    // Keys pressed while a native control (timeline) is focused never reach page listeners; pull focus back to the video.
    let refocusing = false;
    window.addEventListener('focusin', (e) => {
      if (refocusing) return;
      const video = findVideo(e);
      if (!video || !video.controls) return;
      setTimeout(() => {
        refocusing = true;
        video.blur();
        video.focus({ preventScroll: true });
        refocusing = false;
      }, 0);
    }, true);

    window.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      if (e.ctrlKey || e.altKey || e.metaKey) return;
      const video = findVideo(e);
      if (!video || !video.controls) return;

      e.preventDefault();
      e.stopImmediatePropagation();
      const step = e.shiftKey ? SHIFT_STEP : STEP;
      seek(video, e.key === 'ArrowRight' ? step : -step);
    }, true);

    let wheelAcc = 0;
    let wheelVideo = null;
    let wheelShift = false;
    window.addEventListener('wheel', (e) => {
      if (e.ctrlKey || e.altKey || e.metaKey) return;
      const video = findVideo(e);
      if (!video || !video.controls) return;
      const rect = video.getBoundingClientRect();
      if (e.clientY < rect.bottom - TIMELINE_BAND || e.clientY > rect.bottom) return;

      e.preventDefault();
      e.stopImmediatePropagation();

      if (video !== wheelVideo || e.shiftKey !== wheelShift) {
        wheelVideo = video;
        wheelShift = e.shiftKey;
        wheelAcc = 0;
      }
      const step = e.shiftKey ? SHIFT_STEP : STEP;
      const unit = e.deltaMode === 0 ? 1 : WHEEL_NOTCH;
      // Chromium turns Shift+wheel into horizontal scroll, so the delta arrives in deltaX.
      const delta = (e.shiftKey ? (e.deltaY || e.deltaX) : e.deltaY) * unit;
      // Mouse notches arrive as one event of varying size (100, 120, ...): exactly one step each, or leftovers add extra steps.
      let up;
      if (Math.abs(delta) >= WHEEL_NOTCH / 2) {
        wheelAcc = 0;
        up = delta < 0;
      } else {
        if (Math.sign(delta) !== Math.sign(wheelAcc)) wheelAcc = 0;
        wheelAcc += delta;
        if (Math.abs(wheelAcc) < WHEEL_NOTCH) return;
        up = wheelAcc < 0;
        wheelAcc = 0;
      }
      seek(video, up ? step : -step);
    }, { capture: true, passive: false });
  };

  // Media events do not bubble; they only reach window in the capture phase.
  const onMedia = (e) => {
    if (!(e.target instanceof HTMLVideoElement)) return;
    window.removeEventListener('loadedmetadata', onMedia, true);
    window.removeEventListener('play', onMedia, true);
    install();
  };
  window.addEventListener('loadedmetadata', onMedia, true);
  window.addEventListener('play', onMedia, true);
})();
