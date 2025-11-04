import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { changePassword } from '../../../../api/APIs/authApi';

const PasswordTab = () => {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Mật khẩu mới và nhập lại mật khẩu không khớp');
      return;
    }
    setIsLoading(true);
    try {
      const response = await changePassword(formData.oldPassword, formData.newPassword, formData.confirmPassword);
      if (response.status === 200) {
        toast.success('Thay đổi mật khẩu thành công');
        setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        switch (response.status) {
          case 203:
            toast.error('Mật khẩu hiện tại không đúng');
            break;
          case 422:
            toast.error('Dữ liệu không hợp lệ');
            break;
          case 404:
            toast.error('Không tìm thấy tài khoản');
            break;
          default:
            toast.error('Thay đổi mật khẩu thất bại');
        }
      }
    } catch (error) {
      toast.error('Lỗi hệ thống. Vui lòng thử lại.');
      console.error('Change password error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-black mb-4">Thay đổi mật khẩu</h2>
      <hr className="border-gray-300 mb-4" />
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col">
          <label className="font-medium text-gray-700 mb-1">Mật khẩu hiện tại:</label>
          <input
            type="password"
            name="oldPassword"
            value={formData.oldPassword}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-red-500"
          />
        </div>
        <div className="flex flex-col">
          <label className="font-medium text-gray-700 mb-1">Mật khẩu mới:</label>
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            required
            minLength={6}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-red-500"
          />
        </div>
        <div className="flex flex-col">
          <label className="font-medium text-gray-700 mb-1">Nhập lại mật khẩu mới:</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-red-500"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Đang xử lý...' : 'Thay đổi'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PasswordTab;