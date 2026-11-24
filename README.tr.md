# userscripts

[English](README.md)

Userscript'lerim.

[Violentmonkey](https://violentmonkey.github.io/) ya da [Tampermonkey](https://www.tampermonkey.net/) lazım. Bir kurulum bağlantısına tıkla, açılan pencerede onayla; script sonrasında kendini günceller.

- [YouTube Stop Autoplay + HQ Thumbnail](#youtube-stop-autoplay--hq-thumbnail)
- [Better Native Video](#better-native-video)

## YouTube Stop Autoplay + HQ Thumbnail

[Kur](https://raw.githubusercontent.com/aykq/userscripts/main/scripts/yt-watch-stop-autoplay.user.js)

YouTube bir izleme sayfasını, Shorts'u ya da kanal sayfasını açtığında videoyu kendi başlatır, playlist'te de sıradakine kendi geçer. Bu script bunu durdurur. Oynatıcıda videonun küçük resmi tam kalitede görünür, video sen tıklayınca başlar. Önerilen bir videoya tıkladığında da aynısı olur, sıradaki video da tıklamanı bekler. Hiçbir şey kendi kendine oynamadığı için izleme geçmişine de kendi kendine bir şey düşmez. Ana sayfada ve aramada üzerine gelince açılan önizlemelere dokunulmaz. Canlı yayında tıklama, DVR penceresinin başına değil canlı yayının ucuna götürür.

### Scroll kontrolleri

İmleç videonun üzerindeyken scroll yap. Oynatıcı üç sütuna bölünür ve scroll'a yalnız üstteki üçte ikilik kısım tepki verir, alt kısım YouTube'un kendi kontrollerine kalır. Dar bir videonun yanlarındaki siyah çubuklar da oynatıcının parçası sayılır.

- Sol sütun: oynatma hızı, 0,25x ile 8x arası, 0,25'lik adımlarla. Tıklayınca 1x'e döner.
- Orta sütun: 5 saniye ileri ya da geri sarar. Tıklayınca oynatır ya da duraklatır.
- Sağ sütun: ses, %0 ile %300 arası, %5'lik adımlarla.

Scroll yalnız video oynarken çalışır. Duraklatılmışsa scroll sayfayı normal kaydırır. Shorts'ta ve kanal tanıtım videolarında da çalışır.

Videonun geri kalan her yerine tıklamak da oynatır ya da duraklatır; böylece oynatıcının her noktası aynı davranır ve YouTube'un kendi oynat/duraklat simgesi çıkmaz. Sol sütunda duraklatılmış videoya tıklamak onu oynatır.

### Ayarlar

YouTube sekmesindeyken userscript yöneticisinin menüsünü aç (Violentmonkey'de araç çubuğundaki simgesine tıkla). Bu script'in altında her scroll kontrolü, her tıklama, bölümler için orta tık, kullanılmayan alanlara tıklama, opak katmanlar, bulanıklık kaldırma ve buffer seçenekleri için ayrı bir anahtar var. İşaret açık demektir. Değişiklikler hemen uygulanır ve hatırlanır.

%100 üstündeki ses, Web Audio API ile yapılan bir güçlendirmedir. 2x üstündeki hızlar doğrudan video elementine yazılır, çünkü YouTube'un kendi oynatıcısı 2x'te durur. Sesi ya da hızı YouTube'un kaydırıcısından, menüsünden veya klavye kısayollarından değiştirirsen script bunu fark eder ve oradan devam eder. Her yeni videoda hız 1x'e döner, %100 üstündeki güçlendirme de sıfırlanır.

### Kalite

Oynatıcının ayarlar menüsünden bir çözünürlüğü bir kez seç, script sonraki her videoda onu uygular. Seçimi ayrıca kilitler; böylece uyarlanabilir akış arabelleğe alırken kaliteyi sessizce değiştirmez. Videoda o çözünürlük yoksa onun altındaki en yüksek olanı kullanır. Otomatik'i seçersen kayıt silinir.

### Tiyatro modu

YouTube tiyatro modunu yalnız tarayıcı kapanana kadar hatırlar. Script bu seçimi kalıcı yapar; videolar en son hangi modda bıraktıysan o modda açılır.

### Bölümler (chapter)

İlerleme çubuğuna orta tıkla, imlecin altındaki bölümün başına atlar. Sadece izleme sayfasında ve bölümü olan videolarda çalışır.

### Buffer

YouTube'un oynatıcısı oynatma noktasının ilerisinde yalnızca kısa bir kısmı önceden okur: 1080p'de yaklaşık 40 saniye, daha yüksek çözünürlüklerde daha az. Script bu sınırı yükseltir; buffer daha ileri uzanır ve bir iki dakika ileri atlamak akıcı kalır. 1080p'de yaklaşık iki dakikaya ulaşır. YouTube'un sunucusu bundan fazlasını göndermez, yani iki dakika tavandır. Yüksek çözünürlükler video saniyesi başına daha çok bellek istediği için daha erken durur.

Chromium tabanlı tarayıcılar video buffer'ını varsayılan olarak yaklaşık 150 MB ile sınırlar. 1440p ve 4K için tarayıcıyı `--mse-video-buffer-size-limit-mb=512` parametresiyle başlatıp menüden "daha yüksek bellek kotası" seçeneğini açabilirsin. Parametre yoksa bu seçeneği kapalı bırak, yoksa 4K'da buffer dolunca takılma olabilir. Açıkken sekme daha çok bellek kullanır.

Bu özellik deneyseldir. YouTube'un oynatıcısındaki bir değeri değiştirerek çalışır; script bu değeri oynatıcının kodunu okuyarak bulur, bu yüzden bir YouTube güncellemesi onu durdurabilir. Menü satırının sonunda durumu köşeli parantezle yazar: searching, ready, active ya da field not found. Bir şey tuhaf görünürse kapat.

### Küçük resim ön yüklemesi

Kaydırmayı bıraktığında ekrandaki videoların tam boyutlu küçük resimleri arka planda indirilir. Böylece bir videoyu açınca oynatıcıdaki resim hemen görünür. İstemezsen script'in başındaki `PRELOAD_THUMBNAILS` değerini `false` yap.

### Görünüm

İlerleme çubukları düz kırmızıdır: oynatıcıda, küçük resimlerdeki izlendi çubuklarında ve sayfanın üstündeki yükleme çubuğunda.

İki isteğe bağlı ayar varsayılan olarak kapalıdır ve menüden açılabilir: YouTube'un yarı saydam oynatıcı katmanlarını düz renk yapan opak katmanlar ve sayfadaki arka plan bulanıklığını kaldıran bulanıklık kaldırma.

YouTube sayfasını sık değiştirdiği için bir şey ara sıra bozulabilir. Olursa issue aç.

## Better Native Video

[Kur](https://raw.githubusercontent.com/aykq/userscripts/main/scripts/better-native-video.user.js)

Tarayıcı bir video dosyasını doğrudan oynattığında ya da sayfa tarayıcının yerleşik video kontrollerini kullandığında ok tuşları videonun küçük bir yüzdesi kadar atlar. Bu script onları 10 saniye atlatır.

- Sol ve sağ ok: 10 saniye geri ya da ileri. Shift basılıyken 30 saniye.
- Zaman çubuğunun üstünde tekerlek: her çentikte 10 saniye, Shift ile 30. Yukarı kaydırmak ileri sarar.

Her sitede çalışır ama yalnız tarayıcının kendi kontrollerini gösteren videolara dokunur; kendi kontrolleri olan oynatıcılar (YouTube, Twitch vb.) etkilenmez. Userscript yöneticisinin dosya URL'lerine erişimine izin verdiysen yerel dosyalarda da çalışır.

## Lisans

[MIT](LICENSE)
