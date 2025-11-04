import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { updateUser } from '../../../../api/APIs/userApi';
import './Modal.css';

const ModalUpdate = ({ isOpen, onClose, onUserUpdated, user }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        phone: user.phone || '',
        address: user.address || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await updateUser(user.id, {
        username: user.username,
        email: user.email,
        role: user.role,
        fullName: formData.fullName,
        phone: formData.phone,
        address: formData.address,
      });
      if (response.status === 200) {
        toast.success('Cập nhật khách hàng thành công');
        onUserUpdated();
        onClose();
      } else {
        switch (response.status) {
          case 409:
            toast.error('Dữ liệu đã tồn tại');
            break;
          case 422:
            toast.error('Dữ liệu không hợp lệ');
            break;
          case 404:
            toast.error('Không tìm thấy khách hàng');
            break;
          default:
            toast.error('Cập nhật khách hàng thất bại');
        }
      }
    } catch (error) {
      toast.error('Lỗi hệ thống. Vui lòng thử lại.');
      console.error('Update user error:', error);
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full animate-fadeIn">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Cập nhật khách hàng</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label className="font-medium text-gray-700">Tên tài khoản:</label>
            <input
              type="text"
              name="username"
              value={user.username}
              disabled
              className="border rounded-md px-2 py-1 bg-gray-100 text-gray-600"
            />
          </div>
          <div className="flex flex-col">
            <label className="font-medium text-gray-700">Email:</label>
            <input
              type="email"
              name="email"
              value={user.email}
              disabled
              className="border rounded-md px-2 py-1 bg-gray-100 text-gray-600"
            />
          </div>
          <div className="flex flex-col">
            <label className="font-medium text-gray-700">Họ tên:</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="border rounded-md px-2 py-1 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label className="font-medium text-gray-700">SĐT:</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="border rounded-md px-2 py-1 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label className="font-medium text-gray-700">Địa chỉ:</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="border rounded-md px-2 py-1 focus:outline-none focus:border-blue-500"
            />
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

export default ModalUpdate;