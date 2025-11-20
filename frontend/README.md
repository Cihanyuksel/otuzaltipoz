# Otuzaltıpoz - Frontend

Bu klasör, Otuzaltıpoz projesinin kullanıcı arayüzü kodlarını içerir. Next.js 13+ (App Router) ve TypeScript kullanılarak geliştirilmiştir.

## 🛠️ Teknolojiler

- **Framework:** Next.js (App Router)
- **Dil:** TypeScript
- **Stil ve Animasyon:** Tailwind CSS, Framer-Motion
- **HTTP İstemcisi:** Axios (`lib/axiosInstance.ts` üzerinden yapılandırılmış)
- **State Yönetimi & Data Fetching:** React Query (TanStack Query)
- **İkonlar:** React Icons
- **Form Yönetimi:** React Hook Form

## ⚙️ Kurulum

1.  **Bağımlılıkları Yükleyin:**

    ```bash
    npm install
    ```

2.  **Çevresel Değişkenleri Ayarlayın:**
    Frontend kök dizininde `.env.local` adında bir dosya oluşturun ve backend API adresinizi tanımlayın:

    ```env
    server dev
    NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1

    server test
    NEXT_PUBLIC_API_URL=http://localhost:4001/api/v1
    ```

3.  **Uygulamayı Başlatın:**
    - **Geliştirme Modu:**

      ```bash
      npm run dev
      ```

      Tarayıcınızda `http://localhost:3000` adresine gidin.

    - **Production Build:**
      ```bash
      npm run build
      npm start
      ```

## 🧩 Temel Özellikler ve Sayfalar

- **(Home) `/`**: Hero bölümü, keşfet kartları ve popüler fotoğraflar akışı (gün, hafta, ay, tüm zamanlar).
- **(Auth) `/login` & `/register`**: Kullanıcı giriş ve kayıt sayfaları.
- **(Photos) `/photos`**: Tüm fotoğrafların listelendiği, filtrelenebilir galeri
- **(Detail) `/photos/[id]`**: Fotoğraf detay, yorum yapma, beğenme ve puanlama alanı.
- **(Upload) `/photo-upload`**: Sürükle-bırak desteği ile fotoğraf yükleme arayüzü.
- **(Profile) `/profile`**: Kullanıcının kendi profili ve ayarları.
- **(Info) `/iconic-cameras` & `/photographers`**: Bilgilendirici statik içerik sayfaları.

### 📜 Sonsuz Kaydırma (Infinite Scroll)

- Fotoğraflar **sayfa başına 10 adet** olacak şekilde yüklenir.
- Kullanıcı sayfayı aşağı kaydırdıkça, yeni fotoğraflar otomatik olarak yüklenir.
- Bu sayede kullanıcı **sayfa yenilemeden** tüm fotoğraflara erişebilir.
- Performans optimizasyonu için backend, her istekte **limit = 10** ve **skip/offset** parametrelerini kullanır.

**Örnek kullanım:**

```http
GET /photos?limit=10&offset=20
```

## 📁 Klasör Yapısı (App Router)

- `app/`: Next.js App Router sayfa yapısı. Parantezli klasörler `(home)`, `(auth)` route gruplandırması için kullanılmıştır.
- `components/`: Tekrar kullanılabilir UI bileşenleri (Header, Modals, PhotoCard vb.).
- `hooks/`: Özel React hook'ları (`usePhotoApi`, `useAuthApi` vb.).
- `services/`: API isteklerini yöneten servis katmanı.
- `context/`: React Context API (AuthContext, PhotoContext).
- `lib/`: Yardımcı fonksiyonlar ve konfigürasyonlar.
- `public/`: Statik görseller ve ikonlar.
