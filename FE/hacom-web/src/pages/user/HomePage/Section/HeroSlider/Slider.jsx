import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'; 
import SidebarCategoryMenu from './SidebarCategoryMenu';
import { filterBanners } from '../../../../../api/APIs/bannerApi'; 

const Slider = () => {
  const [slides, setSlides] = useState([]); 
  const [rightBanners, setRightBanners] = useState([]); 
  const [bottomBanners, setBottomBanners] = useState([]); 
  const [generalBanners, setGeneralBanners] = useState([]); 
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0); 
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchBanners = async (position, setState, limit) => {
      try {
        const filterRequest = {
          position: position,
          isActive: true, 
        };
        const response = await filterBanners(filterRequest);
        if (response.status === 200) {
          setState(response.data.slice(0, limit));
        }
      } catch (error) {
        console.error(`Lỗi khi load banner ${position}:`, error);
      }
    };

    fetchBanners('SLIDE_TRANG_CHU', setSlides, Infinity); 
    fetchBanners('BANNER_PHAI', setRightBanners, 2); 
    fetchBanners('BANNER_DUOI', setBottomBanners, 3); 
    fetchBanners('BANNER', setGeneralBanners, 4);

    setLoading(false);
  }, []);

  useEffect(() => {
    if (slides.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlideIndex((prevIndex) =>
          prevIndex === slides.length - 1 ? 0 : prevIndex + 1
        );
      }, 4000); 
      return () => clearInterval(interval); 
    }
  }, [slides]);

  const nextSlide = () => {
    setCurrentSlideIndex((prevIndex) =>
      prevIndex === slides.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlideIndex((prevIndex) =>
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  };

  if (loading) {
    return <div className="text-center py-8">Đang tải...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      {/* Flex chính: Cột trái danh mục + Cột phải slider + banner */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Cột trái: Menu danh mục */}
        <div className="w-full md:w-1/5 relative">
          <SidebarCategoryMenu/>
        </div>

        {/* Cột phải: Slider + Banner phải + Banner dưới */}
        <div className="w-full md:w-4/5 flex flex-col gap-4">
          {/* Slider + Banner phải */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Slider */}
            <div className="w-full md:w-2/3 relative">
              {slides.length > 0 ? (
                <div className="relative h-full overflow-hidden rounded-lg">
                  {slides.map((slide, index) => (
                    <img
                      key={slide.id}
                      src={`${import.meta.env.VITE_IMAGE_BASE_URL}${slide.imageUrl}`}
                      alt={slide.title}
                      className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${
                        index === currentSlideIndex ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                  ))}
                  <button
                    onClick={prevSlide}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-gray-200 text-black p-2 rounded-md hover:bg-gray-300 hover:opacity-80 hover:text-red-600 transition-all"
                  >
                    <FaChevronLeft className="text-xl" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-200 text-black p-2 rounded-md hover:bg-gray-300 hover:opacity-80 hover:text-red-600 transition-all"
                  >
                    <FaChevronRight className="text-xl" />
                  </button>
                </div>
              ) : (
                <div className="h-64 md:h-80 bg-gray-200 flex items-center justify-center rounded-lg">
                  Không có slide
                </div>
              )}
            </div>

            {/* Banner phải */}
            <div className="w-full md:w-1/3 flex flex-col gap-4">
              {rightBanners.map(banner => (
                <a key={banner.id} href={banner.link || '#'} className="block">
                  <img
                    src={`${import.meta.env.VITE_IMAGE_BASE_URL}${banner.imageUrl}`}
                    alt={banner.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </a>
              ))}
              {rightBanners.length < 2 && (
                <div className="h-32 md:h-40 bg-gray-200 flex items-center justify-center rounded-lg">
                  Không có banner
                </div>
              )}
            </div>
          </div>

          {/* 3 Banner dưới (ngang, chỉ nằm dưới slider + banner phải) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {bottomBanners.map(banner => (
              <a key={banner.id} href={banner.link || '#'} className="block">
                <img
                  src={`${import.meta.env.VITE_IMAGE_BASE_URL}${banner.imageUrl}`}
                  alt={banner.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              </a>
            ))}
            {bottomBanners.length < 3 && (
              <div className="h-32 md:h-40 bg-gray-200 flex items-center justify-center rounded-lg col-span-1">
                Không có banner
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4 Banner chung (ngang) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
        {generalBanners.map(banner => (
          <a key={banner.id} href={banner.link || '#'} className="block transform transition duration-300 hover:-translate-y-2 hover:scale-105">
            <img
              src={`${import.meta.env.VITE_IMAGE_BASE_URL}${banner.imageUrl}`}
              alt={banner.title}
              className="w-full h-full object-cover rounded-lg shadow-md"
            />
          </a>
        ))}
        {generalBanners.length < 4 && (
          <div className="h-32 md:h-40 bg-gray-200 flex items-center justify-center rounded-lg col-span-1">
            Không có banner
          </div>
        )}
      </div>
    </div>
  );
};

export default Slider;