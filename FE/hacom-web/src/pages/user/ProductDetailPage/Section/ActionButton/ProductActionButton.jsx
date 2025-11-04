import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export default function ProductActionButton({ product }) {
  const navigate = useNavigate();

  const getCartKey = () => {
    const user = sessionStorage.getItem('username');
    return user ? `cart_${user}` : 'cart_guest';
  };

  const addToCart = (isBuyNow = false) => {
  const cart = JSON.parse(localStorage.getItem(getCartKey()) || '[]');
  const existingItem = cart.find(item => item.productId === product.id);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ productId: product.id, quantity: 1, selected: false });
  }
  localStorage.setItem(getCartKey(), JSON.stringify(cart));
  window.dispatchEvent(new Event('cartUpdated'));
  if (isBuyNow) {
    toast.loading('Đang xử lý...', { duration: 1000 });
    setTimeout(() => {
      navigate('/cart', { state: { boughtProductId: product.id } });
    }, 1000);
  } else {
    toast.success('Đã thêm vào giỏ hàng');
  }
};

  return (
    <div className="space-y-3 mb-4">
      <button
        onClick={() => addToCart(true)}
        className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
        disabled={product.inStock === 0}
      >
        <div className="text-center">
          <div className="text-xl font-bold">MUA NGAY</div>
          <div className="font-semibold text-sm">Giao hàng tận nơi nhanh chóng</div>
        </div>
      </button>
      <div className="flex gap-3">
        <button
          onClick={() => addToCart(false)}
          className="flex-1 bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
          disabled={product.inStock === 0}
        >
          <div className="text-center">
            <div className='font-bold text-xl'>THÊM VÀO GIỎ HÀNG</div>
            <div className="font-semibold text-sm">Thêm vào giỏ để chọn tiếp</div>
          </div>
        </button>
        <button
          className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <div className="text-center">
            <div className='font-bold text-xl'>MUA TRẢ GÓP</div>
            <div className="font-semibold text-sm">Thủ tục đơn giản</div>
          </div>
        </button>
      </div>
    </div>
  );
}