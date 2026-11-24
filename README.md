# userscripts

[Türkçe](README.tr.md)

My userscripts.

You need [Violentmonkey](https://violentmonkey.github.io/) or [Tampermonkey](https://www.tampermonkey.net/). Click an install link, confirm the dialog, and the script updates itself from then on.

- [YouTube Stop Autoplay + HQ Thumbnail](#youtube-stop-autoplay--hq-thumbnail)
- [Better Native Video](#better-native-video)
- [Kick Player Controls](#kick-player-controls)

## YouTube Stop Autoplay + HQ Thumbnail

[Install](https://raw.githubusercontent.com/aykq/userscripts/main/scripts/yt-watch-stop-autoplay.user.js)

YouTube starts playing a video on its own when you open a watch page, a Short or a channel page, and when a playlist moves on to the next one. This script stops that. The player shows the video's thumbnail in full quality, and the video only starts when you click. Clicking a suggested video works the same way, the next one waits for a click too. Since nothing plays by itself, nothing lands in your watch history by itself either. Hover previews on the home page and in search are left alone. On a live stream, the click takes you to the live edge instead of the start of the DVR window.

### Scroll controls

Scroll with the cursor over the video. The player is split into three columns and only the top two thirds react to scroll, so the bottom part still belongs to YouTube's own controls. The black bars beside a narrow video count as part of the player.

- Left column: playback speed, 0.25x to 8x in steps of 0.25. Click to go back to 1x.
- Middle column: seek 5 seconds forward or back. Click to play or pause.
- Right column: volume from 0% to 300% in steps of 5.

Scrolling only works while the video is playing. When it is paused, scrolling moves the page as usual. It also works on Shorts and on channel trailers.

A click anywhere else on the video plays or pauses it, so the whole player behaves the same, and YouTube's own play/pause icon does not flash. In the left column a click on a paused video plays it.

### Settings

Open your userscript manager's menu on a YouTube tab (in Violentmonkey, click its toolbar icon). Under this script there is a switch for each scroll control, each click, the middle click on chapters, the click on unused areas, opaque overlays, blur removal and the buffer options. A tick means on. Changes apply right away and are remembered.

Volume above 100% is a gain boost through the Web Audio API. Speeds above 2x are written straight to the video element, because YouTube's own player stops at 2x. If you change volume or speed with YouTube's slider, menu or keyboard shortcuts, the script notices and carries on from there. On every new video, speed goes back to 1x and any boost above 100% is dropped.

### Quality

Pick a resolution in the player's settings menu once and the script applies it to every video after that. It also locks the choice so adaptive streaming does not quietly change it while buffering. If a video does not have that resolution, the highest one below it is used. Picking Auto forgets the saved choice.

### Theater mode

YouTube keeps theater mode only until the browser is closed. The script makes it stick, so videos open in whichever mode you used last.

### Chapters

Middle click on the progress bar to jump to the start of the chapter under the cursor. Watch pages only, and only for videos that have chapters.

### Buffer

YouTube's player only reads a short stretch of video ahead of the playhead, around 40 seconds at 1080p and less at higher resolutions. The script raises that limit, so the buffer grows further and jumping a minute or two ahead stays smooth. At 1080p it reaches about two minutes. YouTube's server does not send more than that, so two minutes is the ceiling. Higher resolutions need more memory per second of video, so they stop earlier.

Chromium based browsers cap the video buffer at about 150 MB by default. For 1440p and 4K you can start the browser with `--mse-video-buffer-size-limit-mb=512` and switch on "higher memory quota" in the menu. Without the flag leave that option off, otherwise 4K can stall once the buffer is full. The tab uses more memory while it is on.

This is experimental. It works by changing a value inside YouTube's player that the script finds by reading the player's code, so a YouTube update can stop it. The menu line shows its state in brackets: searching, ready, active or field not found. Switch it off if anything looks odd.

### Thumbnail preloading

When you stop scrolling, the full-size thumbnails of the videos on screen are fetched in the background, so the thumbnail in the player shows up right away when you open one. If you do not want this, set `PRELOAD_THUMBNAILS` to `false` near the top of the script.

### Looks

The progress bars are plain red: in the player, the watched bars on thumbnails and the loading bar at the top of the page.

Two optional tweaks are off by default and can be switched on in the menu: opaque overlays, which turn YouTube's translucent player overlays solid, and blur removal, which removes backdrop blur across the page.

YouTube changes its page often, so something here may break now and then. If it does, open an issue.

## Better Native Video

[Install](https://raw.githubusercontent.com/aykq/userscripts/main/scripts/better-native-video.user.js)

When a browser plays a video file directly, or a page uses the browser's built-in video controls, the arrow keys jump by a small percentage of the video. This script makes them jump 10 seconds instead.

- Left and Right arrows: 10 seconds back or forward. Hold Shift for 30 seconds.
- Mouse wheel over the timeline: 10 seconds per notch, 30 with Shift. Scrolling up goes forward.

It runs on every site but only touches videos that show the browser's own controls, so players with custom controls (YouTube, Twitch and the like) are left alone. It also works on local files if your userscript manager is allowed to access file URLs.

## Kick Player Controls

[Install](https://raw.githubusercontent.com/aykq/userscripts/main/scripts/kick-player-controls.user.js)

Mouse and keyboard controls for the player on kick.com.

- Mouse wheel over the player: volume up or down in steps of 5%. Scrolling up while muted unmutes.
- Middle click on the player or M: mute or unmute.
- The volume slider and its percentage stay visible next to the mute button.
- On VODs, Left and Right arrows seek 10 seconds. Kick's own default is 10 back and 30 forward.
- On VODs, the wheel over the timeline seeks 10 seconds per notch, 30 with Shift.

Kick changes its page from time to time. If a control stops working, open an issue.

The volume wheel, middle click mute and always visible slider are based on [Kick Volume Wheel Control](https://greasyfork.org/scripts/517942) by Pabli, released under the MIT License.

## License

[MIT](LICENSE)
