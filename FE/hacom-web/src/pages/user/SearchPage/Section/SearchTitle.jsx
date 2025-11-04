import { useState, useEffect } from 'react';
import { searchProducts } from '../../../../api/APIs/productApi';

export default function SearchTitle({ keyword }) {
  const [productCount, setProductCount] = useState(0);

  useEffect(() => {
    const fetchProductCount = async () => {
      try {
        const response = await searchProducts(keyword);
        if (response.status === 200) {
          setProductCount(response.data.length);
        }
      } catch (error) {
        console.error('Lỗi khi lấy số lượng sản phẩm:', error);
      }
    };

    if (keyword) {
      fetchProductCount();
    }
  }, [keyword]);

  return (
    <div className="">
      <div className="inline-block relative">
        <div className="flex items-baseline space-x-2">
          <h2 className="text-3xl font-bold text-blue-800 uppercase">TÌM KIẾM: "{keyword.toUpperCase()}"</h2>
          <span className="text-sm font-semibold text-neutral-500">({`Tổng ${productCount} sản phẩm`})</span>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-800"></div>
      </div>
    </div>
  );
}