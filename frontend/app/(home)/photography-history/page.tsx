import { createPageMetadata } from 'lib/metadata';

export const metadata = createPageMetadata({
  title: 'Fotoğraf Tarihinde Bir Yolculuk | otuzaltıpoz',
  description:
    'Fotoğrafçılığın tarihsel gelişimini keşfedin: Camera obscura’dan dijital devrime, önemli anlar, yenilikler ve ana akımlar bu sayfada.',
  path: '/photography-history',
  image: '/photography-history/og-image.png',
});

const PhotographyHistoryPage = () => {
  return (
    <section className="flex flex-1 justify-center py-12">
      <div className="w-full max-w-5xl px-4">
        <div className="mb-12 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tighter text-text-light">
            Fotoğraf Tarihinde Bir Yolculuk
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-base sm:text-lg text-subtle-light">
            Sanat ve bilimin bir karışımı olan fotoğrafçılık, başlangıcından bu yana çarpıcı bir şekilde gelişti. Bu
            sayfa, fotoğraf dünyasını şekillendiren önemli anları, çığır açan yenilikleri ve başlıca akımları
            vurgulamaktadır.
          </p>
        </div>

        <div className="space-y-16">
          {/* İcadın Şafağı */}
          <section>
            <div className="flex flex-col gap-6 md:grid md:grid-cols-2 md:items-center md:gap-8">
              <div className="relative h-64 w-full overflow-hidden rounded-lg shadow-lg md:hidden">
                <img alt="İlk Fotoğraf" className="h-full w-full object-cover" src="/photography-history/1.png" />
              </div>
              <div>
                <h2 className="mb-4 text-3xl font-bold text-text-light">İcadın Şafağı (1800'ler)</h2>
                <p className="text-subtle-light">
                  Fotoğrafın doğuşu, camera obscura ile ilk görüntülerin yakalanmasına dayanan uzun bir deney sürecinin
                  sonucudur. 19. yüzyılın başlarında Joseph Nicéphore Niépce ve Louis Daguerre gibi öncüler, kalıcı
                  görüntüleri sabitlemeyi başararak fotoğrafçılığın temellerini attılar. Bu dönem, fotoğrafın bir
                  bilimsel meraktan sanatsal bir ifade aracına dönüşümünün başlangıcıdır.
                </p>
              </div>
              <div className="relative h-64 w-full overflow-hidden rounded-lg shadow-lg hidden md:block">
                <img alt="İlk Fotoğraf" className="h-full w-full object-cover" src="/photography-history/1.png" />
              </div>
            </div>
          </section>

          {/* Siyah Beyazın Altın Çağı */}
          <section>
            <div className="flex flex-col gap-6 md:grid md:grid-cols-2 md:items-center md:gap-8">
              <div className="relative h-64 w-full overflow-hidden rounded-lg shadow-lg md:order-2">
                <img
                  alt="Siyah Beyaz Fotoğraf"
                  className="h-full w-full object-cover"
                  src="/photography-history/2.png"
                />
              </div>
              <div className="md:order-1">
                <h2 className="mb-4 text-3xl font-bold text-text-light">
                  Siyah Beyazın Altın Çağı (Geç 1800'ler - Erken 1900'ler)
                </h2>
                <p className="text-subtle-light">
                  George Eastman'ın Kodak kameralarını piyasaya sürmesiyle fotoğrafçılık halka indi. Bu dönemde
                  fotoğraf, hem bir belge hem de bir sanat formu olarak kabul görmeye başladı. Piktoryalizm gibi
                  akımlar, fotoğrafın sanatsal potansiyelini vurgularken, fotojurnalizm savaşları ve toplumsal olayları
                  belgeleyerek tarihe tanıklık etti.
                </p>
              </div>
            </div>
          </section>

          {/* Renklerin Yükselişi ve Modern Dönem */}
          <section>
            <div className="flex flex-col gap-6 md:grid md:grid-cols-2 md:items-center md:gap-8">
              <div className="relative h-64 w-full overflow-hidden rounded-lg shadow-lg md:hidden">
                <img
                  alt="Renkli Fotoğrafçılık"
                  className="h-full w-full object-cover"
                  src="/photography-history/3.png"
                />
              </div>
              <div>
                <h2 className="mb-4 text-3xl font-bold text-text-light">
                  Renklerin Yükselişi ve Modern Dönem (1900'ler Ortası)
                </h2>
                <p className="text-subtle-light">
                  Kodachrome gibi renkli filmlerin icadı, fotoğrafçılıkta yeni bir devrim yarattı. Renk, dünyaya bakışı
                  değiştirdi ve reklamcılıktan aile albümlerine kadar her alanda kullanılmaya başlandı. Leica gibi 35mm
                  kameraların yaygınlaşması, fotoğrafçılara daha fazla hareketlilik ve esneklik kazandırarak "an"ı
                  yakalama felsefesini doğurdu.
                </p>
              </div>
              <div className="relative h-64 w-full overflow-hidden rounded-lg shadow-lg hidden md:block">
                <img
                  alt="Renkli Fotoğrafçılık"
                  className="h-full w-full object-cover"
                  src="/photography-history/3.png"
                />
              </div>
            </div>
          </section>

          {/* Dijital Devrim ve Gelecek */}
          <section>
            <div className="flex flex-col gap-6 md:grid md:grid-cols-2 md:items-center md:gap-8">
              <div className="relative h-64 w-full overflow-hidden rounded-lg shadow-lg md:order-2">
                <img alt="Dijital Kamera" className="h-full w-full object-cover" src="/photography-history/4.png" />
              </div>
              <div className="md:order-1">
                <h2 className="mb-4 text-3xl font-bold text-text-light">
                  Dijital Devrim ve Gelecek (Geç 1900'ler - Günümüz)
                </h2>
                <p className="text-subtle-light">
                  Dijital kameraların ve akıllı telefonların ortaya çıkmasıyla fotoğrafçılık kökten değişti.
                  Görüntülerin anında paylaşılabilir ve düzenlenebilir olması, fotoğraf üretimini ve tüketimini
                  demokratikleştirdi. Günümüzde yapay zeka ve hesaplamalı fotoğrafçılık gibi teknolojiler, fotoğrafın
                  sınırlarını zorlamaya devam ediyor.
                </p>
              </div>
            </div>
          </section>

          {/* Ana Akımlar ve Fotoğraf Tarzları */}
          <section className="mt-16">
            <h2 className="mb-8 text-center text-3xl font-bold text-text-light">Ana Akımlar ve Fotoğraf Tarzları</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: 'Portre Fotoğrafçılığı',
                  desc: 'İnsanların yüz ifadelerini ve karakterlerini yakalamaya odaklanır.',
                },
                { title: 'Manzara Fotoğrafçılığı', desc: 'Doğal veya kentsel manzaraların güzelliğini belgeler.' },
                { title: 'Sokak Fotoğrafçılığı', desc: 'Kamusal alanlardaki anlık ve samimi anları yakalar.' },
                {
                  title: 'Belgesel Fotoğrafçılık',
                  desc: 'Gerçek olayları ve durumları objektif bir şekilde kaydeder.',
                },
                { title: 'Moda Fotoğrafçılığı', desc: 'Giyim ve aksesuarları estetik bir biçimde sunar.' },
                {
                  title: 'Soyut Fotoğrafçılık',
                  desc: 'Renk, form ve doku gibi unsurlarla görsel kompozisyonlar oluşturur.',
                },
              ].map((item) => (
                <div key={item.title} className="rounded-lg bg-white p-6 text-center shadow-sm">
                  <h3 className="font-bold text-text-light">{item.title}</h3>
                  <p className="mt-2 text-sm text-subtle-light">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
};

export default PhotographyHistoryPage;
