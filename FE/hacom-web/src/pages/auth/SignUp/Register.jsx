import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { FaUser, FaLock, FaEnvelope } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { register } from '../../../api/APIs/authApi';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !email || !password || !confirmPassword) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error('Email không hợp lệ');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Mật khẩu không khớp');
      return;
    }
    try {
      const response = await register(username, email, password);
      console.log("Register API response:", response);
      
      if (response.status === 201) {
        toast.success('Đăng ký thành công');
        // Lưu token và username
        sessionStorage.setItem('token', response.data.accessToken);
        sessionStorage.setItem('username', response.data.username);
        window.dispatchEvent(new Event('userChanged'));

        // Redirect đến trang chủ (giả sử role luôn là USER)
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        // Xử lý lỗi theo mã status từ backend
        switch (response.status) {
          case 409:
            toast.error('Tài khoản hoặc email đã tồn tại');
            break;
          case 422:
            toast.error('Dữ liệu không hợp lệ');
            break;
          default:
            toast.error('Đăng ký thất bại');
        }
      }
    } catch (error) {
      toast.error('Lỗi hệ thống. Vui lòng thử lại.');
      console.error('Register error:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 to-blue-600">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="bg-white p-8 md:p-10 rounded-xl shadow-lg w-full max-w-md text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8">Đăng Ký</h1>
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
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            Đăng ký
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;