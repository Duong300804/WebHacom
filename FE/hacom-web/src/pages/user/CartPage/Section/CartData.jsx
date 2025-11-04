import { useParams, useLocation, useNavigate  } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getProductById } from '../../../../api/APIs/productApi'; 
import CartBreadcrumb from './CartBreadcrumb';
import ProductList from './ProductList';
import CartSummary from './CartSummary';
import { toast } from 'react-hot-toast';
import emptyCartImg from '../../../../assets/images/cart-empty.png';
import { FaArrowLeft } from 'react-icons/fa';

export default function CartData() {
  const location = useLocation();
  const navigate = useNavigate();

  const getCartKey = () => {
    const user = sessionStorage.getItem('username');
    return user ? `cart_${user}` : 'cart_guest';
  };
  
  const [cartItems, setCartItems] = useState(() => {
    const storedCart = localStorage.getItem(getCartKey());
    return storedCart ? JSON.parse(storedCart).map(item => ({ ...item, selected: false })) : [];
  });
  const [products, setProducts] = useState([]); 

  useEffect(() => {
    const fetchProducts = async () => {
      const fetchedProducts = await Promise.all(
        cartItems.map(async (item) => {
          const response = await getProductById(item.productId);
          return response.status === 200 ? response.data : null;
        })
      );
      setProducts(fetchedProducts.filter(Boolean));
    };
    fetchProducts();
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem(getCartKey(), JSON.stringify(cartItems));
    window.dispatchEvent(new Event('cartUpdated'));
  }, [cartItems]);

  useEffect(() => {
    const handleUserChange = () => {
    const storedCart = localStorage.getItem(getCartKey());
    setCartItems(storedCart ? JSON.parse(storedCart).map(item => ({ ...item, selected: false })) : []);
    };
    window.addEventListener('userChanged', handleUserChange);
    return () => {
        window.removeEventListener('userChanged', handleUserChange);
    };
    }, []);

  // Xử lý mua ngay từ redirect
  useEffect(() => {
    const boughtProductId = location.state?.boughtProductId;
    if (boughtProductId) {
      setCartItems(prev => prev.map(item => 
        item.productId === boughtProductId ? { ...item, selected: true } : item
      ));
    }
  }, [location.state]);

  const handleSelectAll = (checked) => {
    setCartItems(prev => prev.map(item => ({ ...item, selected: checked })));
  };

  const handleSelectItem = (productId, checked) => {
    setCartItems(prev => prev.map(item => 
      item.productId === productId ? { ...item, selected: checked } : item
    ));
  };

  const handleQuantityChange = (productId, newQuantity) => {
    const product = products.find(p => p.id === productId);
    if (newQuantity > product.inStock) {
      toast.error('Số lượng vượt quá hàng tồn kho');
      return;
    }
    if (newQuantity < 1) return;
    setCartItems(prev => prev.map(item => 
      item.productId === productId ? { ...item, quantity: newQuantity } : item
    ));
  };

  const handleRemoveItem = (productId) => {
    setCartItems(prev => prev.filter(item => item.productId !== productId));
    toast.success('Đã xóa sản phẩm khỏi giỏ hàng');
  };

  const handleRemoveAll = () => {
    setCartItems([]);
    toast.success('Đã xóa các sản phẩm khỏi giỏ hàng');
  };

  const selectedCount = cartItems.filter(item => item.selected).length;
  const totalItems = cartItems.length;
  const totalPrice = cartItems.reduce((sum, item) => {
    if (!item.selected) return sum;
    const product = products.find(p => p.id === item.productId);
    return sum + (product?.discountPrice || product?.price) * item.quantity;
  }, 0);

   if (totalItems === 0) {
    return (
      <div className="text-center py-16">
        <img 
          src={emptyCartImg} 
          alt="Giỏ hàng trống" 
          className="mx-auto mb-6 w-48 h-48 object-contain"
        />
        <p className="text-2xl font-bold mb-4">
          Không có sản phẩm nào trong giỏ hàng, vui lòng quay lại
        </p>
        <button
          onClick={() => navigate('/')}
          className="text-red-500 hover:text-red-600 flex items-center justify-center gap-2 text-lg mx-auto">
          <FaArrowLeft className="text-lg" />  Quay lại trang chủ
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white max-w-7xl mx-auto px-4">
      <CartBreadcrumb />
      <div className="flex gap-4 mt-4">
        <div className="w-full md:w-2/3">
          <ProductList 
            cartItems={cartItems}
            products={products}
            onSelectAll={handleSelectAll}
            onSelectItem={handleSelectItem}
            onQuantityChange={handleQuantityChange}
            onRemoveItem={handleRemoveItem}
            onRemoveAll={handleRemoveAll}
            selectedCount={selectedCount}
            totalItems={totalItems}
          />
        </div>
        <div className="w-full md:w-1/3">
          <CartSummary totalPrice={totalPrice} cartItems={cartItems}/>
        </div>
      </div>
    </div>
  );
}