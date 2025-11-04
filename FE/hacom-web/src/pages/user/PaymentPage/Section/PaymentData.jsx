import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PaymentBreadcrumb from './PaymentBreadcrumb';
import OrderInfo from './OrderInfo';
import PaymentInfo from './PaymentInfo';
import { getProductById } from '../../../../api/APIs/productApi';
import { createOrder } from '../../../../api/APIs/orderApi';
import { toast } from 'react-hot-toast';
import LoadingOrderModal from './LoadingOrderModal';
import PaymentSuccess from './PaymentSuccess';

export default function PaymentData() {
  const navigate = useNavigate();
  const getCartKey = () => {
    const user = sessionStorage.getItem('username');
    return user ? `cart_${user}` : 'cart_guest';
  };

  const [checkoutItems, setCheckoutItems] = useState(() => {
    const storedCheckout = localStorage.getItem('checkoutItems');
    return storedCheckout ? JSON.parse(storedCheckout) : [];
  });

  const [products, setProducts] = useState([]);
  const [shippingMethod, setShippingMethod] = useState('delivery');
  const [deliveryType, setDeliveryType] = useState('standard');
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const fetchedProducts = await Promise.all(
        checkoutItems.map(async (item) => {
          const response = await getProductById(item.productId);
          return response.status === 200 ? response.data : null;
        })
      );
      setProducts(fetchedProducts.filter(Boolean));
    };
    fetchProducts();
  }, [checkoutItems]);

  const totalPrice = checkoutItems.reduce((sum, item) => {
    const product = products.find(p => p.id === item.productId);
    return sum + (product?.discountPrice || product?.price) * item.quantity;
  }, 0);

  const handlePlaceOrder = async () => {
    if (!address && shippingMethod === 'delivery') {
      toast.error('Vui lòng nhập địa chỉ giao hàng');
      return;
    }
    setShowLoadingModal(true);
  };

  const processOrder = async () => {
    try {
      const orderRequest = {
        shippingAddress: shippingMethod === 'pickup' ? 'Cửa hàng máy tính Hà Nội Computer: Số 131-133 Phố Lê Thanh Nghị, Đồng Tâm, Hai Bà Trưng, Hà Nội.' : address,
        shippingMethod: shippingMethod === 'delivery' ? deliveryType : 'pickup',
        paymentMethod: paymentMethod,
        note: note,
        orderItems: checkoutItems.map(item => ({ productId: item.productId, quantity: item.quantity })),
      };
      const response = await createOrder(orderRequest);
      if (response.status === 201) {
        setOrderId(response.data.id);
        setShowSuccess(true);
        // Xóa sản phẩm đã đặt khỏi giỏ hàng
        const cart = JSON.parse(localStorage.getItem(getCartKey()) || '[]');
        const remainingCart = cart.filter(cItem => !checkoutItems.some(chItem => chItem.productId === cItem.productId));
        localStorage.setItem(getCartKey(), JSON.stringify(remainingCart));
        window.dispatchEvent(new Event('cartUpdated'));
        // Xóa checkoutItems
        localStorage.removeItem('checkoutItems');
      } else {
        toast.error('Đặt hàng thất bại');
      }
    } catch (error) {
      toast.error('Lỗi hệ thống. Vui lòng thử lại.');
    }
  };

  if (showSuccess) {
    return <PaymentSuccess orderId={orderId} />;
  }

  return (
    <div className="bg-white max-w-7xl mx-auto px-4">
      <PaymentBreadcrumb />
      <div className="flex gap-4 mt-4">
        <div className="w-full md:w-2/3">
          <OrderInfo 
            checkoutItems={checkoutItems} 
            products={products} 
            shippingMethod={shippingMethod}
            setShippingMethod={setShippingMethod}
            deliveryType={deliveryType}
            setDeliveryType={setDeliveryType}
            address={address}
            setAddress={setAddress}
            note={note}
            setNote={setNote}
          />
        </div>
        <div className="w-full md:w-1/3">
          <PaymentInfo 
            totalPrice={totalPrice} 
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            onPlaceOrder={handlePlaceOrder}
            onAddMore={() => navigate('/')}
          />
        </div>
      </div>
      <LoadingOrderModal 
        isOpen={showLoadingModal} 
        onClose={() => setShowLoadingModal(false)} 
        processOrder={processOrder}
      />
    </div>
  );
}