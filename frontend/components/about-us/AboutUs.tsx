import Image from 'next/image';

export default function AboutUs() {
  return (
    <>
      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight mb-4">Hakkımızda</h1>
              <p className="max-w-3xl mx-auto text-lg text-gray-600">
                Anılarınızı paylaşmanın ve ilham almanın en güzel yolu. PhotoShare, görsel hikaye anlatıcılarını bir araya getiren modern ve minimalist bir platformdur.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
              <div className="space-y-6 text-gray-700 leading-relaxed">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">Hikayemiz</h2>
                  <p>
                    2020'de bir grup tutkulu fotoğrafçı ve teknoloji meraklısı tarafından kurulan PhotoShare, ortak bir vizyondan doğdu: görsel ifade için daha kapsayıcı ve dinamik bir platform oluşturmak. Sadece olağanüstü fotoğrafları sergilemekle kalmayıp, aynı zamanda yaratıcılar arasında anlamlı etkileşimleri ve işbirliklerini teşvik eden bir alana olan ihtiyacı fark ettik.
                  </p>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">Değerlerimiz</h2>
                  <ul className="space-y-2 list-disc list-inside text-gray-700">
                    <li><span className="font-semibold">Yaratıcılık:</span> Özgünlüğü ve farklı sanatsal tarzları destekliyoruz.</li>
                    <li><span className="font-semibold">Topluluk:</span> Bağlantı ve işbirliği için destekleyici bir ortam sağlıyoruz.</li>
                    <li><span className="font-semibold">Kapsayıcılık:</span> Her kökenden yaratıcıyı memnuniyetle karşılıyor ve kutluyoruz.</li>
                    <li><span className="font-semibold">Yenilikçilik:</span> Kullanıcı deneyimini geliştirmek ve yaratıcıları güçlendirmek için sürekli gelişiyoruz.</li>
                  </ul>
                </div>
              </div>
              <div className="w-full h-full">
                <div className="w-full h-full relative aspect-w-4 aspect-h-3">
                  <Image
                    src="/images/our-story.jpg" // Resim yolunu projenize göre güncelleyin
                    alt="Our Story"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                  />
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-8 md:p-12 text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Size Neler Sunuyoruz?</h2>
              <p className="max-w-3xl mx-auto text-gray-600 mb-8">
                PhotoShare, fotoğrafçılık yolculuğunuzu bir üst seviyeye taşımak için tasarlanmış bir dizi araç ve özellik sunar:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="flex flex-col items-center">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-[#e6a84c]/20 text-[#e6a84c] mb-4">
                    <span className="material-symbols-outlined">photo_library</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Etkileyici Galeriler</h3>
                  <p className="text-gray-600 text-sm">Çalışmalarınızı görsel olarak büyüleyici düzenlerde sergileyin.</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-[#e6a84c]/20 text-[#e6a84c] mb-4">
                    <span className="material-symbols-outlined">thumb_up</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Etkileşimli Topluluk</h3>
                  <p className="text-gray-600 text-sm">Yorumlar, beğeniler ve paylaşımlarla diğer yaratıcılarla bağlantı kurun.</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-[#e6a84c]/20 text-[#e6a84c] mb-4">
                    <span className="material-symbols-outlined">collections_bookmark</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Özel Koleksiyonlar</h3>
                  <p className="text-gray-600 text-sm">Ekibimiz ve topluluğumuz tarafından hazırlanan temalı galerileri keşfedin.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
     
    </>
  );
}