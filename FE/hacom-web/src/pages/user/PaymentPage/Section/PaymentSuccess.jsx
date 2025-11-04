import React from 'react';
import Lottie from 'lottie-react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaShoppingCart } from 'react-icons/fa';
import checkMark from '../../../../assets/animation/Check Mark - Success.json';

export default function PaymentSuccess({ orderId }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-[65vh] flex flex-col items-center justify-center bg-white text-center">
        <Lottie animationData={checkMark} loop={false} autoplay style={{ width: '150px', height: '150px', margin: '0 auto' }} />
        <h2 className="text-2xl font-bold mb-2">Đặt hàng thành công!</h2>
        <p className="text-gray-600 mb-2">Mã đơn hàng của bạn: <span className="font-bold">#{orderId}</span></p>
        <p className="text-gray-600 mb-6">Cảm ơn bạn đã mua hàng tại Hacom! 🎉</p>
        <div className="flex gap-4 justify-center">
          <button 
            onClick={() => navigate('/account', { state: { activeTab: 'orders' } })}
            className="bg-red-600 text-white py-2 px-4 rounded flex items-center gap-2 hover:bg-red-700"
          >
            <FaEye /> Xem đơn hàng
          </button>
          <button 
            onClick={() => navigate('/')}
            className="bg-blue-500 text-white py-2 px-4 rounded flex items-center gap-2 hover:bg-blue-600"
          >
            <FaShoppingCart /> Tiếp tục mua sắm
          </button>
        </div>
      </div>
  );
}