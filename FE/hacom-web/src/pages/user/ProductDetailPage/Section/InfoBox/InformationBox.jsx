import React from 'react';
import { FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

export default function InformationBox() {
  return (
    <div className="w-full space-y-3">
    {/* Box 4: Sản phẩm còn hàng tại */}
      <div className="border border-red-400 rounded-lg">
        <div className="p-2 rounded-t-lg bg-[repeating-linear-gradient(to_right,#ed1b24_0,#243a76_50%,#ed1b24_100%)] bg-[length:200%_200%]">
          <span className="text-white text-base font-bold">Sản phẩm còn hàng tại</span>
        </div>
        <div className="px-2 pt-1 pb-4">
          <p className="text-black font-semibold mb-2">Showroom Lê Thanh Nghị:</p>
          <div className="flex items-center gap-2 mb-2">
            <FaMapMarkerAlt className="text-blue-500" />
            <span className="text-black text-sm">131 Phố Lê Thanh Nghị, Đồng Tâm, Hai Bà Trưng, Hà Nội.</span>
          </div>
          <p className="text-gray-500 text-sm italic">Hàng luôn có sẵn tại kho, sẵn sàng giao ngay cho quý khách.</p>
        </div>
      </div>

      {/* Box 1: Mừng sinh nhật Hacom */}
      <div className="border border-red-400 rounded-lg">
        <div className="p-2 rounded-t-lg bg-[repeating-linear-gradient(to_right,#ed1b24_0,#243a76_50%,#ed1b24_100%)] bg-[length:200%_200%]">
          <span className="text-white text-base font-bold">Mừng sinh nhật Hacom</span>
        </div>
        <ul className="space-y-3 px-2 pt-1 pb-4 text-sm">
          <li className="flex items-start gap-2">
            <span className="w-2 h-2 mt-2 rounded-full border border-black"></span>
            <span className="text-black">Laptop ≥ 8 triệu: Giảm ngay <span className="text-red-600">124.000đ</span>.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-2 h-2 mt-2 rounded-full border border-black"></span>
            <span className="text-black">Laptop ≥ 15 triệu: Giảm ngay <span className="text-red-600">324.000đ</span>.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-2 h-2 mt-2 rounded-full border border-black"></span>
            <span className="text-black">Laptop ≥ 30 triệu: Giảm ngay <span className="text-red-600">624.000đ</span>.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-2 h-2 mt-2 rounded-full border border-black"></span>
            <span className="text-black">Laptop ≥ 50 triệu: Giảm ngay <span className="text-red-600">1.024.000đ</span>.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-2 h-2 mt-2 rounded-full border border-black"></span>
            <span className="text-black">Laptop ≥ 80 triệu: Giảm ngay <span className="text-red-600">2.400.000đ</span>.</span>
          </li>
        </ul>
      </div>

      {/* Box 2: Yên Tâm Mua Sắm Tại Hacom */}
      <div className="border border-red-400 rounded-lg">
        <div className="p-2 rounded-t-lg bg-[repeating-linear-gradient(to_right,#ed1b24_0,#243a76_50%,#ed1b24_100%)] bg-[length:200%_200%]">
          <span className="text-white text-base font-bold">Yên Tâm Mua Sắm Tại Hacom</span>
        </div>
        <ul className="space-y-3 pt-1 px-2 pb-4 text-sm">
          <li className="flex items-start gap-2">
            <span className="w-2 h-2 mt-2 rounded-full border border-black"></span>
            <span className="text-black">Đội ngũ kỹ thuật tư vấn chuyên sâu</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-2 h-2 mt-2 rounded-full border border-black"></span>
            <span className="text-black">Thanh toán thuận tiện</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-2 h-2 mt-2 rounded-full border border-black"></span>
            <span className="text-black">Giao hàng nhanh chóng toàn quốc</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-2 h-2 mt-2 rounded-full border border-black"></span>
            <span className="text-black">Sản phẩm 100% chính hãng</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-2 h-2 mt-2 rounded-full border border-black"></span>
            <span className="text-black">Bảo hành 1 đổi 1 tại nơi sử dụng</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-2 h-2 mt-2 rounded-full border border-black"></span>
            <span className="text-black">Giá cạnh tranh nhất thị trường</span>
          </li>
        </ul>
      </div>

      {/* Box 3: Liên Hệ Với Kinh Doanh Online */}
      <div className="border border-red-400 rounded-lg">
        <div className="p-2 rounded-t-lg bg-[repeating-linear-gradient(to_right,#ed1b24_0,#243a76_50%,#ed1b24_100%)] bg-[length:200%_200%]">
          <span className="text-white text-base font-bold">Liên Hệ Với Kinh Doanh Online</span>
        </div>
        <ul className="space-y-3 pt-1 px-2 pb-4 text-sm">
          <li className="flex items-center gap-2">
            <FaPhone className="text-blue-500" />
            <span className="text-black">Hotline Hà Nội: <span className="text-red-600">0969.123.666</span></span>
          </li>
          <li className="flex items-center gap-2">
            <FaPhone className="text-blue-500" />
            <span className="text-black">Hotline Kỹ thuật: <span className="text-red-600">0988.163.666</span></span>
          </li>
          <li className="flex items-center gap-2">
            <FaPhone className="text-blue-500" />
            <span className="text-black">Hotline Bảo Hành: <span className="text-red-600">1900.6100</span></span>
          </li>
          <li className="flex items-center gap-2">
            <FaPhone className="text-blue-500" />
            <span className="text-black">Hotline Chăm sóc KH: <span className="text-red-600">0968.123.666</span></span>
          </li>
        </ul>
      </div>

    </div>
  );
}