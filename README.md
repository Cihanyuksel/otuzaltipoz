# 📸 Otuzaltıpoz

Otuzaltıpoz, fotoğraf tutkunlarının çalışmalarını sergileyebileceği, diğer fotoğrafçılarla etkileşime girebileceği ve ikonik kameralar/fotoğrafçılar hakkında bilgi edinebileceği kapsamlı bir fotoğrafçılık topluluk platformudur.

## 🚀 Proje Mimarisi

- **Backend:** Node.js ve Express.js tabanlı RESTful API.
- **Frontend:** Next.js ve React tabanlı modern kullanıcı arayüzü.

## 🛠️ Kullanılan Temel Teknolojiler

| Alan              | Teknoloji            | Açıklama                                                   |
| :---------------- | :------------------- | :--------------------------------------------------------- |
| **Dil**           | TypeScript           | Hem frontend hem backend tarafında tip güvenliği.          |
| **Backend**       | Node.js, Express     | Hızlı ve ölçeklenebilir sunucu mimarisi.                   |
| **Veritabanı**    | MongoDB              | Esnek ve performanslı NoSQL veritabanı.                    |
| **Dokümantasyon** | Swagger UI           | API uç noktalarını (Endpoints) görüntüleme ve test etme.   |
| **Frontend**      | Next.js (App Router) | SEO dostu, sunucu taraflı render (SSR) destekli framework. |
| **Stil**          | Tailwind CSS         | Hızlı ve modern UI tasarımı.                               |
| **Depolama**      | Cloudinary           | Fotoğraf yükleme ve optimizasyonu.                         |

# 📂 Proje Yapısı

## Otuzaltıpoz — Backend & Frontend

### 1. Kurulum ve Başlatma

```bash
git clone https://github.com/cihanyuksel/otuzaltipoz.git
cd otuzaltipoz

Bu dosyalarda ortam değişkenleri, veritabanı bağlantı ayarları ve çalıştırma komutları yer almaktadır.
Projeyi yerel ortamınızda çalıştırmak için hem backend hem de frontend servislerini ayağa kaldırmanız gerekmektedir.

Detaylı kurulum talimatları için ilgili klasörlerdeki README dosyalarına göz atın:
```

- [Backend README](https://github.com/cihanyuksel/otuzaltipoz/blob/main/backend/README.md)
- [Frontend README](https://github.com/cihanyuksel/otuzaltipoz/blob/main/frontend/README.md)

> ⚠️ **Bilgilendirme:** Backend servisi kaynak tasarrufu amacıyla kullanılmadığında uyku moduna geçmektedir. Bu nedenle, **ilk açılışta verilerin yüklenmesi 20-30 saniye sürebilir.** Lütfen bekleyiniz.

Projeyi yerel ortamınızda çalıştırmak için hem backend hem de frontend servislerini ayrı ayrı ayağa kaldırmanız gerekmektedir.

---

## 2. ✨ Özellikler

### Kullanıcı Yönetimi

- Kayıt (Signup)
- Giriş (Login)
- Email doğrulama (Email Verification)
- Şifre sıfırlama (Password Reset)
-
- **Kullanıcı Tipleri:**
  - Normal Kullanıcı
  - Moderatör – içerik denetleme yetkisi
  - Admin – tüm yönetimsel işlemleri yapabilme yetkisi

### Fotoğraf Paylaşımı

- Fotoğraf yükleme
- Fotoğraf düzenleme
- Fotoğraf silme

### Etkileşim

- Beğeni (Like)
- Yorum (Comment)
- Puanlama (Rating)

### Kategoriler

- Fotoğrafları kategoriye göre filtreleme
- Kategori bazlı görüntüleme

### Fotoğraf Arama

- Kategoriye göre arama
- Fotoğraf başlıklarına göre arama

### Keşfet

- Ünlü fotoğrafçılar hakkında bilgi sayfaları
- Kameralar ve ekipmanlara dair bilgi içerikleri

### Profil

- Kullanıcı profil sayfası
- Kullanıcıya ait yüklenen fotoğraflar
- Kullanıcının beğendiği fotoğraflar
- Biyografi düzenleme

---

## 3. Notlar

- Her servis kendi bağımsız yapılandırmasına sahiptir (backend & frontend).
- `.env` dosyalarını doğru şekilde oluşturduğunuzdan emin olun.
- Development ve Production ortamları için farklı ayarlar kullanılmalıdır.
