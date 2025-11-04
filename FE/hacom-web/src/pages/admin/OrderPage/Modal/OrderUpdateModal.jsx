import React, { useState } from 'react';
import { FaTimes, FaChevronDown } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { updateOrder } from '../../../../api/APIs/orderApi';
import './Modal.css';

const OrderUpdateModal = ({ isOpen, onClose, onOrderUpdated, order }) => {
  const [status, setStatus] = useState(order ? order.status.toUpperCase() : '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updateRequest = { status };
      const response = await updateOrder(order.id, updateRequest);
      if (response.status === 200) {
        toast.success('Cập nhật đơn hàng thành công');
        onOrderUpdated();
        onClose();
      } else {
        switch (response.status) {
          case 422:
            toast.error('Dữ liệu không hợp lệ');
            break;
          case 404:
            toast.error('Không tìm thấy đơn hàng');
            break;
          default:
            toast.error('Cập nhật đơn hàng thất bại');
        }
      }
    } catch (error) {
      toast.error('Lỗi hệ thống. Vui lòng thử lại.');
      console.error('Update order error:', error);
    }
  };

  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full animate-fadeIn">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Cập nhật đơn hàng</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label className="font-medium text-gray-700">Mã đơn hàng:</label>
            <input
              type="text"
              value={order.id}
              disabled
              className="border rounded-md px-2 py-1 bg-gray-100"
            />
          </div>
          <div className="flex flex-col">
            <label className="font-medium text-gray-700">Ngày đặt hàng:</label>
            <input
              type="text"
              value={order.orderDateFormatted}
              disabled
              className="border rounded-md px-2 py-1 bg-gray-100"
            />
          </div>
          <div className="flex flex-col">
            <label className="font-medium text-gray-700">Trạng thái:</label>
            <div className="relative">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="appearance-none w-full px-2 py-1 border rounded-md focus:outline-none focus:border-blue-500"
              >
                <option value="PENDING">Đang chờ</option>
                <option value="CONFIRMED">Đã xác nhận</option>
                <option value="SHIPPED">Đang giao</option>
                <option value="DELIVERED">Đã giao</option>
                <option value="CANCELLED">Đã hủy</option>
              </select>
              <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
            >
              Cập nhật
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderUpdateModal;