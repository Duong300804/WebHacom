import React, { useState, useEffect } from 'react';
import { FaUser, FaListAlt, FaLock, FaSignOutAlt, FaBell } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { getProfile } from '../../../../api/APIs/authApi';
import InfoTab from './InfoTab';
import ChangePasswordTab from './ChangePasswordTab';
import OrderTab from './OrderTab';
import NoticeTab from './NoticeTab';
import ModalConfirmLogout from '../../Components/Modal/ModalConfirmLogout'; 

const AccountData = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || null);
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile();
        if (response.status === 200) {
          setUsername(response.data.username || '');
          setFullName(response.data.fullName || '');
          setEmail(response.data.email || '');
          setPhone(response.data.phone || '');
          setAddress(response.data.address || '');
          sessionStorage.setItem('username', response.data.username || '');
          sessionStorage.setItem('fullname', response.data.fullName || '');
          sessionStorage.setItem('email', response.data.email || '');
          sessionStorage.setItem('phone', response.data.phone || '');
          sessionStorage.setItem('address', response.data.address || '');
        } else {
          toast.error('Không thể tải thông tin tài khoản');
        }
      } catch (error) {
        toast.error('Lỗi hệ thống. Vui lòng thử lại.');
        console.error('Fetch profile error:', error);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    setActiveTab(location.state?.activeTab || null);
  }, [location]);

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('fullname');
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('phone');
    sessionStorage.removeItem('address');
    window.dispatchEvent(new Event('userChanged'));
    navigate('/');
  };

  const handleTabClick = (tab) => {
    if (tab === 'logout') {
      setIsLogoutModalOpen(true); 
    } else {
      setActiveTab(tab);
    }
  };

  const handleConfirmLogout = () => {
    handleLogout(); 
    setIsLogoutModalOpen(false);
  };

  const handleCancelLogout = () => {
    setIsLogoutModalOpen(false);
  };

  const renderContent = () => {
    if (!activeTab) {
      return (
        <p className="text-gray-700 text-lg font-semibold text-center py-10">
          Bạn đang ở trang tài khoản. Vui lòng chọn các mục bên trái để xem thông tin.
        </p>
      );
    }
    switch (activeTab) {
      case 'info':
        return (
          <InfoTab
            username={username}
            fullName={fullName}
            email={email}
            phone={phone}
            address={address}
          />
        );
      case 'orders':
        return (
          <OrderTab user={{ username, fullName, email, phone, address }}/>
        );
      case 'notices':
        return (
          <NoticeTab/>
        );
      case 'password':
        return (
          <ChangePasswordTab/>
        );
      case 'logout':
        return null;
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-100 py-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex gap-6">
          {/* Phần bên trái */}
          <div className="w-1/4 bg-white rounded-lg shadow-md p-6 self-start">
            {/* Phần đầu: Icon và text */}
            <div className="flex items-center mb-8">
              <div className="bg-red-500 p-3 rounded-full mr-3">
                <FaUser className="text-3xl text-white" />
              </div>
              <div>
                <p className="text-gray-600 text-base font-semibold">Tài khoản của</p>
                <p className="text-black font-bold text-lg">{fullName || username}</p>
              </div>
            </div>
            {/* Các button */}
            <ul className="space-y-4">
              <li>
                <button
                  onClick={() => handleTabClick('info')}
                  className={`w-full flex items-center gap-4 py-3 px-4 rounded-lg transition ${
                    activeTab === 'info' ? 'bg-red-600 text-white' : 'bg-gray-200 text-black hover:bg-red-600 hover:text-white'
                  }`}
                >
                  <FaUser className="text-lg" />
                  <span>Thông tin tài khoản</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleTabClick('orders')}
                  className={`w-full flex items-center gap-4 py-3 px-4 rounded-lg transition ${
                    activeTab === 'orders' ? 'bg-red-600 text-white' : 'bg-gray-200 text-black hover:bg-red-600 hover:text-white'
                  }`}
                >
                  <FaListAlt className="text-lg" />
                  <span>Danh sách đơn hàng</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleTabClick('notices')}
                  className={`w-full flex items-center gap-4 py-3 px-4 rounded-lg transition ${
                    activeTab === 'notices' ? 'bg-red-600 text-white' : 'bg-gray-200 text-black hover:bg-red-600 hover:text-white'
                  }`}
                >
                  <FaBell className="text-lg" />
                  <span>Thông báo</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleTabClick('password')}
                  className={`w-full flex items-center gap-4 py-3 px-4 rounded-lg transition ${
                    activeTab === 'password' ? 'bg-red-600 text-white' : 'bg-gray-200 text-black hover:bg-red-600 hover:text-white'
                  }`}
                >
                  <FaLock className="text-lg" />
                  <span>Thay đổi mật khẩu</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleTabClick('logout')}
                  className={`w-full flex items-center gap-4 py-3 px-4 rounded-lg transition ${
                    activeTab === 'logout' ? 'bg-red-600 text-white' : 'bg-gray-200 text-black hover:bg-red-600 hover:text-white'
                  }`}
                >
                  <FaSignOutAlt className="text-lg" />
                  <span>Thoát tài khoản</span>
                </button>
              </li>
            </ul>
          </div>
          {/* Phần bên phải */}
          <div className="flex-grow bg-white rounded-lg shadow-md border border-gray-300 max-h-[80vh] overflow-y-auto sidebar-scrollbar">
            {renderContent()}
          </div>
        </div>
      </div>
      <ModalConfirmLogout
        isOpen={isLogoutModalOpen}
        onClose={handleCancelLogout}
        onConfirm={handleConfirmLogout}
      />
    </div>
  );
};

export default AccountData;