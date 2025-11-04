import React, { useState } from 'react';
import { FaTruck, FaStore } from 'react-icons/fa';

export default function OrderInfo({ checkoutItems, products, shippingMethod, setShippingMethod, deliveryType, setDeliveryType, address, setAddress, note, setNote }) {

  return (
    <div className='mb-4'>
      {/* Danh sách sản phẩm */}
      <div className="bg-white border border-gray-300 rounded-lg p-4 mb-4 shadow-sm">
        <h3 className="font-bold text-lg mb-2">Sản phẩm trong đơn ({checkoutItems.length})</h3>
        <hr className="border-gray-300 mb-4" />
        {checkoutItems.map((item) => {
          const product = products.find(p => p.id === item.productId);
          if (!product) return null;
          const mainImage = product.images.find(img => img.main) || product.images[0];
          const price = product.discountPrice || product.price;
          const formattedPrice = price.toLocaleString('vi-VN');
          const formattedOriginal = product.price.toLocaleString('vi-VN');

          return (
            <div key={item.productId} className="flex items-center mb-4 border-b pb-4">
              <img 
                src={`${import.meta.env.VITE_IMAGE_BASE_URL}${mainImage?.imageUrl}`} 
                alt={product.name} 
                className="w-16 h-16 object-cover mr-4"
              />
              <div className="flex-1">
                <p className="font-semibold line-clamp-2">{product.name}</p>
                <p className="text-sm">[{product.code}]</p>
              </div>
              <p className="text-sm mx-4">x{item.quantity}</p>
              <div className="text-right">
                <p className="text-red-600 font-bold">{formattedPrice} VNĐ</p>
                <p className="text-sm line-through text-gray-600">{formattedOriginal} VNĐ</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Thông tin người đặt hàng */}
      <div className="bg-white border border-gray-300 rounded-lg p-4 mb-4 shadow-sm">
        <h3 className="font-bold text-lg mb-2">Thông tin người đặt hàng</h3>
        <hr className="border-gray-300 mb-4" />
        <div className="grid grid-cols-2 gap-4 text-base">
          <div>Họ tên:</div><div className="border border-gray-300 rounded px-2 py-1 bg-gray-100">{sessionStorage.getItem('fullname')}</div>
          <div>Email:</div><div className="border border-gray-300 rounded px-2 py-1 bg-gray-100">{sessionStorage.getItem('email')}</div>
          <div>Số điện thoại:</div><div className="border border-gray-300 rounded px-2 py-1 bg-gray-100">{sessionStorage.getItem('phone')}</div>
          <div>Địa chỉ:</div><div className="border border-gray-300 rounded px-2 py-1 bg-gray-100">{sessionStorage.getItem('address')}</div>
        </div>
      </div>

      {/* Chọn phương thức vận chuyển */}
      <div className="bg-white border border-gray-300 rounded-lg p-4 mb-4 shadow-sm">
        <h3 className="font-bold text-lg mb-2">Chọn phương thức vận chuyển</h3>
        <hr className="border-gray-300 mb-4" />
        <div className="space-y-2">
          <label className={`flex items-center p-2 border rounded cursor-pointer ${shippingMethod === 'delivery' ? 'bg-blue-100 border-blue-500' : 'border-gray-300'}`}>
            <input 
              type="radio" 
              checked={shippingMethod === 'delivery'} 
              onChange={() => setShippingMethod('delivery')} 
              className="mr-2 accent-blue-500"
            />
            <FaTruck className="mr-2" /> Giao hàng tận nơi
          </label>
          {shippingMethod === 'delivery' && (
            <div className="ml-6 space-y-2">
              <label className={`block p-2 border rounded cursor-pointer ${deliveryType === 'standard' ? 'bg-blue-100 border-blue-500' : 'border-gray-300'}`}>
                <input type="radio" checked={deliveryType === 'standard'} onChange={() => setDeliveryType('standard')} className="mr-2 accent-blue-500" />
                <span className="font-semibold">Giao hàng tiêu chuẩn</span><br />Dự kiến giao: 3-5 ngày
              </label>
              <label className={`block p-2 border rounded cursor-pointer ${deliveryType === 'fast' ? 'bg-blue-100 border-blue-500' : 'border-gray-300'}`}>
                <input type="radio" checked={deliveryType === 'fast'} onChange={() => setDeliveryType('fast')} className="mr-2 accent-blue-500" />
                <span className="font-semibold">Giao hàng nhanh</span><br />Dự kiến giao: 1-3 ngày
              </label>
              <label className={`block p-2 border rounded cursor-pointer ${deliveryType === 'express' ? 'bg-blue-100 border-blue-500' : 'border-gray-300'}`}>
                <input type="radio" checked={deliveryType === 'express'} onChange={() => setDeliveryType('express')} className="mr-2 accent-blue-500" />
                <span className="font-semibold">Giao hàng hỏa tốc</span><br />Dự kiến giao: 2-3 giờ (nội thành)
              </label>
              <label className={`block p-2 border rounded cursor-pointer ${deliveryType === 'post' ? 'bg-blue-100 border-blue-500' : 'border-gray-300'}`}>
                <input type="radio" checked={deliveryType === 'post'} onChange={() => setDeliveryType('post')} className="mr-2 accent-blue-500" />
                <span className="font-semibold">Giao hàng qua bưu điện</span><br />VNPost, ViettelPost, EMS
              </label>
            </div>
          )}
          <label className={`flex items-center p-2 border rounded cursor-pointer ${shippingMethod === 'pickup' ? 'bg-blue-100 border-blue-500' : 'border-gray-300'}`}>
            <input 
              type="radio" 
              checked={shippingMethod === 'pickup'} 
              onChange={() => setShippingMethod('pickup')} 
              className="mr-2 accent-blue-500"
            />
            <FaStore className="mr-2" /> Nhận tại cửa hàng
          </label>
        </div>
      </div>

      {/* Địa chỉ giao hàng */}
      <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
        <h3 className="font-bold text-lg mb-2">Địa chỉ giao hàng</h3>
        <hr className="border-gray-300 mb-4" />
        <textarea 
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Nhập thông tin địa chỉ giao hàng."
          className="w-full border border-gray-300 rounded p-2 mb-4"
          rows={3}
          disabled={shippingMethod === 'pickup'}
          value={shippingMethod === 'pickup' ? 'Cửa hàng máy tính Hà Nội Computer: Số 131-133 Phố Lê Thanh Nghị, Đồng Tâm, Hai Bà Trưng, Hà Nội.' : address}
        />
        <textarea 
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Ghi chú (Ví dụ: Hãy gọi tôi khi chuẩn bị hàng xong)"
          className="w-full border border-gray-300 rounded p-2"
          rows={3}
        />
      </div>
    </div>
  );
}