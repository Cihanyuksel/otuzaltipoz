# 📸 Otuzaltıpoz - Backend

Otuzaltıpoz projesinin sunucu tarafı (API), fotoğrafçılık topluluğu platformunun veri yönetimi, kimlik doğrulama ve medya işlemlerini yürütmek için Node.js, Express ve TypeScript ile geliştirilmiştir.

## 🚀 Özellikler

- **Kimlik Doğrulama**: JWT (JSON Web Token) tabanlı güvenli giriş, kayıt olma ve email doğrulama.
- **Veritabanı**: MongoDB & Mongoose ile veri modelleme.
- **Medya Yönetimi**: Cloudinary entegrasyonu ile fotoğraf yükleme ve optimizasyon.
- **Güvenlik**: Rate limiting (istek sınırlama), Helmet (HTTP başlık güvenliği), CORS yapılandırması.
- **API Dokümantasyonu**: Swagger UI ile interaktif API test arayüzü.
- **E-posta Servisi**: Nodemailer ile şifre sıfırlama ve doğrulama mailleri.

## 🛠️ Teknolojiler

- **Runtime**: Node.js
- **Framework**: Express.js
- **Dil**: TypeScript
- **Veritabanı**: MongoDB
- **Medya Depolama**: Cloudinary
- **Dokümantasyon**: Swagger

## 📂 Kurulum ve Çalıştırma

Projeyi yerel ortamınızda çalıştırmak için aşağıdaki adımları takip edin.

### 1. Gereksinimler

- Node.js (v18+)
- MongoDB (Yerel veya Atlas URI)

### 2. Bağımlılıkları Yükleyin

Proje dizinine gidin ve gerekli paketleri yükleyin:

```bash
npm install
```

### 3. Çevresel Değişkenleri (.env) Ayarlayın

Kök dizinde `.env` adında bir dosya oluşturun ve aşağıdaki şablona göre doldurun. (Örnek: `.env.example` dosyasından faydalanabilirsiniz).

```env
.env.example dosyasını inceleyebilirsiniz
```

### 4. Uygulamayı Başlatın

**Geliştirme Modu** (Hot Reload ile):

```bash
npm run dev
```

**Production Modu** (Build alıp çalıştırma):

```bash
npm run build
npm run start:prod
```

**Test Ortamı**:

```bash
npm run start:test
```

## 📖 API Dokümantasyonu

Sunucu çalışmaya başladığında, tarayıcınızdan aşağıdaki adrese giderek tüm API uçlarını (endpoint) görebilir ve test edebilirsiniz:

```
dev
http://localhost:4000/api/v1/api-docs

test
http://localhost:4001/api/v1/api-docs
```

> **Not**: Production ortamında bu sayfaya erişim şifreli olabilir, `.env` dosyasındaki `SWAGGER_USER` ayarlarını kontrol edin.

Test ortamı için test_db kullanılmıştır.

## 🧪 Scriptler

- `npm run dev`: Uygulamayı geliştirme modunda başlatır.
- `npm run build`: TypeScript kodlarını JavaScript'e derler.
- `npm start:test`: Derlenmiş uygulamayı başlatır.
