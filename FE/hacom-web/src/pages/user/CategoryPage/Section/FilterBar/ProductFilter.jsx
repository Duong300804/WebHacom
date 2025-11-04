import React, { useRef } from 'react';
import { FaCheck } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';

export default function ProductFilter({ subCategories, brands, tags, allProducts, filter, setFilter }) {
  const priceRanges = [
    'Dưới 10 triệu',
    'Từ 10 triệu - 15 triệu',
    'Từ 15 triệu - 20 triệu',
    'Từ 20 triệu - 30 triệu',
    'Từ 30 triệu - 40 triệu',
    'Từ 40 triệu - 50 triệu',
    'Trên 50 triệu',
  ];

  const priceRangeMap = {
    'Dưới 10 triệu': 'duoi10trieu',
    'Từ 10 triệu - 15 triệu': '10trieu-15trieu',
    'Từ 15 triệu - 20 triệu': '15trieu-20trieu',
    'Từ 20 triệu - 30 triệu': '20trieu-30trieu',
    'Từ 30 triệu - 40 triệu': '30trieu-40trieu',
    'Từ 40 triệu - 50 triệu': '40trieu-50trieu',
    'Trên 50 triệu': 'tren50trieu',
  };

  const navigate = useNavigate();
  const { categoryId } = useParams();
  const filterRef = useRef(null);

  const toggleFilter = (type, value) => {
    setFilter(prev => {
      const newFilter = { ...prev };
      const list = newFilter[type];
      let updatedList;
      
      if (list.includes(value)) {
        updatedList = list.filter(item => item !== value);
      } else {
        updatedList = [...list, value];
      }
      newFilter[type] = updatedList;

      // Cập nhật URL
      const searchParams = new URLSearchParams();
      if (newFilter.subCategories.length > 0) {
        searchParams.set('subCategories', newFilter.subCategories.join(','));
      }
      if (newFilter.brands.length > 0) {
        searchParams.set('brands', newFilter.brands.join(','));
      }
      if (newFilter.priceRanges.length > 0) {
        const shortPriceRanges = newFilter.priceRanges.map(range => priceRangeMap[range]);
        searchParams.set('priceRanges', shortPriceRanges.join(','));
      }
      if (newFilter.tags.length > 0) {
        searchParams.set('tags', newFilter.tags.join(','));
      }
      
      navigate(`/category/${categoryId}?${searchParams.toString()}`);

      if (filterRef.current) {
        const y = filterRef.current.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }

      return newFilter;
    });
  };

  const getCount = (type, value) => {
    switch (type) {
      case 'subCategories':
        return allProducts.filter(p => p.categoryId === value).length;
      case 'brands':
        return allProducts.filter(p => p.brandId === value).length;
      case 'tags':
        return allProducts.filter(p => p.tagId === value).length;
      case 'priceRanges':
        const [min, max] = getPriceRangeValues(value);
        return allProducts.filter(p => p.discountPrice >= min && p.discountPrice <= max).length;
      default:
        return 0;
    }
  };

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

  const renderFilterSection = (title, type, items) => (
    <div className="mb-6">
      <h4 className="text-lg font-bold text-black mb-2">{title}</h4>
      <div className="border-b border-gray-300 mb-3"></div>
      <div className="space-y-2">
        {items.map(item => {
          const id = type === 'priceRanges' ? item : item.id;
          const name = type === 'priceRanges' ? item : item.name;
          const count = getCount(type, id);
          const isChecked = filter[type].includes(id);

          return (
            <label
              key={id}
              className={`flex items-center justify-between cursor-pointer group hover:text-blue-600 transition-colors ${isChecked ? 'text-blue-600' : 'text-black'}`}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors ${
                    isChecked ? 'bg-blue-600 border-blue-600' : 'border-black'
                  }`}
                >
                  {isChecked && <FaCheck className="text-white text-xs" />}
                </div>
                <span>{name}</span>
              </div>
              <span className="text-sm">({count})</span>
              <input
                type="checkbox"
                className="hidden"
                checked={isChecked}
                onChange={() => toggleFilter(type, id)}
              />
            </label>
          );
        })}
      </div>
    </div>
  );

  return (
    <div ref={filterRef} className=" bg-white border border-gray-100 rounded-lg p-3 mb-4 shadow-md">
      <div className="bg-white rounded-lg p-3 mb-4 shadow-sm">
        <h3 className="text-lg p-3 border border-blue-600 rounded-lg font-semibold text-blue-700 text-center mb-4">LỌC SẢN PHẨM</h3>
        {renderFilterSection('DANH MỤC', 'subCategories', subCategories)}
        {renderFilterSection('HÃNG', 'brands', brands)}
        {renderFilterSection('KHOẢNG GIÁ', 'priceRanges', priceRanges)}
        {renderFilterSection('TAG', 'tags', tags)}
      </div>
    </div>
  );
}