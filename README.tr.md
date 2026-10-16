# userscripts

[English](README.md)

Userscript'lerim. Şimdilik bir tane var.

## YouTube Stop Autoplay + HQ Thumbnail

[Kur](https://raw.githubusercontent.com/aykq/userscripts/main/scripts/yt-watch-stop-autoplay.user.js)

[Violentmonkey](https://violentmonkey.github.io/) ya da [Tampermonkey](https://www.tampermonkey.net/) lazım. Bağlantıya tıkla, açılan pencerede kurulumu onayla; sonrasında kendini günceller.

YouTube bir izleme sayfasını, Shorts'u ya da kanal sayfasını açtığında videoyu kendi başlatır, playlist'te de sıradakine kendi geçer. Bu script bunu durdurur. Oynatıcıda videonun küçük resmi tam kalitede görünür, video sen tıklayınca başlar. Önerilen bir videoya tıkladığında da aynısı olur, sıradaki video da tıklamanı bekler. Hiçbir şey kendi kendine oynamadığı için izleme geçmişine de kendi kendine bir şey düşmez. Ana sayfada ve aramada üzerine gelince açılan önizlemelere dokunulmaz. Canlı yayında tıklama, DVR penceresinin başına değil canlı yayının ucuna götürür.

### Scroll kontrolleri

İmleç videonun üzerindeyken scroll yap. Oynatıcı üç sütuna bölünür ve scroll'a yalnız üstteki üçte ikilik kısım tepki verir, alt kısım YouTube'un kendi kontrollerine kalır. Dar bir videonun yanlarındaki siyah çubuklar da oynatıcının parçası sayılır.

- Sol sütun: oynatma hızı, 0,25x ile 8x arası, 0,25'lik adımlarla. Tıklayınca 1x'e döner.
- Orta sütun: 5 saniye ileri ya da geri sarar. Tıklayınca oynatır ya da duraklatır.
- Sağ sütun: ses, %0 ile %300 arası, %5'lik adımlarla.

Scroll yalnız video oynarken çalışır. Duraklatılmışsa scroll sayfayı normal kaydırır. Shorts'ta ve kanal tanıtım videolarında da çalışır.

Videonun geri kalan her yerine tıklamak da oynatır ya da duraklatır; böylece oynatıcının her noktası aynı davranır ve YouTube'un kendi oynat/duraklat simgesi çıkmaz. Sol sütunda duraklatılmış videoya tıklamak onu oynatır.

### Ayarlar

YouTube sekmesindeyken userscript yöneticisinin menüsünü aç (Violentmonkey'de araç çubuğundaki simgesine tıkla). Bu script'in altında her scroll kontrolü, her tıklama, bölümler için orta tık, kullanılmayan alanlara tıklama, opak katmanlar ve bulanıklık kaldırma için ayrı bir anahtar var. İşaret açık demektir. Değişiklikler hemen uygulanır ve hatırlanır.

%100 üstündeki ses, Web Audio API ile yapılan bir güçlendirmedir. 2x üstündeki hızlar doğrudan video elementine yazılır, çünkü YouTube'un kendi oynatıcısı 2x'te durur. Sesi ya da hızı YouTube'un kaydırıcısından, menüsünden veya klavye kısayollarından değiştirirsen script bunu fark eder ve oradan devam eder. Her yeni videoda hız 1x'e döner, %100 üstündeki güçlendirme de sıfırlanır.

### Kalite

Oynatıcının ayarlar menüsünden bir çözünürlüğü bir kez seç, script sonraki her videoda onu uygular. Seçimi ayrıca kilitler; böylece uyarlanabilir akış arabelleğe alırken kaliteyi sessizce değiştirmez. Videoda o çözünürlük yoksa onun altındaki en yüksek olanı kullanır. Otomatik'i seçersen kayıt silinir.

### Tiyatro modu

YouTube tiyatro modunu yalnız tarayıcı kapanana kadar hatırlar. Script bu seçimi kalıcı yapar; videolar en son hangi modda bıraktıysan o modda açılır.

### Bölümler (chapter)

İlerleme çubuğuna orta tıkla, imlecin altındaki bölümün başına atlar. Sadece izleme sayfasında ve bölümü olan videolarda çalışır.

### Küçük resim ön yüklemesi

Kaydırmayı bıraktığında ekrandaki videoların tam boyutlu küçük resimleri arka planda indirilir. Böylece bir videoyu açınca oynatıcıdaki resim hemen görünür. İstemezsen script'in başındaki `PRELOAD_THUMBNAILS` değerini `false` yap.

### Görünüm

İlerleme çubukları düz kırmızıdır: oynatıcıda, küçük resimlerdeki izlendi çubuklarında ve sayfanın üstündeki yükleme çubuğunda.

İki isteğe bağlı ayar varsayılan olarak kapalıdır ve menüden açılabilir: YouTube'un yarı saydam oynatıcı katmanlarını düz renk yapan opak katmanlar ve sayfadaki arka plan bulanıklığını kaldıran bulanıklık kaldırma.

YouTube sayfasını sık değiştirdiği için bir şey ara sıra bozulabilir. Olursa issue aç.

## Lisans

[MIT](LICENSE)
