import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from '../../../HomePage/Section/Product/ProductCard';
import Pagination from '../../../Components/Pagination';

export default function ProductList({ allProducts, sortOption, setSortOption, currentPage, setCurrentPage, productsPerPage, filter }) {
  const { categoryId } = useParams();
  const listRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    setLoading(true);
    let filtered = allProducts;

    // Lọc theo danh mục con
    if (filter.subCategories.length > 0) {
      filtered = filtered.filter(p => filter.subCategories.includes(p.categoryId));
    }

    // Lọc theo hãng
    if (filter.brands.length > 0) {
      filtered = filtered.filter(p => filter.brands.includes(p.brandId));
    }

    // Lọc theo tag
    if (filter.tags.length > 0) {
      filtered = filtered.filter(p => filter.tags.includes(p.tagId));
    }

    // Lọc theo khoảng giá (merge min/max từ các range đã chọn)
    if (filter.priceRanges.length > 0) {
      let minPrice = Infinity;
      let maxPrice = -Infinity;
      filter.priceRanges.forEach(range => {
        const [min, max] = getPriceRangeValues(range);
        minPrice = Math.min(minPrice, min);
        maxPrice = Math.max(maxPrice, max);
      });
      filtered = filtered.filter(p => p.discountPrice >= minPrice && p.discountPrice <= maxPrice);
    }

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
    setLoading(false);
  }, [allProducts, filter, sortOption, currentPage, productsPerPage]);

  // Hàm helper để lấy min/max từ khoảng giá
  const getPriceRangeValues = (range) => {
    switch (range) {
      case 'Dưới 10 triệu': return [0, 10000000];
      case 'Từ 10 triệu - 15 triệu': return [10000000, 15000000];
      case 'Từ 15 triệu - 20 triệu': return [15000000, 20000000];
      case 'Từ 20 triệu - 30 triệu': return [20000000, 30000000];
      case 'Từ 30 triệu - 40 triệu': return [30000000, 40000000];
      case 'Từ 40 triệu - 50 triệu': return [40000000, 50000000];
      case 'Trên 50 triệu': return [50000000, Infinity];
      default: return [0, Infinity];
    }
  };

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
    <div ref={listRef} className="mt-6">
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

      {/* Product List */}
      {loading ? (
        <div className="text-center py-10">Đang tải sản phẩm...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-10">Không có sản phẩm trong danh mục này</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <div key={product.id} data-aos="fade-up">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}