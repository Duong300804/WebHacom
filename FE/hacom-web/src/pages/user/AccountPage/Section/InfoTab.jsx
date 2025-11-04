import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { updateProfile } from '../../../../api/APIs/authApi';

const InfoTab = ({ username, fullName, email, phone, address }) => {
  const [formData, setFormData] = useState({
    username: username || '',
    email: email || '',
    fullName: fullName || '',
    phone: phone || '',
    address: address || '',
  });

  useEffect(() => {
    setFormData({
      username: username || '',
      email: email || '',
      fullName: fullName || '',
      phone: phone || '',
      address: address || '',
    });
  }, [username, fullName, email, phone, address]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const profileData = {
        fullName: formData.fullName,
        phone: formData.phone,
        address: formData.address,
        email: formData.email,
      };
      const response = await updateProfile(profileData);
      if (response.status === 200) {
        toast.success('Cập nhật thông tin thành công');
        sessionStorage.setItem('fullname', formData.fullName);
        sessionStorage.setItem('email', formData.email);
        sessionStorage.setItem('phone', formData.phone);
        sessionStorage.setItem('address', formData.address);
      } else {
        switch (response.status) {
          case 409:
            toast.error('Email hoặc số điện thoại đã tồn tại');
            break;
          case 422:
            toast.error('Dữ liệu không hợp lệ');
            break;
          case 404:
            toast.error('Không tìm thấy tài khoản');
            break;
          default:
            toast.error('Cập nhật thông tin thất bại');
        }
      }
    } catch (error) {
      toast.error('Lỗi hệ thống. Vui lòng thử lại.');
      console.error('Update profile error:', error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-black mb-4">Cập nhật thông tin cá nhân</h2>
      <hr className="border-gray-300 mb-4" />
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col">
          <label className="font-medium text-gray-700 mb-1">Tên đăng nhập:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            disabled
            className="border border-gray-300 rounded-md px-3 py-2 bg-gray-100 text-gray-700 focus:outline-none"
          />
        </div>
        <div className="flex flex-col">
          <label className="font-medium text-gray-700 mb-1">Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-red-500"
          />
        </div>
        <div className="flex flex-col">
          <label className="font-medium text-gray-700 mb-1">Họ tên:</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-red-500"
          />
        </div>
        <div className="flex flex-col">
          <label className="font-medium text-gray-700 mb-1">Số điện thoại:</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-red-500"
          />
        </div>
        <div className="flex flex-col">
          <label className="font-medium text-gray-700 mb-1">Địa chỉ:</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-red-500"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition"
          >
            Thay đổi
          </button>
        </div>
      </form>
    </div>
  );
};

export default InfoTab;