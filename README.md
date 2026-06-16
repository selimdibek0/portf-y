# Portföy Sitesi + Admin Panel

## Başlatma

```bash
npm install
npm run dev
```

- **Site:** http://localhost:5173
- **Admin Panel:** http://localhost:5173/admin/
- **API:** http://localhost:3001

## Admin Girişi

**Adres:** http://localhost:5173/admin/

Şifre `.env` dosyasındaki `ADMIN_PASSWORD` ile belirlenir.

İlk kurulumda şifre yoksa admin panelinde **Şifre Oluştur** ekranı açılır.

Şifreyi panel içinden **Ayarlar → Şifre Değiştir** bölümünden de güncelleyebilirsiniz.

## Admin Panel Özellikleri

- **Profil & Hero** — ad, fotoğraf, metrikler, iletişim, CV yükleme
- **Zaman Tüneli** — ekle / sil / sırala / TR-EN metinler
- **Projeler** — vaka analizi metinleri, ekran görüntüleri, demo/GitHub linkleri
- **Yetkinlikler** — ekle / sil / düzenle
- **Kütüphane** — okuma listesi yönetimi
- **Medya** — görsel ve PDF yükleme, URL kopyalama
- **Site Metinleri** — navigasyon ve bölüm başlıkları TR/EN
- **Ayarlar** — şifre değiştir, JSON yedekle/geri yükle

Değişiklikler otomatik kaydedilir (1.5 sn gecikme) veya **Kaydet** butonuyla manuel kaydedilir.

## Dosya Yapısı

| Dosya | Açıklama |
|-------|----------|
| `data/site.json` | Tüm site içeriği |
| `public/uploads/` | Yüklenen görseller |
| `public/content/site.json` | Statik yedek (build için) |

## Production (Node.js sunucusu)

```bash
npm run build
npm start
```

Admin paneli ve içerik düzenleme için Node.js sunucusunun çalışması gerekir.

## Netlify (Canlı site)

Netlify **statik site** barındırır. Portföy sayfası çalışır; **admin paneli Netlify'da çalışmaz** (Express API gerekir).

### Netlify ayarları

| Ayar | Değer |
|------|--------|
| Build command | `npm run build` |
| Publish directory | `dist` |

Bu ayarlar `netlify.toml` dosyasında tanımlıdır. GitHub'dan deploy ediyorsanız otomatik uygulanır.

### `.env` Netlify'da gerekli mi?

**Hayır** — canlı portföy sitesi için `.env` dosyasına ihtiyaç yoktur. İçerik `public/content/site.json` dosyasından yüklenir.

`.env` yalnızca **yerel geliştirme** ve **admin paneli** içindir:

```env
ADMIN_PASSWORD=your_password
PORT=3001
```

Admin'de değişiklik yaptıktan sonra site Netlify'da güncellensin diye:

1. Yerelde admin'den düzenleyin (veya `data/site.json` düzenleyin)
2. `public/content/site.json` otomatik güncellenir (kaydetme sırasında)
3. GitHub'a push edin → Netlify yeniden deploy eder

Netlify'da env eklemek isterseniz: **Site settings → Environment variables** — ancak mevcut statik yapıda bu değişkenler kullanılmaz.

### Site düz HTML görünüyorsa

Kaynak kod doğrudan yayınlanmış demektir. **Publish directory mutlaka `dist` olmalı** ve build çalışmalıdır. `netlify.toml` ekledikten sonra **Deploys → Trigger deploy → Clear cache and deploy site** yapın.
