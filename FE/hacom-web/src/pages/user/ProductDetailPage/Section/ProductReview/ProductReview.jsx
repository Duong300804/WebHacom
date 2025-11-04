import React, { useState } from 'react';
import { FaStar, FaCamera } from 'react-icons/fa';

export default function ProductReview() {
  const [selectedRating, setSelectedRating] = useState('all');

  const ratingButtons = [
    { label: 'Tất cả', value: 'all' },
    { label: '5', value: '5', icon: <FaStar className="text-yellow-400" /> },
    { label: '4', value: '4', icon: <FaStar className="text-yellow-400" /> },
    { label: '3', value: '3', icon: <FaStar className="text-yellow-400" /> },
    { label: '2', value: '2', icon: <FaStar className="text-yellow-400" /> },
    { label: '1', value: '1', icon: <FaStar className="text-yellow-400" /> },
  ];

  return (
    <div className="py-4 px-4 mb-4 text-justify border border-gray-200 shadow-md rounded-lg bg-white">
      <h2 className="text-xl font-bold text-gray-800">Nhận xét và Đánh giá</h2>
      <div className="border-b border-gray-300 my-4"></div>
      <div className="flex gap-8">
        {/* Phần bên trái */}
        <div className="w-1/3 items-center text-center">
          <div className="text-2xl font-semibold text-red-600">0/5</div>
          <div className="text-lg text-[#212a36] mt-2">0 lượt đánh giá</div>
          <div className="flex gap-1 mt-2 justify-center">
            {[...Array(5)].map((_, index) => (
              <FaStar key={index} className="text-gray-400 text-lg" />
            ))}
          </div>
          <button className="mt-4 w-full px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition">
            Gửi đánh giá
          </button>
        </div>
        {/* Phần bên phải */}
        <div className="w-2/3">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center gap-2 mb-2">
              <span className="text-base text-[#212a36]">{rating}</span>
              <FaStar className="text-gray-400" />
              <div className="flex-1 h-2 bg-gray-300 rounded-full"></div>
              <span className="text-blue-500 text-base">0 đánh giá</span>
            </div>
          ))}
          <div className="flex gap-2 mt-4 flex-wrap">
            {ratingButtons.map((button) => (
              <button
                key={button.value}
                onClick={() => setSelectedRating(button.value)}
                className={`px-3 py-1 rounded-md border transition ${
                  selectedRating === button.value
                    ? 'border-red-500 text-red-500'
                    : 'border-gray-300 text-gray-800'
                } flex items-center gap-1`}
              >
                {button.icon && button.icon}
                {button.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* Phần bình luận */}
      <div className="mt-8 border border-gray-200 bg-gray-100 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-800">Bình luận sản phẩm</h3>
        <textarea
          className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 resize-y"
          rows="4"
          placeholder="Chia sẻ câu hỏi hoặc nhận xét của bạn về sản phẩm"
        ></textarea>
        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center gap-2">
            <FaCamera className="text-gray-600" />
            <span className="text-blue-500">Đính kèm ảnh</span>
          </div>
          <button className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition">
            Gửi bình luận
          </button>
        </div>
      </div>
    </div>
  );
}