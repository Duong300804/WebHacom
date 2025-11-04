import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { filterBanners } from '../../../../../api/APIs/bannerApi';

export default function CategorySlider() {
  const { categoryId } = useParams();
  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [loading, setLoading] = useState(true);

  const categoryPositions = {
    11: 'BANNER_LAPTOP',  // Laptop
    12: 'BANNER_PC',      // PC
    13: 'BANNER_LINH_KIEN', // Linh kiện
    14: 'BANNER_MAN_HINH', // Màn hình
    15: 'BANNER_PHU_KIEN', // Phụ kiện
    60: 'BANNER_TAN_NHIET', // Tản nhiệt
    70: 'BANNER_LED_FAN',  // LED Fan
    80: 'BANNER_GAMING_GEAR', // Gaming Gear
    108: 'BANNER_GAMING_CHAIR', // Gaming Chair
    118: 'BANNER_HEADPHONE', // Headphone
    129: 'BANNER_SPEAKER',  // Speaker
    141: 'BANNER_ROUTER',   // Router
  };

  const bannerPosition = categoryPositions[parseInt(categoryId)] || 'BANNER_LAPTOP';

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const filterRequest = {
          position: bannerPosition,
          isActive: true,
        };
        const response = await filterBanners(filterRequest);
        if (response.status === 200) {
          setSlides(response.data);
          setCurrentIndex(0);
        }
      } catch (error) {
        console.error('Lỗi khi load banner cho danh mục:', error);
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchBanners();
    }
  }, [categoryId, bannerPosition]);

  useEffect(() => {
    if (slides.length > 1 && !isPaused) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % slides.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [slides.length, isPaused]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  if (loading || slides.length === 0) {
    return (
      <div className="h-64 md:h-80 bg-gray-200 flex items-center justify-center rounded-lg mb-4">
        {loading ? 'Đang tải banner...' : 'Không có banner cho danh mục này'}
      </div>
    );
  }

  return (
    <div className="w-full mb-4">
      <div className="relative h-64 md:h-80 overflow-hidden w-full rounded-lg">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {slides.map((slide) => (
            <div key={slide.id} className="flex-shrink-0 w-full h-full relative">
              <a href={slide.link || '#'} className="block">
                <img
                  src={`${import.meta.env.VITE_IMAGE_BASE_URL}${slide.imageUrl}`}
                  alt={slide.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              </a>
            </div>
          ))}
        </div>

        {/* Nút prev */}
        <button
          onClick={prevSlide}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full shadow-md flex items-center justify-center hover:bg-white transition-all opacity-70 hover:opacity-100 z-10"
        >
          <FaChevronLeft className="text-blue-600 text-sm" />
        </button>

        {/* Nút next */}
        <button
          onClick={nextSlide}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full shadow-md flex items-center justify-center hover:bg-white transition-all opacity-70 hover:opacity-100 z-10"
        >
          <FaChevronRight className="text-blue-600 text-sm" />
        </button>
      </div>

      {/* Dots indicator bên dưới banner */}
      <div className="flex justify-center mt-1 space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
    </div>
  );
}