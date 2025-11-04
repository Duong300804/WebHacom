import React from 'react';
import { FaStar, FaGift } from 'react-icons/fa';

export default function ProductConfigurations({ product }) {
    const discountPercent = Math.round(
    ((product.price - product.discountPrice) / product.price) * 100
  );

  return (
    <div className="">
      {/* Product Code, Rating, and Comments */}
      <div className="flex items-center gap-4 border-b pb-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-black">Mã SP:</span>
          <span className="text-blue-800 font-medium">{product.code}</span>
        </div>
        <div className="border-l border-gray-300 h-6"></div>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-black">Đánh giá:</span>
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} className="text-black" />
            ))}
          </div>
          <span className="text-blue-800 font-medium">0</span>
        </div>
        <div className="border-l border-gray-300 h-6"></div>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-black">Bình luận:</span>
          <span className="text-blue-800 font-medium">0</span>
        </div>
      </div>

      {/* Product Configurations */}
      <div className='mb-3'>
        <h3 className="font-bold text-slate-800 text-lg mb-2">Thông số sản phẩm</h3>
        <ul className="space-y-2">
          {product.configurations.map((config) => (
            <li key={config.id} className="flex items-start gap-2">
              <span className="w-2 h-2 mt-2 rounded-full border border-black"></span>
              <span className='text-slate-800 text-justify'>
                <strong>{config.name}:</strong>{" "}
                <span className="font-normal">{config.description}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Price Box */}
      <div className="border-2 border-dashed border-[#ff8125] p-3 rounded-lg mb-4">
        <div className="flex items-baseline gap-4 mb-3">
          <span className="text-3xl font-bold text-red-600">
            {product.discountPriceFormatted} ₫
          </span>
          <span className="text-lg text-gray-600 font-semibold line-through">
            {product.priceFormatted} ₫
          </span>
          <span className="text-red-500">
            Tiết kiệm: {discountPercent}%
          </span>
        </div>
        <div className="flex gap-2">
          <span className="bg-red-500 text-white px-3 py-1 rounded-md text-sm">
            Giá đã bao gồm VAT
          </span>
          <span className="bg-red-500 text-white px-3 py-1 rounded-md text-sm">
            Bảo hành 24 tháng
          </span>
        </div>
      </div>

      {/* Gift Box */}
      <div className="border border-red-400 rounded-lg mb-3">
        <div className="p-2 rounded-t-lg text-lg flex items-center gap-2 mb-2 bg-[repeating-linear-gradient(to_right,#ed1b24_0,#243a76_50%,#ed1b24_100%)] bg-[length:200%_200%]">
          <FaGift className="text-white" />
          <span className="text-white font-semibold">
            Quà tặng và ưu đãi kèm theo
          </span>
        </div>
        <ul className="space-y-3 px-2 pb-4 font-semibold text-[#fa5252]">
          <li className="flex items-center gap-2">
            <FaStar className="text-yellow-400" />
            Tặng Balo Laptop Hacom
          </li>
          <li className="flex items-center gap-2">
            <FaStar className="text-yellow-400" />
            Tặng Chuột không dây
          </li>
          <li className="flex items-center gap-2">
            <FaStar className="text-yellow-400" />
            Tặng bàn di chuột
          </li>
        <li className="flex items-center gap-2">
            <FaStar className="text-yellow-400" />
            Tặng phiếu vệ sinh bảo dưỡng miễn phí trọn đời
          </li>
        </ul>
      </div>
    </div>
  );
}