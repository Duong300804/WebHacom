import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { FaUser, FaLock } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { login, getProfile } from '../../../api/APIs/authApi';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(username, password);
      // console.log("Login API response:", response);
      
      if (response.status === 200) {
        toast.success('Đăng nhập thành công');
        // Lưu token, username, role
        sessionStorage.setItem('token', response.data.accessToken);
        sessionStorage.setItem('username', response.data.username);
        sessionStorage.setItem('role', response.data.role);

        try {
          const profileResponse = await getProfile();
          if (profileResponse.status === 200) {
            sessionStorage.setItem('fullname', profileResponse.data.fullName);
          }
        } catch (profileError) {
          console.error('Fetch profile error:', profileError);
        }

        // Redirect theo role
        if (response.data.role === 'CUSTOMER') {
            setTimeout(() => {
                navigate('/');
            }, 1500);
        } else if (response.data.role === 'ADMIN' || response.data.role === 'STAFF') {
            setTimeout(() => {
                navigate('/admin/dashboard');
            }, 1500);
        }
        window.dispatchEvent(new Event('userChanged'));
      } else {
        // Xử lý lỗi theo mã code từ backend
        switch (response.status) {
          case 404:
            toast.error('Tài khoản không tồn tại');
            break;
          case 203:
            toast.error('Tài khoản hoặc mật khẩu không đúng');
            break;
          case 422:
            toast.error('Dữ liệu không hợp lệ');
            break;
          default:
            toast.error('Đăng nhập thất bại');
        }
      }
    } catch (error) {
      toast.error('Lỗi hệ thống. Vui lòng thử lại.');
      console.error('Login error:', error);
    }
  };

    return(
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 to-blue-600">
        <Toaster position="top-center" reverseOrder={false} />
        <div className="bg-white p-8 md:p-10 rounded-xl shadow-lg w-full max-w-md text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8">Đăng Nhập</h1>
            <form onSubmit={handleSubmit}>
            <div className="relative mb-6">
                <input
                type="text"
                placeholder="Tài khoản"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500 transition duration-300"
                required
                />
                <FaUser className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-500" />
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

            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 text-sm text-gray-600">
                <label className="flex items-center mb-2 sm:mb-0">
                <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="mr-2"
                />
                Remember me
                </label>
                <Link to="/forgot-password" className="text-blue-500 hover:underline">
                Quên mật khẩu
                </Link>
            </div>

            <button
                type="submit"
                className="w-full bg-blue-500 text-white py-3 rounded-full hover:bg-blue-600 transition duration-300 font-semibold"
            >
                Đăng nhập
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
}

export default Login;