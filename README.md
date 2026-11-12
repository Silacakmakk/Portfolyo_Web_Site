# Sıla Çakmak portfolyo

Gümüş ve pembe yansımalı akışkan yüzey; beş bölümlü, yatay gezilebilir kişisel portfolyo.

## Geliştirme

Node.js 22.12 veya üzeri ile:

```sh
npm install
npm run dev
```

```sh
npm run typecheck
npm test
npm run build
npm run test:e2e
```

Tarayıcı testleri Playwright Chromium kullanır. Tarayıcı kurulu değilse `npx playwright install chromium` çalıştırın. Mevcut Chromium tabanlı bir tarayıcı için `PLAYWRIGHT_CHROMIUM_EXECUTABLE` tam dosya yoluyla ayarlanabilir.

## Mimari

- `src/app`: uygulama ve gezinme durumu.
- `src/content`: CV’ye dayalı portfolyo verileri.
- `src/graphics`: Three.js yüzeyi ve GLSL shader; kare bazındaki veriler React durumundan ayrıdır.
- `src/navigation`: bölüm adresleri, klavye, yatay kaydırma ve dokunma.
- `src/transitions`: son seçimi esas alan GSAP geçişleri.
- `src/sections`: metinler, proje ayrıntıları ve iletişim.
- `src/styles`: yerel fontlar ve ortak tasarım değişkenleri.
- `docs/design-reference.html`: kabul edilen tasarımın sohbet prototipi; üretim uygulaması değildir.

Üretim çıktısı `dist/` altında oluşur. Bölüm adresleri `#hakkimda`, `#deneyim`, `#egitim`, `#projeler`, `#iletisim` biçimindedir. Statik barındırma yeterlidir.

İlerleme, test sonuçları ve açık kontroller için [AUDIT.md](./AUDIT.md) dosyasını izleyin. İçerikler paylaşılan CV’den aktarılmıştır; gerçek proje görselleri ve projeye özel bağlantılar sağlandığında eklenebilir. Ham CV dosyası veya telefon numarası üretim paketine eklenmemiştir.
