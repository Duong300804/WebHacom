import React, { useState, useEffect, useRef } from 'react';
import { searchProducts } from '../../../../api/APIs/productApi';
import { FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import noResultImage from '../../../../assets/images/not_found_search.png'
import ProductCard from '../../HomePage/Section/Product/ProductCard';
import Pagination from '../../Components/Pagination';

export default function SearchProductList({ keyword }) {
  const listRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [sortOption, setSortOption] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 20;

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await searchProducts(keyword);
        if (response.status === 200) {
          let filtered = response.data;

          // Áp dụng sắp xếp
          if (sortOption) {
            switch (sortOption) {
              case 'newest':
                filtered = [...filtered].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
              case 'price_asc':
                filtered = [...filtered].sort((a, b) => a.discountPrice - b.discountPrice);
                break;
              case 'price_desc':
                filtered = [...filtered].sort((a, b) => b.discountPrice - a.discountPrice);
                break;
              default:
                break;
            }
          }

          setTotalProducts(filtered.length);
          const startIndex = (currentPage - 1) * productsPerPage;
          const endIndex = startIndex + productsPerPage;
          setProducts(filtered.slice(startIndex, endIndex));
        }
      } catch (error) {
        console.error('Lỗi khi tìm kiếm sản phẩm:', error);
      }
      setLoading(false);
    };

    if (keyword) {
      fetchProducts();
    }
  }, [keyword, sortOption, currentPage, productsPerPage]);

  useEffect(() => {
    if (listRef.current) {
      const y = listRef.current.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }, [currentPage]);

  const handleSort = (option) => {
    if (sortOption === option) {
      setSortOption(null);
    } else {
      setSortOption(option);
      setCurrentPage(1);
    }
  };

  const totalPages = Math.ceil(totalProducts / productsPerPage) || 1;

  return (
    <div ref={listRef} className="mt-6 mb-4">
      {/* Sort Buttons */}
      <div className="flex gap-4 mb-4">
        {[
          { label: 'Hàng mới', value: 'newest' },
          { label: 'Giá tăng dần', value: 'price_asc' },
          { label: 'Giá giảm dần', value: 'price_desc' },
        ].map((option) => (
          <button
            key={option.value}
            onClick={() => handleSort(option.value)}
            className={`px-4 py-2 rounded-full font-semibold transition-all duration-300 border ${
              sortOption === option.value
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Product List or No Result */}
      {loading ? (
        <div className="text-center py-10">Đang tải sản phẩm...</div>
      ) : products.length === 0 ? (
        <div className="flex flex-col md:flex-row items-center justify-center py-10 gap-8">
          {/* Ảnh bên trái */}
          <img src={noResultImage} alt="No result" className="w-64 h-auto object-contain" />

          {/* Nội dung bên phải */}
          <div className="text-center md:text-left max-w-md">
            <h2 className="text-2xl font-bold text-black mb-4">Không có sản phẩm nào khớp với tìm kiếm của bạn</h2>
            <div className="bg-blue-50 border border-blue-600 p-6 rounded-lg mb-6">
              <p className="font-semibold mb-2">Để tìm được kết quả chính xác hơn, xin vui lòng</p>
              <ul className="list-disc pl-5 space-y-1 text-left">
                <li>Kiểm tra lại chính tả của từ khóa đã nhập</li>
                <li>Thử lại bằng từ khóa khác</li>
                <li>Thử lại bằng các từ khóa tổng quát hơn</li>
                <li>Thử lại bằng các từ khóa ngắn gọn hơn</li>
              </ul>
            </div>
            <Link
              to="/"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-all duration-300"
            >
              <FaArrowLeft />
              Quay lại trang chủ
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {products.map((product) => (
            <div key={product.id} data-aos="fade-up">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}

      {/* Pagination (chỉ hiển thị nếu có sản phẩm) */}
      {!loading && products.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}