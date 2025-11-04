import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { filterProducts } from '../../../../../api/APIs/productApi'; 
import { getAllCategories } from '../../../../../api/APIs/categoryApi'; 
import ProductCard from './ProductCard';

export default function ProductList({ categoryId, brandId, tagId }) {
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState('Sản phẩm'); 
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false); 
  const displayProducts = [...products, ...products, ...products]; 
  const maxProducts = 20;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const filterRequest = {
          categoryId: categoryId || null,
          brandId: brandId || null,
          tagId: tagId || null,
          includeSubCategories: categoryId ? true : false,
          inStock: 1,
        };
        const response = await filterProducts(filterRequest);
        if (response.status === 200) {
          setProducts(response.data.slice(0, maxProducts));
          setCurrentIndex(0);
        } else {
          console.error('Lọc sản phẩm thất bại');
          setProducts([]);
        }
      } catch (error) {
        console.error('Lỗi khi lấy sản phẩm:', error);
        setProducts([]);
      }
    };

    const fetchCategoryName = async () => {
      if (categoryId) {
        try {
          const catResponse = await getAllCategories();
          if (catResponse.status === 200) {
            const category = catResponse.data.find(cat => cat.id === categoryId);
            if (category) {
              setCategoryName(category.name.toUpperCase());
            }
          }
        } catch (error) {
          console.error('Lỗi khi lấy tên danh mục:', error);
        }
      }
    };

    fetchCategoryName();
    fetchProducts();
  }, [categoryId, brandId, tagId]);

  const nextSlide = () => {
    setCurrentIndex((prev) => {
      const nextIndex = prev + 1;
      if (nextIndex >= products.length) {
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
        setTimeout(() => setCurrentIndex(products.length - 1), 1000);
        return products.length - 1;
      }
      return nextIndex;
    });
  };

  useEffect(() => {
    if (products.length > 0 && !isPaused) {
      const interval = setInterval(() => {
        nextSlide();
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [products, currentIndex, isPaused]);

  return (
    <div className="max-w-7xl mx-auto bg-white rounded-lg border pb-2 mb-4 mt-8 border-gray-100 shadow-md">
      {/* Tiêu đề */}
      <div className="flex justify-between items-center px-6 py-3">
        <h2 className="text-2xl font-bold text-gray-500 uppercase">{categoryName}</h2>
        <Link
          to={`/category/${categoryId}`}
          className="bg-red-600 text-white px-2 py-1 rounded-md hover:bg-red-700 transition duration-300 flex items-center gap-1">
          Xem tất cả <span>&#10132;</span>
        </Link>
      </div>

      {/* Carousel sản phẩm */}
      {products.length > 0 ? (
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
              {displayProducts.map((product, index) => (
                <div key={`${product.id}-${index}`} className="flex-shrink-0 w-1/5 px-2">
                  <ProductCard product={product}  onHoverChange={setIsPaused}/>
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
        <p className="text-center text-gray-600">Không có sản phẩm nào hiện tại.</p>
      )}
    </div>
  );
}