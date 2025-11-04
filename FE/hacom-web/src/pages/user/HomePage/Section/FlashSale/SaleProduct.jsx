import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaArrowRight, FaCheck } from 'react-icons/fa';
import { filterProducts } from '../../../../../api/APIs/productApi'; 
import { getAllTags } from '../../../../../api/APIs/tagApi'; 
import ProductModal from '../Product/Modal/ProductModal';
import { toast } from 'react-hot-toast';

function SaleProductCard({ product, onHoverChange }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const cardRef = useRef(null);
  const [cardPosition, setCardPosition] = useState(null);
  const navigate = useNavigate();

  const getCartKey = () => {
    const user = sessionStorage.getItem('username');
    return user ? `cart_${user}` : 'cart_guest';
  };

  const mainImage = product.images.find((img) => img.main) || product.images[0];
  const discountPercent = Math.round(
    ((product.price - product.discountPrice) / product.price) * 100
  );

  const handleBuyNow = (e) => {
    e.stopPropagation();
    const cart = JSON.parse(localStorage.getItem(getCartKey()) || '[]');
    const existingItem = cart.find(item => item.productId === product.id);
    if (existingItem) {
      existingItem.quantity += 1;
      existingItem.selected = true;
    } else {
      cart.push({ productId: product.id, quantity: 1, selected: true });
    }
    localStorage.setItem(getCartKey(), JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
    toast.loading('Đang xử lý...', { duration: 1000 });
    setTimeout(() => {
      navigate('/cart', { state: { boughtProductId: product.id } });
    }, 1000);
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

  return (
    <div
      ref={cardRef}
      className="bg-white rounded-lg shadow-md p-3 hover:shadow-lg transition duration-300 group cursor-pointer"
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
      {/* Phần dưới: Số lượng có hạn + Nút Mua ngay */}
      <div className="flex justify-between items-center mt-2">
        <p className="text-green-600 flex items-center text-sm">
          <FaCheck className="mr-1" /> Số lượng có hạn
        </p>
        <button className="bg-red-600 text-white px-2 py-1 rounded-md hover:bg-red-700 transition duration-300 text-sm"
                onClick={handleBuyNow}
                disabled={product.inStock === 0}>
          Mua ngay
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

export default function SaleProduct() {
  const [products, setProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const displayProducts = [...products, ...products, ...products]; 
  const maxProducts = 15;

  useEffect(() => {
    const fetchSaleProducts = async () => {
      try {
        const tagsResponse = await getAllTags();
        const saleTag = tagsResponse.data.find(tag => tag.name.toLowerCase() === 'giảm giá sâu');

        if (saleTag) {
          const response = await filterProducts({ tagId: saleTag.id, inStock: 1 });
          if (response.status === 200) {
            setProducts(response.data.slice(0, maxProducts));
          } else {
            console.error('Lọc sản phẩm thất bại');
          }
        } else {
          console.error('Không tìm thấy tag "giảm giá sâu"');
        }
      } catch (error) {
        console.error('Lỗi khi lấy sản phẩm flash sale:', error);
      }
    };

    fetchSaleProducts();
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => {
      const nextIndex = prev + 1;
      if (nextIndex >= products.length) {
        setTimeout(() => setCurrentIndex(0), 1000); 
        return 0;
      }
      return nextIndex;
    });
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => {
      const nextIndex = prev - 1;
      if (nextIndex < 0) {
        setTimeout(() => setCurrentIndex(products.length - 1), 1000); 
        return products.length - 1;
      }
      return nextIndex;
    });
  };

  useEffect(() => {
    if (products.length > 0 && !isPaused) {
      const interval = setInterval(() => {
        nextSlide();
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [products, currentIndex, isPaused]);

  return (
    <div className="max-w-7xl mx-auto bg-amber-400 rounded-lg p-4 my-4"> 
      {products.length > 0 ? (
        <div className="relative">
          <button
            onClick={prevSlide}
            className="absolute left-[-10px] top-1/2 transform -translate-y-1/2 bg-gray-100 opacity-80 rounded-full p-3 hover:bg-gray-200 transition duration-300 z-10"
          >
            <FaArrowLeft className="text-black opacity-80 text-xl hover:text-orange-500 transition duration-300" />
          </button>
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-1000"
              style={{ transform: `translateX(-${currentIndex * 20}%)` }}
            >
              {displayProducts.map((product, index) => (
                <div key={`${product.id}-${index}`} className="flex-shrink-0 w-1/5 px-2">
                  <SaleProductCard product={product} onHoverChange={setIsPaused} />
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={nextSlide}
            className="absolute right-[-10px] top-1/2 transform -translate-y-1/2 bg-gray-100 opacity-80 rounded-full p-3 hover:bg-gray-200 transition duration-300 z-10"
          >
            <FaArrowRight className="text-black opacity-80 text-xl hover:text-orange-500 transition duration-300" />
          </button>
        </div>
      ) : (
        <p className="text-center text-gray-600">Không có sản phẩm flash sale nào hiện tại.</p>
      )}
    </div>
  );
}