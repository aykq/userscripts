# userscripts

[Türkçe](README.tr.md)

My userscripts. There is one for now.

## YouTube Stop Autoplay + HQ Thumbnail

[Install](https://raw.githubusercontent.com/aykq/userscripts/main/scripts/yt-watch-stop-autoplay.user.js)

You need [Violentmonkey](https://violentmonkey.github.io/) or [Tampermonkey](https://www.tampermonkey.net/). Click the link, confirm the dialog, and it updates itself from then on.

YouTube starts playing a video on its own when you open a watch page, a Short or a channel page, and when a playlist moves on to the next one. This script stops that. The player shows the video's thumbnail in full quality, and the video only starts when you click. Clicking a suggested video works the same way, the next one waits for a click too. Since nothing plays by itself, nothing lands in your watch history by itself either. Hover previews on the home page and in search are left alone. On a live stream, the click takes you to the live edge instead of the start of the DVR window.

### Scroll controls

Scroll with the cursor over the video. The player is split into three columns and only the top two thirds are active, so the bottom part still belongs to YouTube's own controls.

- Left column: playback speed, 0.25x to 8x in steps of 0.25. Click to go back to 1x.
- Middle column: seek 5 seconds forward or back. Click to play or pause.
- Right column: volume from 0% to 300% in steps of 5.

This only works while the video is playing. When it is paused, scrolling moves the page as usual. It also works on Shorts and on channel trailers.

Volume above 100% is a gain boost through the Web Audio API. Speeds above 2x are written straight to the video element, because YouTube's own player stops at 2x. If you change volume or speed with YouTube's slider, menu or keyboard shortcuts, the script notices and carries on from there. On every new video, speed goes back to 1x and any boost above 100% is dropped.

### Quality

Pick a resolution in the player's settings menu once and the script applies it to every video after that. It also locks the choice so adaptive streaming does not quietly change it while buffering. If a video does not have that resolution, the highest one below it is used. Picking Auto forgets the saved choice.

### Chapters

Middle click on the progress bar to jump to the start of the chapter under the cursor. Watch pages only, and only for videos that have chapters.

### Thumbnail preloading

When you stop scrolling, the full-size thumbnails of the videos on screen are fetched in the background, so the thumbnail in the player shows up right away when you open one. If you do not want this, set `PRELOAD_THUMBNAILS` to `false` near the top of the script.

### Looks

The progress bars are plain red: in the player, the watched bars on thumbnails and the loading bar at the top of the page.

The script also has a block that makes YouTube's translucent player overlays solid and removes backdrop blur. It is switched off (commented out) by default. To turn it on, open the script, find the comment at the start of the `opaqueStyle` rules and delete it together with the lone closing line below that group of rules.

YouTube changes its page often, so something here may break now and then. If it does, open an issue.

## License

[MIT](LICENSE)
