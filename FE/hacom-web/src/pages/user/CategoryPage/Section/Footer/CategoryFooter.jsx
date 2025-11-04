import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { getAllCategories } from '../../../../../api/APIs/categoryApi';
import laptopImg from '../../../../../assets/images/laptop_category.png'
import PCImg from '../../../../../assets/images/pc_category.png'
import linhkienImg from '../../../../../assets/images/linh_kien_category.png'
import manhinhimg from '../../../../../assets/images/man_hinh_category.png'
import phukienImg from '../../../../../assets/images/phu_kien_category.png'
import tannhietImg from '../../../../../assets/images/tan_nhiet_category.png'
import ledfanImg from '../../../../../assets/images/led_fan_category.png'
import gamingGearImg from '../../../../../assets/images/gaming_gear_category.png'
import gamingChairImg from '../../../../../assets/images/gaming_chair_category.png'
import speakerImg from '../../../../../assets/images/loa_category.png'
import headphoneImg from '../../../../../assets/images/headphone_category.png'
import routerImg from '../../../../../assets/images/router_category.png'

export default function CategoryFooter() {
  const [categories, setCategories] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const displayCategories = [...categories, ...categories, ...categories];

  // Ánh xạ ảnh danh mục theo categoryId
  const categoryImages = {
    11: laptopImg, 
    12: PCImg, 
    13: linhkienImg,
    14: manhinhimg,
    15: phukienImg,
    60: tannhietImg,
    70: ledfanImg,
    80: gamingGearImg,
    108: gamingChairImg,
    118: headphoneImg,
    129: speakerImg,
    141: routerImg,
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        if (response.status === 200) {
          const topLevelCategories = response.data
            .filter((cat) => !cat.parentId || cat.parent === null)
          setCategories(topLevelCategories);
          setCurrentIndex(0);
        } else {
          console.error('Lấy danh mục thất bại');
          setCategories([]);
        }
      } catch (error) {
        console.error('Lỗi khi lấy danh mục:', error);
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => {
      const nextIndex = prev + 1;
      if (nextIndex >= categories.length) {
        setTimeout(() => setCurrentIndex(0), 1000);
        return 0;
      }
      return nextIndex;
    });
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => {
      const nextIndex = prev - 1;
      if (nextIndex < 0) {
        setTimeout(() => setCurrentIndex(categories.length - 1), 1000);
        return categories.length - 1;
      }
      return nextIndex;
    });
  };

  useEffect(() => {
    if (categories.length > 0 && !isPaused) {
      const interval = setInterval(() => {
        nextSlide();
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [categories, currentIndex, isPaused]);

  return (
    <div className="mt-8">
      {/* Thanh xanh nước biển đậm ở trên */}
      <div className="w-full h-1 bg-[#2F2F8D] rounded-lg"></div>

      <div className="max-w-7xl mx-auto py-4 flex">
        {/* Ô "Danh mục nổi bật" bên trái */}
        <div className="w-1/6 bg-[#2F2F8D] text-white p-2 flex flex-col justify-center items-center text-center rounded-lg">
          <span className="text-lg font-semibold">Danh mục</span>
          <span className="text-lg font-semibold">nổi bật</span>
        </div>

        {/* Carousel danh mục bên phải */}
        <div className="w-5/6 relative">
          {categories.length > 0 ? (
            <>
              {/* Nút previous */}
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-100 opacity-80 rounded-full p-3 hover:bg-gray-200 transition duration-300 z-10"
              >
                <FaArrowLeft className="text-black opacity-80 text-xl hover:text-[#2F2F8D] transition duration-300" />
              </button>

              {/* Carousel container */}
              <div className="overflow-hidden">
                <div
                  className="flex transition-transform duration-1000"
                  style={{ transform: `translateX(-${currentIndex * 16.666}%)` }}
                >
                  {displayCategories.map((category, index) => (
                    <div
                      key={`${category.id}-${index}`}
                      className="flex-shrink-0 w-1/6 px-2"
                      onMouseEnter={() => setIsPaused(true)}
                      onMouseLeave={() => setIsPaused(false)}
                    >
                      <div className="bg-white rounded-lg shadow-lg p-3 border border-gray-200">
                        <img
                          src={categoryImages[category.id] || '/images/default-category.jpg'}
                          alt={category.name}
                          className="w-full h-20 object-contain rounded-md"
                        />
                        <h3
                        className="mt-2 text-base font-semibold text-gray-800 text-center truncate w-full"
                        title={category.name}>
                        {category.name}
                        </h3>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Nút next */}
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-100 opacity-80 rounded-full p-3 hover:bg-gray-200 transition duration-300 z-10"
              >
                <FaArrowRight className="text-black opacity-80 text-xl hover:text-[#2F2F8D]  transition duration-300" />
              </button>
            </>
          ) : (
            <p className="text-center text-gray-600">Không có danh mục nào hiện tại.</p>
          )}
        </div>
      </div>

      {/* Thanh xanh nước biển đậm ở dưới */}
      <div className="w-full h-1 bg-[#2F2F8D] rounded-lg mb-4"></div>
    </div>
  );
}