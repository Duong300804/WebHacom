import React, { useState } from 'react';
import { FaTimes, FaChevronDown } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { createUser } from '../../../../api/APIs/userApi';
import './Modal.css';

const ModalCreate = ({ isOpen, onClose, onUserCreated }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'CUSTOMER',
    fullName: '',
    phone: '',
    address: '',
    position: 'SALE',
  });

  const positionOptions = [
    { value: 'SALE', label: 'Bán hàng' },
    { value: 'TECHNICIAN', label: 'Kỹ thuật viên' },
    { value: 'SERVICE', label: 'Dịch vụ' },
    { value: 'WARRANTY', label: 'Bảo hành' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        fullName: formData.role === 'STAFF' ? formData.fullName : null,
        phone: formData.role === 'STAFF' ? formData.phone : null,
        address: formData.role === 'STAFF' ? formData.address : null,
        position: formData.role === 'STAFF' ? formData.position : null,
      };
      const response = await createUser(userData);
      if (response.status === 201) {
        toast.success('Tạo tài khoản thành công');
        onUserCreated();
        onClose();
        setFormData({
          username: '',
          email: '',
          password: '',
          role: 'CUSTOMER',
          fullName: '',
          phone: '',
          address: '',
          position: 'SALE',
        });
      } else {
        switch (response.status) {
          case 409:
            toast.error('Tên đăng nhập, email hoặc số điện thoại đã tồn tại');
            break;
          case 422:
            toast.error('Dữ liệu không hợp lệ');
            break;
          default:
            toast.error('Tạo tài khoản thất bại');
        }
      }
    } catch (error) {
      toast.error('Lỗi hệ thống. Vui lòng thử lại.');
      console.error('Create user error:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full animate-fadeIn">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Thêm tài khoản mới</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes size={20} />
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto pr-1 create-user-scroll-bar">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label className="font-medium text-gray-700">Tên tài khoản:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="border rounded-md px-2 py-1 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label className="font-medium text-gray-700">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="border rounded-md px-2 py-1 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label className="font-medium text-gray-700">Mật khẩu:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="border rounded-md px-2 py-1 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label className="font-medium text-gray-700">Loại tài khoản:</label>
            <div className="relative">
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="appearance-none w-full px-2 py-1 border rounded-md focus:outline-none focus:border-blue-500"
              >
                <option value="ADMIN">ADMIN</option>
                <option value="STAFF">STAFF</option>
                <option value="CUSTOMER">CUSTOMER</option>
              </select>
              <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" />
            </div>
          </div>
          {formData.role === 'STAFF' && (
            <>
              <div className="flex flex-col">
                <label className="font-medium text-gray-700">Họ và tên:</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="border rounded-md px-2 py-1 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex flex-col">
                <label className="font-medium text-gray-700">Số điện thoại:</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
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
                  required
                  className="border rounded-md px-2 py-1 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex flex-col">
                <label className="font-medium text-gray-700">Chức vụ:</label>
                <div className="relative">
                  <select
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    required
                    className="appearance-none w-full px-2 py-1 border rounded-md focus:outline-none focus:border-blue-500"
                  >
                    {positionOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" />
                </div>
              </div>
            </>
          )}
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
              Thêm
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
};

export default ModalCreate;