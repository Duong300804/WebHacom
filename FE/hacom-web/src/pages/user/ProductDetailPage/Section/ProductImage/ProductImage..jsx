import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function ProductImage({ product }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const sortedImages = [...product.images].sort((a, b) => {
    if (a.main === b.main) return 0;
    return a.main ? -1 : 1;
  });

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? sortedImages.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === sortedImages.length - 1 ? 0 : prev + 1
    );
  };

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
  };

  const transitionClasses = 'transition-transform duration-300 ease-in-out transform';

  if (!sortedImages.length) {
    return (
      <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
        <span className="text-gray-500">Không có ảnh sản phẩm</span>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Main Image Container */}
      <div className="relative mb-4">
        {/* Main Image */}
        <div className="relative">
          <img
            src={`${import.meta.env.VITE_IMAGE_BASE_URL}${sortedImages[currentImageIndex]?.imageUrl}`}
            alt={product.name}
            className={`w-full h-96 bg-gray-100 object-contain rounded-lg ${transitionClasses}`}
          />
          {/* Viền đỏ cho ảnh chính */}
          <div className="absolute inset-0 border-4 border-red-500 rounded-lg pointer-events-none"></div>
        </div>

        {/* Navigation Buttons */}
        {sortedImages.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110 z-10"
            >
              <FaChevronLeft className="text-gray-400 text-xs" />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110 z-10"
            >
              <FaChevronRight className="text-gray-400 text-xs" />
            </button>
          </>
        )}

        {/* Image Counter */}
        {sortedImages.length > 1 && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-gray-300 text-white px-2 py-1 rounded-full text-sm">
            {currentImageIndex + 1} / {sortedImages.length}
          </div>
        )}
      </div>

      {/* Thumbnail Gallery */}
      {sortedImages.length > 1 && (
        <div className="space-y-4 w-full">
          {Array.from({ length: Math.ceil(sortedImages.length / 5) }, (_, row) => (
            <div key={row} className="flex justify-start gap-3 w-full">
              {sortedImages.slice(row * 5, (row + 1) * 5).map((image, index) => {
                const globalIndex = row * 5 + index;
                const isActive = globalIndex === currentImageIndex;
                return (
                  <div
                    key={image.id || globalIndex}
                    className="relative cursor-pointer group w-[calc(20%-0.5rem)]"
                    onClick={() => handleThumbnailClick(globalIndex)}
                  >
                    <img
                    src={`${import.meta.env.VITE_IMAGE_BASE_URL}${image.imageUrl}`}
                    alt={`${product.name} - ${globalIndex + 1}`}
                    className={`w-20 h-20 object-cover rounded-md transition-all duration-200 bg-gray-100
                        ${isActive 
                        ? 'ring-2 ring-red-600 ring-offset-2'
                        : 'ring-1 ring-gray-300 hover:ring-2 hover:ring-gray-400'}`}
                    />
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}