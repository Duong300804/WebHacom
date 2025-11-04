import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../../../api/APIs/authApi';

const ForgotPassword = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !email || !newPassword || !confirmPassword) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error('Email không hợp lệ');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Mật khẩu không khớp');
      return;
    }

    try {
      const response = await forgotPassword(username, email, newPassword, confirmPassword);
      console.log("Forgot Password API response:", response);

      if (response.status === 200) {
        toast.success('Đổi mật khẩu thành công');
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        switch (response.status) {
          case 404:
            toast.error('Tài khoản hoặc email không tồn tại');
            break;
          case 422:
            toast.error('Dữ liệu không hợp lệ');
            break;
          default:
            toast.error('Đổi mật khẩu thất bại');
        }
      }
    } catch (error) {
      toast.error('Lỗi hệ thống. Vui lòng thử lại.');
      console.error('Forgot Password error:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 to-blue-600">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="bg-white p-8 md:p-10 rounded-xl shadow-lg w-full max-w-md text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8">Quên Mật Khẩu</h1>
        <form onSubmit={handleSubmit}>
          <div className="relative mb-6">
            <input
              type="text"
              placeholder="Tên tài khoản"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500 transition duration-300"
              required
            />
            <FaUser className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-500" />
          </div>

          <div className="relative mb-6">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500 transition duration-300"
              required
            />
            <FaEnvelope className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-500" />
          </div>

          <div className="relative mb-6">
            <input
              type="password"
              placeholder="Mật khẩu mới"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500 transition duration-300"
              required
            />
            <FaLock className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-500" />
          </div>

          <div className="relative mb-6">
            <input
              type="password"
              placeholder="Xác nhận mật khẩu"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500 transition duration-300"
              required
            />
            <FaLock className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-500" />
          </div>

          <div className="flex justify-between items-center mb-6 text-sm text-gray-600">
            <Link to="/login" className="text-blue-500 hover:underline">
              Quay lại trang đăng nhập
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-full hover:bg-blue-600 transition duration-300 font-semibold">
            Xác nhận
          </button>

          <div className="mt-6 text-sm text-gray-600">
            <p>
              Chưa có tài khoản?{' '}
              <Link to="/register" className="text-blue-500 hover:underline">
                Đăng ký
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;