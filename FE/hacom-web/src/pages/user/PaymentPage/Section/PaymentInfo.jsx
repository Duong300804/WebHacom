import React, { useState } from 'react';
import { FaMoneyBill, FaQrcode, FaCreditCard, FaShoppingBag, FaPlusCircle, FaDownload } from 'react-icons/fa';

export default function PaymentInfo({ totalPrice, paymentMethod, setPaymentMethod, onPlaceOrder, onAddMore }) {
  const formattedTotal = totalPrice.toLocaleString('vi-VN');

  return (
    <div>
      {/* Tổng tiền */}
      <div className="bg-white border border-gray-300 rounded-lg p-4 mb-4 shadow-sm">
        <h3 className="font-bold text-lg mb-4">Tổng tiền</h3>
        <div className="flex justify-between mb-2">
          <span>Tổng tiền sản phẩm:</span>
          <span className="font-semibold">{formattedTotal} VNĐ</span>
        </div>
        <hr className="my-4 border-gray-300" />
        <div className="flex justify-between mb-2">
          <span className="font-semibold">Cần thanh toán:</span>
          <span className="text-red-600 font-bold">{formattedTotal} VNĐ</span>
        </div>
        <p className="text-sm text-gray-500 text-right">(Đã bao gồm VAT)</p>
      </div>

      {/* Phương thức thanh toán */}
      <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
        <h3 className="font-bold text-lg mb-2">Chọn phương thức thanh toán</h3>
        <div className="space-y-2 mb-4">
          <label className="flex items-center cursor-pointer">
            <input type="radio" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="mr-2 accent-red-500" />
            <FaMoneyBill className="text-red-500 mr-2 text-xl" /> Thanh toán khi nhận hàng
          </label>
          <label className="flex items-center cursor-pointer">
            <input type="radio" checked={paymentMethod === 'transfer'} onChange={() => setPaymentMethod('transfer')} className="mr-2 accent-red-500" />
            <FaQrcode className="text-red-500 mr-2 text-xl" /> Thanh toán bằng chuyển khoản
          </label>
          <label className="flex items-center cursor-pointer">
            <input type="radio" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="mr-2 accent-red-500" />
            <FaCreditCard className="text-red-500 mr-2 text-xl" /> Thanh toán bằng thẻ quốc tế Visa, Master
          </label>
        </div>
        <button className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 mb-2 flex items-center justify-center gap-2"
                onClick={onPlaceOrder}>
          <FaShoppingBag /> Đặt hàng
        </button>
        <button className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 mb-2 flex items-center justify-center gap-2"
                onClick={onAddMore}>
          <FaPlusCircle /> Chọn thêm sản phẩm
        </button>
        <button className="w-full bg-blue-700 text-white py-3 rounded-lg hover:bg-blue-800 flex items-center justify-center gap-2">
          <FaDownload /> Tải ảnh báo giá
        </button>
      </div>
    </div>
  );
}