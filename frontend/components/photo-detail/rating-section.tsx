import React, { useEffect, useRef, useState } from 'react';
import { FiCheck } from 'react-icons/fi';
import { AnimatePresence, motion } from 'framer-motion';
import { IoIosStar, IoIosStarOutline, IoMdHeartEmpty } from 'react-icons/io';

export default function RatingSection() {
  const [rating, setRating] = useState(0);
  const [showMessage, setShowMessage] = useState(false);
  const starRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (starRef.current && !starRef.current.contains(event.target as Node)) {
        setRating(0); // dış tıklama
      }
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const handleSubmit = () => {
    console.log('Rating sent to backend:', rating);
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 1500); // 1.5s sonra kaybolur
  };

  return (
    <div className="flex flex-col items-start gap-3 md:items-end">
      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-bold text-gray-900">4.5</span>
        <span className="text-sm text-gray-500">/ 5</span>
      </div>

      <p className="text-sm text-gray-500">From 120 reviews</p>

      <div className="flex items-center gap-4">
        <button className="flex items-center gap-1 rounded-md bg-gray-100 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-200">
          <span className="material-symbols-outlined text-base">
            <IoMdHeartEmpty />
          </span>
          120
        </button>
      </div>

      {/* Star Rating Input */}
      <div ref={starRef} className="mt-2 flex flex-row-reverse items-center justify-end w-full flex-shrink-0">
        <div className="relative flex items-center">
          {rating > 0 && (
            <motion.button
              onClick={handleSubmit}
              whileTap={{ scale: 0.9, backgroundColor: '#dcfce7' }}
              whileHover={{ scale: 1.1, rotate: 360 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{
                duration: 0.2,
                rotate: { duration: 0.45 },
              }}
              className="relative ml-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-gray-300 text-green-500 overflow-hidden group"
            >
              <FiCheck size={25} className="relative z-10" />
              <motion.div
                initial={{ scale: 0, opacity: 0.5 }}
                animate={{ scale: rating > 0 ? 1 : 0, opacity: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="absolute inset-0 rounded-full bg-green-200"
              />
            </motion.button>
          )}

          <AnimatePresence>
            {showMessage && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="absolute left-1/2 top-full mt-1 -translate-x-1/2 rounded bg-green-100 px-2 py-1 text-sm text-green-800 shadow"
              >
                Oy verildi!
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="star-rating flex flex-row-reverse">
          {[5, 4, 3, 2, 1].map((n) => (
            <label key={n} className="cursor-pointer">
              <input type="radio" name="rating" value={n} onChange={() => setRating(n)} className="hidden" />
              <motion.div
                whileHover={{ scale: 1.15 }} // Üzerine gelince biraz daha büyür
                whileTap={{ scale: 0.85 }} // Tıklayınca daha belirgin şekilde küçülür
                animate={{ scale: n === rating ? 1.2 : 1 }} // Seçilen yıldıza özel bir "pop" efekti
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                {n <= rating ? (
                  <IoIosStar color="gold" size={30} /> // Seçilen yıldızın içi dolu olur
                ) : (
                  <IoIosStarOutline color="gray" size={30} /> // Diğer yıldızların içi boş kalır
                )}
              </motion.div>
            </label>
          ))}
        </div>

        <p>{rating}</p>
        <p className="mr-2 flex-shrink-0 text-sm font-medium text-gray-600">Rate this photo</p>
      </div>
    </div>
  );
}
