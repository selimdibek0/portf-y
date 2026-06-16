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

## Production

```bash
npm run build
npm start
```

Admin paneli ve içerik düzenleme için Node.js sunucusunun çalışması gerekir.
