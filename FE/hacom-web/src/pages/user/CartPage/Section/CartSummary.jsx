import { FaShoppingBag, FaCreditCard } from 'react-icons/fa';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingPaymentModal from './LoadingPaymentModal';
import { toast } from 'react-hot-toast';

export default function CartSummary({ totalPrice, cartItems  }) {
  const formattedTotal = totalPrice.toLocaleString('vi-VN');
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (totalPrice === 0) {
      toast.error('Vui lòng chọn sản phẩm để thanh toán');
      return;
    }
    const selectedItems = cartItems.filter(item => item.selected);
    if (selectedItems.length === 0) {
      toast.error('Vui lòng chọn sản phẩm để thanh toán');
      return;
    }
    localStorage.setItem('checkoutItems', JSON.stringify(selectedItems));
    setShowLoadingModal(true);
  };

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-md mb-4">
      <h3 className="font-bold text-lg mb-4">Thông tin đơn hàng</h3>
      <div className="flex justify-between mb-2">
        <span>Tổng tiền sản phẩm:</span>
        <span className="font-semibold">{formattedTotal} VNĐ</span>
      </div>
      <hr className="my-4 border-gray-300" />
      <div className="flex justify-between mb-2">
        <span className="font-semibold">Cần thanh toán:</span>
        <span className="text-red-600 font-bold">{formattedTotal} VNĐ</span>
      </div>
      <p className="text-sm text-right text-gray-500 mb-6">(Đã bao gồm VAT)</p>
      <button className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 mb-3 flex items-center justify-center gap-2"
              onClick={handleCheckout}>
        <FaShoppingBag /> Tiến hành đặt hàng
      </button>
      <button className="w-full bg-white border border-red-600 text-red-600 py-3 rounded-lg hover:bg-gray-50  flex items-center justify-center gap-2">
        <FaCreditCard /> Mua trả góp
      </button>
      <LoadingPaymentModal 
        isOpen={showLoadingModal} 
        onClose={() => setShowLoadingModal(false)} 
        navigate={navigate}
      />
    </div>
  );
}