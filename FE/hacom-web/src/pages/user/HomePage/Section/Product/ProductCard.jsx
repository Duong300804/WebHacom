import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { FaCheckCircle, FaGift, FaShoppingCart } from 'react-icons/fa';
import ProductModal from './Modal/ProductModal'; 
import { toast } from 'react-hot-toast';

export default function ProductCard({ product, onHoverChange  }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const cardRef = useRef(null);
  const [cardPosition, setCardPosition] = useState(null);
  const navigate = useNavigate();

  const mainImage = product.images.find((img) => img.main) || product.images[0];
  const discountPercent = Math.round(
    ((product.price - product.discountPrice) / product.price) * 100
  );

  const getCartKey = () => {
    const user = sessionStorage.getItem('username');
    return user ? `cart_${user}` : 'cart_guest';
  };

  useEffect(() => {
    if (isModalOpen && cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      setCardPosition({
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [isModalOpen]);

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation(); 
    const cart = JSON.parse(localStorage.getItem(getCartKey()) || '[]');
    const existingItem = cart.find(item => item.productId === product.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ productId: product.id, quantity: 1, selected: false });
    }
    localStorage.setItem(getCartKey(), JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
    toast.success('Đã thêm vào giỏ hàng');
  };

  return (
    <div
      ref={cardRef}
      className="relative bg-white rounded-lg shadow-md p-3 hover:shadow-lg transition duration-300 group cursor-pointer"
      onMouseEnter={() => {
        setIsModalOpen(true);
        onHoverChange?.(true);
      }}
      onMouseLeave={() => {
        setIsModalOpen(false);
        onHoverChange?.(false); 
      }}
      onClick={handleCardClick} 
    >
      {/* Ảnh sản phẩm với mã ở góc phải dưới */}
      <div className="relative">
        <img
          src={`${import.meta.env.VITE_IMAGE_BASE_URL}${mainImage?.imageUrl}`}
          alt={product.name}
          className="border-2 border-red-500 w-full h-full object-cover rounded-md transform transition-transform duration-300 group-hover:-translate-y-2"
        />
        <div className="absolute bottom-0 right-0 m-1 bg-gray-200 text-black text-xs px-1 py-0.5 rounded-tl-md">
          Mã: {product.code}
        </div>
      </div>
      {/* Tên sản phẩm (tối đa 2 dòng, ellipsis nếu dài) */}
      <h3 className="mt-1 text-base line-clamp-2 transition-colors duration-300 group-hover:text-red-600">{product.name}</h3>
      {/* Giá giảm (to, đậm) */}
      <p className="text-xl font-bold text-red-600 mt-1">
        {product.discountPriceFormatted} VNĐ
      </p>
      {/* Giá gốc (gạch ngang) + Tiết kiệm % */}
      <div className="flex items-center mt-1">
        <p className="text-sm text-gray-500 line-through mr-2">
          {product.priceFormatted} VNĐ
        </p>
        <p className="text-xs text-red-500">
          (Tiết kiệm: {discountPercent}%)
        </p>
      </div>
      {/* Phần dưới: Còn hàng + Quà tặng + Nút giỏ hàng */}
      <div className="flex justify-between items-center mt-2">
        <div className="flex flex-col text-sm">
          <p className="text-green-600 flex items-center">
            <FaCheckCircle className="mr-1" /> Còn hàng
          </p>
          <p className="text-gray-600 flex items-center mt-1">
            <FaGift className="mr-1" /> Quà tặng
          </p>
        </div>
        <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-300 h-12 flex items-center justify-center"
                onClick={handleAddToCart}
                disabled={product.inStock === 0}>
          <FaShoppingCart className="text-lg" />
        </button>
      </div>
      {/* Modal */}
      <ProductModal
        product={product}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        referenceEl={cardRef}
      />
    </div>
  );
}