import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaArrowRight, FaCheck } from 'react-icons/fa';
import { filterProducts } from '../../../../../api/APIs/productApi'; 
import { getAllTags } from '../../../../../api/APIs/tagApi'; 
import { getAllCategories } from '../../../../../api/APIs/categoryApi'; 
import ProductModal from '../Product/Modal/ProductModal';
import { toast } from 'react-hot-toast';

function TagProductCard({ product, onHoverChange }) {
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

  const handleCardClick = () => {
    navigate(`/product/${product.id}`); 
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

export default function TagProduct() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [currentTab, setCurrentTab] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const displayProducts = [...products, ...products, ...products]; 
  const maxProducts = 15;

  const tabs = [
    {
      titleLine1: 'TOP LAPTOP BÁN CHẠY',
      titleLine2: 'Nhất Năm 2025',
      categoryName: 'Laptop', 
      tagName: 'Bestseller',
    },
    {
      titleLine1: 'TOP PC CỰC HOT',
      titleLine2: 'Chiến Game Cực Đã',
      categoryName: 'PC',
      tagName: 'Hot',
    },
    {
      titleLine1: 'LAPTOP SALE KHỦNG',
      titleLine2: 'Deal sốc trong ngày',
      categoryName: 'Laptop',
      tagName: 'Giảm giá sâu',
    },
    {
      titleLine1: 'XẢ KHO THANH LÝ',
      titleLine2: 'GIá tốt chưa từng có',
      tagName: 'Xả kho thanh lý', 
    },
  ];

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [catResponse, tagResponse] = await Promise.all([getAllCategories(), getAllTags()]);
        if (catResponse.status === 200) setCategories(catResponse.data);
        if (tagResponse.status === 200) setTags(tagResponse.data);
      } catch (error) {
        console.error('Lỗi khi lấy danh mục và thẻ:', error);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    const fetchProductsForTab = async () => {
      if (categories.length === 0 || tags.length === 0) return;

      const current = tabs[currentTab];
      const category = categories.find(cat => cat.name.toLowerCase() === current.categoryName?.toLowerCase());
      const tag = tags.find(t => t.name.toLowerCase() === current.tagName.toLowerCase());

      if (tag) {
        try {
          const filterRequest = {
            categoryId: category ? category.id : null,
            tagId: tag.id,
            includeSubCategories: category ? true : false,
            inStock: 1,
          };
          const response = await filterProducts(filterRequest);
          if (response.status === 200) {
            setProducts(response.data.slice(0, maxProducts));
            setCurrentIndex(0); 
          } else {
            console.error('Lọc sản phẩm thất bại');
            setProducts([]);
          }
        } catch (error) {
          console.error('Lỗi khi lấy sản phẩm:', error);
          setProducts([]);
        }
      } else {
        console.error(`Không tìm thấy thẻ "${current.tagName}"`);
        setProducts([]);
      }
    };

    fetchProductsForTab();
  }, [currentTab, categories, tags]);

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
    <div className="max-w-7xl mx-auto bg-white rounded-lg border pb-2 mb-4 mt-8 border-gray-300">
      <div className="flex justify-start mb-4 border-b-4 border-red-600">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setCurrentTab(index)}
            className={`px-6 py-3 text-center transition duration-300 ${
              currentTab === index
                ? 'bg-red-600 text-white rounded-tr-3xl'
                : 'bg-white text-black hover:bg-gray-100'
            }`}
          >
            <div className="font-bold uppercase">{tab.titleLine1}</div>
            <div className="text-sm">{tab.titleLine2}</div>
          </button>
        ))}
      </div>
      {products.length > 0 ? (
        <div className="relative">
          <button
            onClick={prevSlide}
            className="absolute left-[0px] top-1/2 transform -translate-y-1/2 bg-gray-100 opacity-80 rounded-full p-3 hover:bg-gray-200 transition duration-300 z-10"
          >
            <FaArrowLeft className="text-black opacity-80 text-xl hover:text-red-600 transition duration-300" />
          </button>
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-1000"
              style={{ transform: `translateX(-${currentIndex * 20}%)` }}
            >
              {displayProducts.map((product, index) => (
                <div key={`${product.id}-${index}`} className="flex-shrink-0 w-1/5 px-2">
                  <TagProductCard product={product} onHoverChange={setIsPaused} />
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={nextSlide}
            className="absolute right-[0px] top-1/2 transform -translate-y-1/2 bg-gray-100 opacity-80 rounded-full p-3 hover:bg-gray-200 transition duration-300 z-10"
          >
            <FaArrowRight className="text-black opacity-80 text-xl hover:text-red-600 transition duration-300" />
          </button>
        </div>
      ) : (
        <p className="text-center text-gray-600">Không có sản phẩm nào hiện tại.</p>
      )}
    </div>
  );
}