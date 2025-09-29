import Image from 'next/image';
import React from 'react';
import { FaHeart, FaCommentAlt } from 'react-icons/fa'; 
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

const popularPhotos = [
  { id: 1, src: '/photographers-portfolio/ara-guler/afrodisias.jpg', likes: '1.2k', comments: '345' },
  { id: 2, src: '/photographers-portfolio/ara-guler/istanbul-3.jpg', likes: '980', comments: '210' },
  { id: 3, src: '/photographers-portfolio/sabit-kalfagil/2.jpg', likes: '850', comments: '180' },
  { id: 4, src: '/photographers-portfolio/ara-guler/istanbul-1.jpg', likes: '720', comments: '150' },
  { id: 5, src: '/photographers-portfolio/sabit-kalfagil/3.jpeg', likes: '720', comments: '150' },
  { id: 6, src: '/photographers-portfolio/sabit-kalfagil/4.jpeg', likes: '720', comments: '150' },
  { id: 7, src: '/photographers-portfolio/sabit-kalfagil/5.jpeg', likes: '720', comments: '150' },
  { id: 8, src: '/photographers-portfolio/sabit-kalfagil/6.jpeg', likes: '720', comments: '150' },
  { id: 9, src: '/photographers-portfolio/sabit-kalfagil/7.jpeg', likes: '720', comments: '150' },
  { id: 10, src: '/photographers-portfolio/sabit-kalfagil/8.jpg', likes: '720', comments: '150' },
];

const PopularPhotosSeciton = () => {
  return (
    <section className="py-16 sm:py-24 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">Popüler Fotoğraflar</h2>
          <p className="mt-4 text-lg text-gray-600">En çok beğenilen ve yorumlanan fotoğraflar.</p>
        </div>

        {/* SWIPER CONTAINER */}
        <div className="relative">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={18} 
            slidesPerView={1} 
            navigation
            loop={true} 
            autoplay={{
                delay: 3000, 
                disableOnInteraction: false,
            }}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 24,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 24,
              },
            }}
            className="popular-photos-swiper"
          >
            {popularPhotos.map((photo) => (
              <SwiperSlide key={photo.id}>
                <div className="group relative overflow-hidden rounded-lg aspect-square">
                  <Image
                    alt={`Popüler Fotoğraf ${photo.id}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    src={photo.src}
                    width={500}
                    height={500} 
                  />
                  {/* Hover Efekti */}
                  <div className="absolute inset-0 bg-opacity-0 group-hover:bg-black/60 transition-all duration-300 flex items-center justify-center">
                    <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex items-center gap-1 text-white">
                        <FaHeart className="text-lg" />
                        <span>{photo.likes}</span>
                      </div>
                      <div className="flex items-center gap-1 text-white">
                        <FaCommentAlt className="text-lg" />
                        <span>{photo.comments}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default PopularPhotosSeciton;