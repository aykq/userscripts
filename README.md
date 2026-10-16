# userscripts

[Türkçe](README.tr.md)

My userscripts. There is one for now.

## YouTube Stop Autoplay + HQ Thumbnail

[Install](https://raw.githubusercontent.com/aykq/userscripts/main/scripts/yt-watch-stop-autoplay.user.js)

You need [Violentmonkey](https://violentmonkey.github.io/) or [Tampermonkey](https://www.tampermonkey.net/). Click the link, confirm the dialog, and it updates itself from then on.

YouTube starts playing a video on its own when you open a watch page, a Short or a channel page, and when a playlist moves on to the next one. This script stops that. The player shows the video's thumbnail in full quality, and the video only starts when you click. Clicking a suggested video works the same way, the next one waits for a click too. Since nothing plays by itself, nothing lands in your watch history by itself either. Hover previews on the home page and in search are left alone. On a live stream, the click takes you to the live edge instead of the start of the DVR window.

### Scroll controls

Scroll with the cursor over the video. The player is split into three columns and only the top two thirds react to scroll, so the bottom part still belongs to YouTube's own controls. The black bars beside a narrow video count as part of the player.

- Left column: playback speed, 0.25x to 8x in steps of 0.25. Click to go back to 1x.
- Middle column: seek 5 seconds forward or back. Click to play or pause.
- Right column: volume from 0% to 300% in steps of 5.

Scrolling only works while the video is playing. When it is paused, scrolling moves the page as usual. It also works on Shorts and on channel trailers.

A click anywhere else on the video plays or pauses it, so the whole player behaves the same, and YouTube's own play/pause icon does not flash. In the left column a click on a paused video plays it.

### Settings

Open your userscript manager's menu on a YouTube tab (in Violentmonkey, click its toolbar icon). Under this script there is a switch for each scroll control, each click, the middle click on chapters, the click on unused areas, opaque overlays and blur removal. A tick means on. Changes apply right away and are remembered.

Volume above 100% is a gain boost through the Web Audio API. Speeds above 2x are written straight to the video element, because YouTube's own player stops at 2x. If you change volume or speed with YouTube's slider, menu or keyboard shortcuts, the script notices and carries on from there. On every new video, speed goes back to 1x and any boost above 100% is dropped.

### Quality

Pick a resolution in the player's settings menu once and the script applies it to every video after that. It also locks the choice so adaptive streaming does not quietly change it while buffering. If a video does not have that resolution, the highest one below it is used. Picking Auto forgets the saved choice.

### Theater mode

YouTube keeps theater mode only until the browser is closed. The script makes it stick, so videos open in whichever mode you used last.

### Chapters

Middle click on the progress bar to jump to the start of the chapter under the cursor. Watch pages only, and only for videos that have chapters.

### Thumbnail preloading

When you stop scrolling, the full-size thumbnails of the videos on screen are fetched in the background, so the thumbnail in the player shows up right away when you open one. If you do not want this, set `PRELOAD_THUMBNAILS` to `false` near the top of the script.

### Looks

The progress bars are plain red: in the player, the watched bars on thumbnails and the loading bar at the top of the page.

Two optional tweaks are off by default and can be switched on in the menu: opaque overlays, which turn YouTube's translucent player overlays solid, and blur removal, which removes backdrop blur across the page.

YouTube changes its page often, so something here may break now and then. If it does, open an issue.

## License

[MIT](LICENSE)
