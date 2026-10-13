# userscripts

[English](README.md)

Tarayıcı için küçük userscript'ler. Her script [`scripts/`](scripts) altında tek bir dosyadır.

## Kurulum

[Violentmonkey](https://violentmonkey.github.io/) ya da [Tampermonkey](https://www.tampermonkey.net/) gibi bir userscript yöneticisi gerekir. Aşağıdaki kurulum bağlantısına tıklayıp açılan pencerede kurulumu onaylaman yeterli. Güncellemeler otomatik gelir.

| Script | Kurulum |
| --- | --- |
| YouTube Stop Autoplay + HQ Thumbnail | [Kur](https://raw.githubusercontent.com/aykq/userscripts/main/scripts/yt-watch-stop-autoplay.user.js) |

## YouTube Stop Autoplay + HQ Thumbnail

İzleme sayfalarında, Shorts'ta ve kanal sayfalarında videolar kendiliğinden başlamaz. Yerine yüksek kaliteli bir küçük resim gösterilir ve video, resme tıklayınca başlar. Video kendi kendine hiç başlamadığı için, sen tıklayana kadar izleme geçmişine eklenmez.

**Scroll kontrolleri** (yalnız video oynarken çalışır, duraklatılmış videoda sayfa normal kayar). Oynatıcının üst üçte ikisi üç sütuna bölünür:

| Sütun | Scroll | Tıklama |
| --- | --- | --- |
| Sol | Oynatma hızı, 0,25x ile 8x arası, 0,25x adımlarla | Hızı 1x'e sıfırla |
| Orta | 5 saniye ileri veya geri sar | Oynat veya duraklat |
| Sağ | Ses, %0 ile %300 arası, %5 adımlarla | |

%100 üzerindeki ses için Web Audio API ile güçlendirme yapılır.

**Diğer özellikler**

- Oynatıcı menüsünden seçtiğin kaliteyi hatırlar ve her videoya uygular. O kalite yoksa en yakın alt kalite kullanılır. Otomatik seçersen kayıt silinir.
- İlerleme çubuğuna orta tık, imlecin altındaki bölümün (chapter) başına atlar.
- Canlı yayınlarda küçük resme tıklayınca canlı yayının ucuna geçilir.
- Kaydırmayı bırakınca ekrandaki videoların küçük resimleri arka planda yüklenir, böylece tıklanınca beliren resim anında görünür. Kapatmak için script'in başındaki `PRELOAD_THUMBNAILS` değerini `false` yap.
- Oynatıcı katmanları yarı saydam yerine düz renk olur, arka plan bulanıklığı kaldırılır, ilerleme çubukları düz kırmızıdır.

**Notlar**

- Script, YouTube'un sayfa yapısına ve oynatıcı API'sine dayanır. YouTube bunları değiştirirse bir özellik çalışmayı bırakabilir. Böyle olursa lütfen bir issue aç.
- Hata ayıklama günlüğü kapalıdır. Konsolda `[yt-stop-autoplay]` mesajlarını görmek için script'te `DEBUG` değerini `true` yap.

## Lisans

[MIT](LICENSE)
