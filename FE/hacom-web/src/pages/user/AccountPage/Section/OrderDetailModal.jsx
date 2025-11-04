import React from 'react';
import { FaTimes } from 'react-icons/fa';
import '../../../admin/OrderPage/Modal/Modal.css'

const OrderDetailModal = ({ order, onClose, productDetails, user}) => {
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl mx-4 my-8 max-h-[80vh] overflow-y-auto p-6 relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <FaTimes size={24} />
        </button>
        
        <h2 className="text-2xl font-bold text-blue-700 mb-4">CHI TIẾT ĐƠN HÀNG #{order.id}</h2>
        
        {/* Thông tin người đặt hàng */}
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Thông tin người đặt hàng</h3>
        <div className="space-y-3 mb-6">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700 w-60">Họ tên:</span>
            <span className="border rounded-md px-2 py-1 bg-gray-50 text-gray-800 flex-1 text-right break-words">{user.fullName || user.username}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700 w-60">Email:</span>
            <span className="border rounded-md px-2 py-1 bg-gray-50 text-gray-800 flex-1 text-right break-words">{user.email}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700 w-60">Số điện thoại:</span>
            <span className="border rounded-md px-2 py-1 bg-gray-50 text-gray-800 flex-1 text-right break-words">{user.phone || 'Không có'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700 w-60">Địa chỉ:</span>
            <span className="border rounded-md px-2 py-1 bg-gray-50 text-gray-800 flex-1 text-right break-words">{user.address || 'Không có'}</span>
          </div>
        </div>

        {/* Thông tin giao hàng */}
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Thông tin giao hàng</h3>
        <div className="space-y-3 mb-6">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700 w-60">Mã đơn hàng:</span>
            <span className="border rounded-md px-2 py-1 bg-gray-50 text-gray-800 flex-1 text-right break-words">{order.id}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700 w-60">Ngày đặt hàng:</span>
            <span className="border rounded-md px-2 py-1 bg-gray-50 text-gray-800 flex-1 text-right break-words">{order.orderDateFormatted}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700 w-60">Địa chỉ giao hàng:</span>
            <span className="border rounded-md px-2 py-1 bg-gray-50 text-gray-800 flex-1 text-right break-words">{order.shippingAddress}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700 w-60">Phương thức giao hàng:</span>
            <span className="border rounded-md px-2 py-1 bg-gray-50 text-gray-800 flex-1 text-right break-words">{shippingMethodMap[order.shippingMethod.toLowerCase()] || order.shippingMethod}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700 w-60">Phương thức thanh toán:</span>
            <span className="border rounded-md px-2 py-1 bg-gray-50 text-gray-800 flex-1 text-right break-words">{paymentMethodMap[order.paymentMethod.toLowerCase()] || order.paymentMethod}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700 w-60">Ghi chú:</span>
            <span className="border rounded-md px-2 py-1 bg-gray-50 text-gray-800 flex-1 text-right break-words">{order.note || 'Không có'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700 w-60">Tổng tiền:</span>
            <span className="border rounded-md px-2 py-1 bg-gray-50 text-gray-800 flex-1 text-right break-words">{order.totalAmountFormatted} VNĐ</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700 w-60">Trạng thái:</span>
            <span className="border rounded-md px-2 py-1 bg-gray-50 text-gray-800 flex-1 text-right break-words">{statusMap[order.status.toUpperCase()] || order.status}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700 w-60">Ngày tạo:</span>
            <span className="border rounded-md px-2 py-1 bg-gray-50 text-gray-800 flex-1 text-right break-words">{new Date(order.createdAt).toLocaleString('vi-VN')}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700 w-60">Ngày cập nhật:</span>
            <span className="border rounded-md px-2 py-1 bg-gray-50 text-gray-800 flex-1 text-right break-words">{order.updatedAt ? new Date(order.updatedAt).toLocaleString('vi-VN') : 'Không có'}</span>
          </div>
        </div>

        {/* Danh sách sản phẩm */}
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Danh sách sản phẩm</h3>
        <div className="space-y-4">
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
      </div>
    </div>
  );
};

export default OrderDetailModal;