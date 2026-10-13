# userscripts

[English](README.md)

Userscript'lerim. Şimdilik bir tane var.

## YouTube Stop Autoplay + HQ Thumbnail

[Kur](https://raw.githubusercontent.com/aykq/userscripts/main/scripts/yt-watch-stop-autoplay.user.js)

[Violentmonkey](https://violentmonkey.github.io/) ya da [Tampermonkey](https://www.tampermonkey.net/) lazım. Bağlantıya tıkla, açılan pencerede kurulumu onayla; sonrasında kendini günceller.

YouTube bir izleme sayfasını, Shorts'u ya da kanal sayfasını açtığında videoyu kendi başlatır, playlist'te de sıradakine kendi geçer. Bu script bunu durdurur. Oynatıcıda videonun küçük resmi tam kalitede görünür, video sen tıklayınca başlar. Önerilen bir videoya tıkladığında da aynısı olur, sıradaki video da tıklamanı bekler. Hiçbir şey kendi kendine oynamadığı için izleme geçmişine de kendi kendine bir şey düşmez. Ana sayfada ve aramada üzerine gelince açılan önizlemelere dokunulmaz. Canlı yayında tıklama, DVR penceresinin başına değil canlı yayının ucuna götürür.

### Scroll kontrolleri

İmleç videonun üzerindeyken scroll yap. Oynatıcı üç sütuna bölünür ve yalnız üstteki üçte ikilik kısım çalışır, alt kısım YouTube'un kendi kontrollerine kalır.

- Sol sütun: oynatma hızı, 0,25x ile 8x arası, 0,25'lik adımlarla. Tıklayınca 1x'e döner.
- Orta sütun: 5 saniye ileri ya da geri sarar. Tıklayınca oynatır ya da duraklatır.
- Sağ sütun: ses, %0 ile %300 arası, %5'lik adımlarla.

Sadece video oynarken çalışır. Duraklatılmışsa scroll sayfayı normal kaydırır. Shorts'ta ve kanal tanıtım videolarında da çalışır.

%100 üstündeki ses, Web Audio API ile yapılan bir güçlendirmedir. 2x üstündeki hızlar doğrudan video elementine yazılır, çünkü YouTube'un kendi oynatıcısı 2x'te durur. Sesi ya da hızı YouTube'un kaydırıcısından, menüsünden veya klavye kısayollarından değiştirirsen script bunu fark eder ve oradan devam eder. Her yeni videoda hız 1x'e döner, %100 üstündeki güçlendirme de sıfırlanır.

### Kalite

Oynatıcının ayarlar menüsünden bir çözünürlüğü bir kez seç, script sonraki her videoda onu uygular. Seçimi ayrıca kilitler; böylece uyarlanabilir akış arabelleğe alırken kaliteyi sessizce değiştirmez. Videoda o çözünürlük yoksa onun altındaki en yüksek olanı kullanır. Otomatik'i seçersen kayıt silinir.

### Bölümler (chapter)

İlerleme çubuğuna orta tıkla, imlecin altındaki bölümün başına atlar. Sadece izleme sayfasında ve bölümü olan videolarda çalışır.

### Küçük resim ön yüklemesi

Kaydırmayı bıraktığında ekrandaki videoların tam boyutlu küçük resimleri arka planda indirilir. Böylece bir videoyu açınca oynatıcıdaki resim hemen görünür. İstemezsen script'in başındaki `PRELOAD_THUMBNAILS` değerini `false` yap.

### Görünüm

Script YouTube'un görünümünde de birkaç şey değiştirir. Yarı saydam oynatıcı katmanları düz renk olur, arka plan bulanıklığı kalkar, ilerleme çubukları düz kırmızıdır: oynatıcıda, küçük resimlerdeki izlendi çubuklarında ve sayfanın üstündeki yükleme çubuğunda. Bu, script'in başındaki `opaqueStyle` bloğudur. Yalnız autoplay kısmını istiyorsan bu bloğu ve hemen altındaki `appendChild(opaqueStyle)` satırını sil.

YouTube sayfasını sık değiştirdiği için bir şey ara sıra bozulabilir. Olursa issue aç.

## Lisans

[MIT](LICENSE)
