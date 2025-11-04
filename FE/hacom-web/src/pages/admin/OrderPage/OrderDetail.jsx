import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { FaHome, FaTimes } from 'react-icons/fa';
import { getOrderById } from '../../../api/APIs/orderApi';
import { getUserById } from '../../../api/APIs/userApi';
import { getProductById } from '../../../api/APIs/productApi';
import Header from '../Components/Header';
import Sidebar from '../Components/Sidebar';
import Footer from '../Components/Footer';

const OrderDetail = () => {
  const { id } = useParams();
  const [currentTab, setCurrentTab] = useState('general');
  const [order, setOrder] = useState(null);
  const [user, setUser] = useState(null);
  const [productDetails, setProductDetails] = useState({});
  const navigate = useNavigate();

  const statusMap = {
    PENDING: 'Đang chờ',
    CONFIRMED: 'Đã xác nhận',
    SHIPPED: 'Đang giao',
    DELIVERED: 'Đã giao',
    CANCELLED: 'Đã hủy',
  };

  const shippingMethodMap = {
    'standard': 'Giao hàng tiêu chuẩn',
    'fast': 'Giao hàng nhanh',
    'express': 'Giao hàng hỏa tốc',
    'post': 'Giao hàng qua bưu điện',
    'pickup': 'Nhận tại cửa hàng',
  };

  const paymentMethodMap = {
    'cod': 'Thanh toán khi nhận hàng',
    'transfer': 'Thanh toán bằng chuyển khoản',
    'card': 'Thanh toán bằng thẻ quốc tế Visa, Master',
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    try {
      const response = await getOrderById(id);
      if (response.status === 200) {
        setOrder(response.data);
        const userRes = await getUserById(response.data.userId);
        if (userRes.status === 200) {
          setUser(userRes.data);
        }
        const details = {};
        for (const item of response.data.orderItems) {
          const productRes = await getProductById(item.productId);
          if (productRes.status === 200) {
            details[item.productId] = productRes.data;
          }
        }
        setProductDetails(details);
      } else {
        toast.error('Không thể tải thông tin đơn hàng');
      }
    } catch (error) {
      toast.error('Lỗi hệ thống. Vui lòng thử lại.');
      console.error('Detail error:', error);
    }
  };

  if (!order || !user) return <div className="text-center p-4">Đang tải...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-center" reverseOrder={false} />
      <Header username={sessionStorage.getItem('username')} />
      <Sidebar username={sessionStorage.getItem('username')} />
      <div className="p-4 sm:ml-64 pt-20">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-4 border-b-2 border-blue-700 pb-2">
            <h2 className="text-2xl font-bold text-blue-700">CHI TIẾT ĐƠN HÀNG</h2>
            <div className="flex items-center gap-4">
              <nav className="text-sm text-gray-600 flex items-center flex-nowrap">
                <span className="flex items-center gap-1">
                  <FaHome className="text-gray-600" />
                  <span> Trang chủ</span>
                </span>
                <span className="mx-2">{'>'}</span>
                <Link to="/admin/order" className="hover:underline">Quản lý đơn hàng</Link>
                <span className="mx-2">{'>'}</span>
                <span className="font-medium text-gray-800">Chi tiết</span>
              </nav>
              <button
                onClick={() => navigate('/admin/order')}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={20} />
              </button>
            </div>
          </div>
          <div className="bg-white shadow-md rounded-lg p-4">
            <div className="flex mb-4">
              <button
                onClick={() => setCurrentTab('general')}
                className={`px-4 py-2 rounded-t-lg ${currentTab === 'general' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
              >
                Thông tin chung
              </button>
              <button
                onClick={() => setCurrentTab('items')}
                className={`px-4 py-2 rounded-t-lg ${currentTab === 'items' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
              >
                Chi tiết đơn hàng
              </button>
            </div>
            {currentTab === 'general' && (
              <div className="space-y-3 overflow-x-auto overflow-y-auto max-h-[52vh] border rounded-md">
                <h3 className="text-lg font-semibold text-gray-800">Thông tin người đặt hàng</h3>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700 w-40">Họ tên:</span>
                  <span className="border rounded-md px-2 py-1 bg-gray-50 text-gray-800 flex-1 text-right break-words">{user.fullName || user.username}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700 w-40">Email:</span>
                  <span className="border rounded-md px-2 py-1 bg-gray-50 text-gray-800 flex-1 text-right break-words">{user.email}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700 w-40">Số điện thoại:</span>
                  <span className="border rounded-md px-2 py-1 bg-gray-50 text-gray-800 flex-1 text-right break-words">{user.phone || 'Không có'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700 w-40">Địa chỉ:</span>
                  <span className="border rounded-md px-2 py-1 bg-gray-50 text-gray-800 flex-1 text-right break-words">{user.address || 'Không có'}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mt-4">Thông tin giao hàng</h3>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700 w-40">Mã đơn hàng:</span>
                  <span className="border rounded-md px-2 py-1 bg-gray-50 text-gray-800 flex-1 text-right break-words">{order.id}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700 w-40">Ngày đặt hàng:</span>
                  <span className="border rounded-md px-2 py-1 bg-gray-50 text-gray-800 flex-1 text-right break-words">{order.orderDateFormatted}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700 w-40">Địa chỉ giao hàng:</span>
                  <span className="border rounded-md px-2 py-1 bg-gray-50 text-gray-800 flex-1 text-right break-words">{order.shippingAddress}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700 w-40">Phương thức giao hàng:</span>
                  <span className="border rounded-md px-2 py-1 bg-gray-50 text-gray-800 flex-1 text-right break-words">{shippingMethodMap[order.shippingMethod.toLowerCase()] || order.shippingMethod}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700 w-40">Phương thức thanh toán:</span>
                  <span className="border rounded-md px-2 py-1 bg-gray-50 text-gray-800 flex-1 text-right break-words">{paymentMethodMap[order.paymentMethod.toLowerCase()] || order.paymentMethod}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700 w-40">Ghi chú:</span>
                  <span className="border rounded-md px-2 py-1 bg-gray-50 text-gray-800 flex-1 text-right break-words">{order.note || 'Không có'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700 w-40">Tổng tiền:</span>
                  <span className="border rounded-md px-2 py-1 bg-gray-50 text-gray-800 flex-1 text-right break-words">{order.totalAmountFormatted} VNĐ</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700 w-40">Trạng thái:</span>
                  <span className="border rounded-md px-2 py-1 bg-gray-50 text-gray-800 flex-1 text-right break-words">{statusMap[order.status.toUpperCase()] || order.status}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700 w-40">Ngày tạo:</span>
                  <span className="border rounded-md px-2 py-1 bg-gray-50 text-gray-800 flex-1 text-right break-words">{new Date(order.createdAt).toLocaleString('vi-VN')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700 w-40">Ngày cập nhật:</span>
                  <span className="border rounded-md px-2 py-1 bg-gray-50 text-gray-800 flex-1 text-right break-words">{order.updatedAt ? new Date(order.updatedAt).toLocaleString('vi-VN') : 'Không có dữ liệu'}</span>
                </div>
              </div>
            )}
            {currentTab === 'items' && (
              <div className="space-y-4 overflow-x-auto overflow-y-auto max-h-[52vh] border rounded-md">
                {order.orderItems.map((item, index) => {
                  const product = productDetails[item.productId];
                  if (!product) return null;
                  const mainImage = product.images.find(img => img.main) || product.images[0];
                  return (
                    <div key={index} className="flex gap-4 border-b pb-2">
                      <img src={`${import.meta.env.VITE_IMAGE_BASE_URL}${mainImage?.imageUrl}`} alt={product.name} className="w-24 h-24 object-cover" />
                      <div className="flex-1">
                        <p className="font-medium">{product.name}</p>
                        <p>Số lượng: x{item.quantity}</p>
                        <p>
                          Giá: <span className="line-through">{product.priceFormatted} VNĐ</span> <span className="text-red-500">{item.priceAtPurchaseFormatted} VNĐ</span>
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div className="text-right font-bold">
                  Tổng tiền: <span className="text-red-500">{order.totalAmountFormatted} VNĐ</span>
                </div>
              </div>
            )}
            <div className="flex justify-end mt-6">
              <button
                onClick={() => navigate('/admin/order')}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OrderDetail;