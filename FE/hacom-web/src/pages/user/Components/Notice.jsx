import React, { useState } from 'react';

const Notice = () => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý submit ở đây, ví dụ gọi API
    console.log('Submitted:', inputValue);
  };

  return (
    <div className="bg-[rgb(32,44,67)] text-white py-8">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-xl md:text-2xl font-bold mb-4">
          ĐĂNG KÝ NHẬN EMAIL THÔNG BÁO KHUYẾN MẠI HOẶC ĐỂ ĐƯỢC TƯ VẤN MIỄN PHÍ
        </h2>
        <form onSubmit={handleSubmit} className="flex justify-center">
          <input
            type="text"
            placeholder="Nhập email hoặc số điện thoại của bạn"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="px-4 py-2 bg-white text-black text-sm rounded-l-md focus:outline-none w-64 md:w-96"
          />
          <button type="submit" className="bg-red-600 text-white px-6 py-2 rounded-r-md font-semibold">
            Gửi
          </button>
        </form>
      </div>
    </div>
  );
};

export default Notice;