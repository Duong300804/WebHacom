import { FaHome } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { FaArrowLeft} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function PaymentBreadcrumb() {
  const navigate = useNavigate();

  return (
    <div className="pt-6 pb-2">
      <div className="flex items-center space-x-2 text-lg font-semibold">
        <Link to="/" className="flex items-center text-blue-800 hover:text-blue-900">
          <FaHome className="mr-1" />
          Trang chủ
        </Link>
        <span className="text-neutral-500">&gt;</span>
        <Link to="/cart" className="text-blue-800 hover:text-blue-900">Giỏ hàng</Link>
        <span className="text-neutral-500">&gt;</span>
        <span className="text-neutral-500">Thanh toán</span>
      </div>
      {/* Quay lại giỏ hàng */}
      <button 
        onClick={() => navigate('/cart')}
        className="flex items-center text-blue-600 hover:text-blue-800 mt-4"
      >
        <FaArrowLeft className="mr-2" /> Quay lại giỏ hàng
      </button>
    </div>
    
  );
}