import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { filterProducts } from '../../../../../api/APIs/productApi';
import ProductCard from '../../../HomePage/Section/Product/ProductCard';

export default function RelatedProduct({ product }) {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const displayProducts = [...relatedProducts, ...relatedProducts, ...relatedProducts];
  const maxProducts = 10;

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (product.categoryId && product.brandId) {
        try {
          const filterRequest = {
            categoryId: product.categoryId,
            brandId: product.brandId,
            includeSubCategories: false,
          };
          const response = await filterProducts(filterRequest);
          if (response.status === 200) {
            setRelatedProducts(response.data.slice(0, maxProducts));
            setCurrentIndex(0);
          } else {
            console.error('Lọc sản phẩm tương tự thất bại');
            setRelatedProducts([]);
          }
        } catch (error) {
          console.error('Lỗi khi lấy sản phẩm tương tự:', error);
          setRelatedProducts([]);
        }
      }
    };
    fetchRelatedProducts();
  }, [product.categoryId, product.brandId]);

  const nextSlide = () => {
    setCurrentIndex((prev) => {
      const nextIndex = prev + 1;
      if (nextIndex >= relatedProducts.length) {
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
        setTimeout(() => setCurrentIndex(relatedProducts.length - 1), 1000);
        return relatedProducts.length - 1;
      }
      return nextIndex;
    });
  };

  useEffect(() => {
    if (relatedProducts.length > 0 && !isPaused) {
      const interval = setInterval(() => {
        nextSlide();
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [relatedProducts, currentIndex, isPaused]);

  return (
    <div className="max-w-7xl mx-auto bg-white rounded-lg border pb-2 mb-4 mt-2 border-gray-200 shadow-md">
      {/* Tiêu đề */}
      <div className="flex justify-between items-center px-6 py-3">
        <h2 className="text-xl font-bold text-gray-500">Sản phẩm tương tự</h2>
      </div>

      {/* Carousel sản phẩm */}
      {relatedProducts.length > 0 ? (
        <div className="relative">
          {/* Nút previous */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-100 opacity-80 rounded-full p-3 hover:bg-gray-200 transition duration-300 z-10"
          >
            <FaArrowLeft className="text-black opacity-80 text-xl hover:text-red-600 transition duration-300" />
          </button>
          {/* Carousel container */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-1000"
              style={{ transform: `translateX(-${currentIndex * 20}%)` }}
            >
              {displayProducts.map((relatedProduct, index) => (
                <div key={`${relatedProduct.id}-${index}`} className="flex-shrink-0 w-1/5 px-2">
                  <ProductCard product={relatedProduct} onHoverChange={setIsPaused} />
                </div>
              ))}
            </div>
          </div>
          {/* Nút next */}
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-100 opacity-80 rounded-full p-3 hover:bg-gray-200 transition duration-300 z-10"
          >
            <FaArrowRight className="text-black opacity-80 text-xl hover:text-red-600 transition duration-300" />
          </button>
        </div>
      ) : (
        <p className="text-center text-gray-600">Không có sản phẩm tương tự.</p>
      )}
    </div>
  );
}