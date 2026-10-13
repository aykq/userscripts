# userscripts

[Türkçe](README.tr.md)

Small userscripts for the browser. Each script is a single file in [`scripts/`](scripts).

## Install

You need a userscript manager such as [Violentmonkey](https://violentmonkey.github.io/) or [Tampermonkey](https://www.tampermonkey.net/). Click a script's install link below and confirm the install dialog. Updates arrive automatically.

| Script | Install |
| --- | --- |
| YouTube Stop Autoplay + HQ Thumbnail | [Install](https://raw.githubusercontent.com/aykq/userscripts/main/scripts/yt-watch-stop-autoplay.user.js) |

## YouTube Stop Autoplay + HQ Thumbnail

Videos on watch pages, Shorts and channel pages do not start on their own. A high quality thumbnail is shown instead, and the video starts when you click it. Because it never starts by itself, it is not added to your watch history until you click.

**Scroll controls** (only while the video is playing, so a paused video still lets the page scroll). The top two thirds of the player are split into three columns:

| Column | Scroll | Click |
| --- | --- | --- |
| Left | Playback speed, 0.25x to 8x in 0.25x steps | Reset speed to 1x |
| Middle | Seek 5 seconds forward or back | Play or pause |
| Right | Volume, 0% to 300% in 5% steps | |

Volume above 100% uses the Web Audio API to boost the sound.

**Other features**

- Remembers the quality you pick in the player menu and applies it to every video. If that quality is not available, the closest lower one is used. Picking Auto clears the saved quality.
- Middle click on the progress bar jumps to the start of the chapter under the cursor.
- On live streams, clicking the thumbnail jumps to the live edge.
- After you stop scrolling, thumbnails of the videos on screen are loaded in the background so the click-to-play thumbnail appears instantly. Set `PRELOAD_THUMBNAILS` to `false` at the top of the script to turn this off.
- Player overlays are made solid instead of translucent, backdrop blur is removed, and progress bars are plain red.

**Notes**

- The script relies on YouTube's page structure and player API. If YouTube changes them, a feature can stop working. Please open an issue.
- Debug logging is off. Set `DEBUG` to `true` in the script to see `[yt-stop-autoplay]` messages in the console.

## License

[MIT](LICENSE)
