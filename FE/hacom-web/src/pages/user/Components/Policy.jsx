import React from "react";
import { FaTruck, FaUndo, FaCreditCard, FaHeadset } from "react-icons/fa";

const Policy = () => {
  return (
    <div className="bg-gray-100 text-black py-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
        <div className="flex items-center">
          <FaTruck className="text-red-600 text-3xl mr-4" />
          <div>
            <p className="font-semibold">CHÍNH SÁCH GIAO HÀNG</p>
            <p>Nhận hàng và thanh toán tại nhà</p>
          </div>
        </div>
        <div className="flex items-center">
          <FaUndo className="text-red-600 text-3xl mr-4" />
          <div>
            <p className="font-semibold">ĐỔI TRẢ DỄ DÀNG</p>
            <p>1 đổi 1 trong 15 ngày</p>
          </div>
        </div>
        <div className="flex items-center">
          <FaCreditCard className="text-red-600 text-3xl mr-4" />
          <div>
            <p className="font-semibold">THANH TOÁN TIỆN LỢI</p>
            <p>Trả tiền mặt, CK, trả góp 0%</p>
          </div>
        </div>
        <div className="flex items-center">
          <FaHeadset className="text-red-600 text-3xl mr-4" />
          <div>
            <p className="font-semibold">HỖ TRỢ NHIỆT TÌNH</p>
            <p>Tư vấn, giải đáp mọi thắc mắc</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Policy;
