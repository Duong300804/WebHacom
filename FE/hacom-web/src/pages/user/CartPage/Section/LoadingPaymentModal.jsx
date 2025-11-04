import React, { useEffect } from 'react';
import { RingLoader, PulseLoader } from 'react-spinners';
import { toast } from 'react-hot-toast';

const LoadingPaymentModal = ({ isOpen, onClose, navigate }) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        const username = sessionStorage.getItem('username');
        const fullname = sessionStorage.getItem('fullname');
        const email = sessionStorage.getItem('email');
        const phone = sessionStorage.getItem('phone');
        const address = sessionStorage.getItem('address');
        if (!username) {
          toast.error('Vui lòng đăng nhập để tiến hành đặt hàng');
          onClose();
          return;
        }
        if (!fullname || !email || !phone || !address) {
          toast.error('Vui lòng nhập đầy đủ thông tin ở trang thông tin tài khoản');
          onClose();
          return;
        }
        onClose();
        navigate('/payment');
      }, 2000); // 2 giây
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose, navigate]);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[60] bg-black bg-opacity-50">
      <div className="bg-white border border-black rounded-lg p-8 shadow-lg text-center w-[400px]">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(to right, #A78BFA, #60A5FA)' }}>
          <RingLoader color="#ffffff" size={50} />
        </div>
        <h2 className="text-xl font-bold mb-2">Đang xử lý giao dịch</h2>
        <p className="text-gray-600 mb-4">Vui lòng đợi trong giây lát...</p>
        <div className="flex justify-center">
          <PulseLoader color="#3B82F6" size={10} />
        </div>
      </div>
    </div>
  );
};

export default LoadingPaymentModal;