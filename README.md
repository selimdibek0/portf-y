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

## Render (Önerilen — site + admin birlikte)

Render hem portföy sitesini hem admin panelini tek serviste çalıştırır.

### Render ayarları

| Alan | Değer |
|------|--------|
| **Language** | Node |
| **Build Command** | `npm ci --include=dev && npm run build` |
| **Start Command** | `npm start` |
| **Health Check Path** | `/api/health` |

`render.yaml` dosyası bu ayarları otomatik uygular (Blueprint deploy).

### Environment Variables (Render paneli)

| Key | Değer | Zorunlu |
|-----|--------|---------|
| `ADMIN_PASSWORD` | Admin giriş şifreniz (min. 8 karakter) | **Evet** |
| `NODE_ENV` | `production` | Evet (Render genelde otomatik ekler) |
| `PORT` | — | **Eklemeyin** — Render otomatik atar |

**Add from .env** ile yapıştıracaksanız sadece şunu kullanın:

```env
ADMIN_PASSWORD=guclu_sifreniz_buraya
NODE_ENV=production
```

> `PORT` satırını Render'a eklemeyin; platform kendi portunu verir.

### Canlı adresler (Render URL'niz `https://portfoy-xxxx.onrender.com` ise)

- **Site:** `https://portfoy-xxxx.onrender.com/`
- **Admin:** `https://portfoy-xxxx.onrender.com/admin/`

### Önemli notlar

- **Ücretsiz planda** sunucu 15 dk hareketsizlikten sonra uyur; ilk ziyaret 30–60 sn sürebilir.
- **Yüklenen dosyalar** (fotoğraf vb.) redeploy sonrası silinebilir (geçici disk). Kalıcı depolama için Render Disk ekleyin veya görselleri GitHub'a commit edin.
- Netlify yerine Render kullanıyorsanız admin paneli de çalışır; ayrı API sunucusu gerekmez.

## Netlify (Sadece statik site)

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
