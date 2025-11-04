import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaPhoneAlt, FaStore, FaHeadset, FaTools, FaGift, FaUser, FaSignInAlt, FaUserPlus, FaSignOutAlt, FaBell, FaLock, FaListAlt } from 'react-icons/fa';
import ModalConfirmLogout from '../../Modal/ModalConfirmLogout';

const UserMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(null);
  const [timeoutId, setTimeoutId] = useState(null);
  const [username, setUsername] = useState(sessionStorage.getItem('username') || '');
  const [fullName, setFullName] = useState(sessionStorage.getItem('fullname') || '');
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  useEffect(() => {
    const handleStorageChange = () => {
      setFullName(sessionStorage.getItem('fullname') || '');
      setUsername(sessionStorage.getItem('username') || '');
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleModalHover = (modal) => {
    if (timeoutId) clearTimeout(timeoutId);
    setIsModalOpen(modal);
  };

  const handleModalLeave = () => {
    const id = setTimeout(() => {
      setIsModalOpen(null);
    }, 300);
    setTimeoutId(id);
  };

  const handleDropdownHover = (dropdown) => {
    if (timeoutId) clearTimeout(timeoutId);
    setIsDropdownOpen(dropdown);
  };

  const handleDropdownLeave = () => {
    const id = setTimeout(() => {
      setIsDropdownOpen(null);
    }, 300);
    setTimeoutId(id);
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('fullname');
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('phone');
    sessionStorage.removeItem('address');
    setUsername('');
    navigate('/');
  };

  const handleAccountClick = (tab = null) => {
    if (username && tab !== 'logout') {
      navigate('/account', { state: { activeTab: tab } });
    } else if (tab === 'logout') {
      setIsLogoutModalOpen(true);
    }
  };

  const handleConfirmLogout = () => {
    handleLogout(); 
    setIsLogoutModalOpen(false);
  };

  const handleCancelLogout = () => {
    setIsLogoutModalOpen(false);
  };

  const dropdownItems = {
    store: [
      { label: 'Tìm cửa hàng gần nhất', link: '#' },
    ],
    support: [
      { label: 'Chính sách, quy định chung', link: '#' },
      { label: 'Chính sách giao hàng', link: '#' },
      { label: 'Chính sách bảo hành', link: '#' },
      { label: 'Chính sách cho doanh nghiệp', link: '#' },
      { label: 'Chính sách bảo hành chính hãng', link: '#' },
      { label: 'Hướng dẫn mua hàng trực tuyến', link: '#' },
      { label: 'Hướng dẫn thanh toán', link: '#' },
      { label: 'Hướng dẫn mua hàng trả góp', link: '#' },
    ],
    service: [
      { label: 'Tra cứu đơn hàng', link: '#' },
      { label: 'Tra cứu bảo hành', link: '#' },
      { label: 'In hóa đơn điện tử', link: '#' },
      { label: 'Góp ý, khiếu nại', link: '#' },
      { label: 'Dịch vụ sửa chữa, lắp đặt', link: '#' },
      { label: 'Dịch vụ thu cũ, đổi mới', link: '#' },
    ],
    promotion: [
      { label: 'Khuyến mãi Laptop', link: '#' },
      { label: 'Khuyến mãi PC', link: '#' },
      { label: 'Khuyến mãi linh kiện', link: '#' },
      { label: 'Khuyến mãi phụ kiện', link: '#' },
      { label: 'Give away', link: '#' },
    ],
  };

  const modalItems = {
    'Mua hàng online': 'Nội dung cho Mua hàng online (sẽ được cập nhật sau)',
    'Miền Bắc': 'Nội dung cho Miền Bắc (sẽ được cập nhật sau)',
    'Miền Trung': 'Nội dung cho Miền Trung (sẽ được cập nhật sau)',
    'Miền Nam': 'Nội dung cho Miền Nam (sẽ được cập nhật sau)',
  };

  return (
    <header className="bg-gray-200 text-black">
      {/* Top Bar */}
      <div className="bg-gray-300 py-2">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-2 text-sm">
          {/* Left: Phone Info */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <FaPhoneAlt className="text-red-500 text-xs" />
            <span className="font-semibold">Gọi mua hàng: 1900.1903</span>
          </div>
          {/* Right: Buttons and Dropdowns */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Modal Buttons */}
            {['Mua hàng online', 'Miền Bắc', 'Miền Trung', 'Miền Nam'].map((item, index) => (
              <div
                key={index}
                className="relative"
                onMouseEnter={() => handleModalHover(item)}
                onMouseLeave={handleModalLeave}
              >
                <button className="flex items-center gap-1 px-3 py-1 border border-red-600 text-white rounded-full transition text-xs bg-[repeating-linear-gradient(to_right,red_0,#00f_50%,red_100%)] bg-[length:200%_200%] animate-gradient">
                   <FaPhoneAlt className="text-white text-[10px]" />
                  {item}
                </button>
                {isModalOpen === item && (
                  <div
                    className="absolute top-full mt-1 w-48 bg-white shadow-lg rounded-lg p-3 z-50 text-xs"
                    onMouseEnter={() => clearTimeout(timeoutId)}
                    onMouseLeave={handleModalLeave}
                  >
                    <p className="text-gray-700">{modalItems[item]}</p>
                  </div>
                )}
              </div>
            ))}
            {/* Feedback Button */}
            <button className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition text-xs">
              <FaHeadset className="text-xs" />
              Feedback
            </button>
            {/* Dropdown Menus */}
            {[
              { label: 'Tìm cửa hàng', icon: <FaStore className="text-xs" />, key: 'store' },
              { label: 'Hỗ trợ', icon: <FaHeadset className="text-xs" />, key: 'support' },
              { label: 'Trung tâm dịch vụ', icon: <FaTools className="text-xs" />, key: 'service' },
              { label: 'Khuyến mãi', icon: <FaGift className="text-xs" />, key: 'promotion' },
            ].map((item, index) => (
              <div
                key={index}
                className="relative"
                onMouseEnter={() => handleDropdownHover(item.key)}
                onMouseLeave={handleDropdownLeave}
              >
                <button className="flex items-center gap-1 px-2 py-1 hover:text-blue-900 transition text-xs">
                  {item.icon}
                  <span>{item.label}</span>
                </button>
                {isDropdownOpen === item.key && (
                  <div
                    className="absolute top-full mt-1 w-48 bg-white shadow-lg rounded-lg z-50"
                    onMouseEnter={() => clearTimeout(timeoutId)}
                    onMouseLeave={handleDropdownLeave}
                  >
                    {dropdownItems[item.key].map((dropdownItem, idx) => (
                      <a
                        key={idx}
                        href={dropdownItem.link}
                        className="block px-3 py-1 text-black hover:bg-blue-900 hover:text-white transition text-sm"
                      >
                        {dropdownItem.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {/* Account Section */}
            <div
              className="relative"
              onMouseEnter={() => handleDropdownHover('account')}
              onMouseLeave={handleDropdownLeave}
            >
              <button
                onClick={() => handleAccountClick()}
                className={`flex items-center gap-1 px-2 py-1 transition text-xs ${username ? 'hover:text-blue-700 cursor-pointer' : 'cursor-default'}`}
              >
                <FaUser className="text-xs flex-shrink-0"/>
                <span className='max-w-[60px] truncate'
                      title={fullName || username || 'Tài khoản'}>
                      {fullName || username || 'Tài khoản'}
                </span>
              </button>
              {isDropdownOpen === 'account' && (
                <div
                  className={`absolute top-full mt-1 ${username ? 'w-48' : 'w-40'} bg-white shadow-lg rounded-lg z-[70]`}
                  onMouseEnter={() => clearTimeout(timeoutId)}
                  onMouseLeave={handleDropdownLeave}
                >
                  {!username ? (
                    <div className="px-2 py-1">
                      <button
                        onClick={handleLogin}
                        className="block my-1 w-full text-left px-3 py-1 bg-yellow-400 text-black hover:bg-yellow-500 transition text-sm rounded"
                      >
                        <FaSignInAlt className="inline mr-1 text-xs" />
                        Đăng nhập
                      </button>
                      <button
                        onClick={handleRegister}
                        className="block my-1 w-full text-left px-3 py-1 bg-yellow-400 text-black hover:bg-yellow-500 transition text-sm rounded"
                      >
                        <FaUserPlus className="inline mr-1 text-xs" />
                        Đăng ký
                      </button>
                    </div>
                  ) : (
                    <ul className="space-y-1">
                      {[
                        { label: 'Thông tin tài khoản', icon: <FaUser />, tab: 'info' },
                        { label: 'Danh sách đơn hàng', icon: <FaListAlt />, tab: 'orders' },
                        { label: 'Thông báo', icon: <FaBell />, tab: 'notices' },
                        { label: 'Thay đổi mật khẩu', icon: <FaLock />, tab: 'password' },
                        { label: 'Thoát tài khoản', icon: <FaSignOutAlt />, tab: 'logout' },
                      ].map((item, index) => (
                        <li
                          key={index}
                          className="group flex items-center gap-2 py-2 px-3 rounded hover:bg-red-600 cursor-pointer"
                          onClick={() => handleAccountClick(item.tab)}
                        >
                          <span className="flex items-center text-sm font-semibold text-gray-700 group-hover:text-white gap-2">
                            <span className="text-md">{item.icon}</span>
                            {item.label}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <ModalConfirmLogout
        isOpen={isLogoutModalOpen}
        onClose={handleCancelLogout}
        onConfirm={handleConfirmLogout}
      />
    </header>
  );
};

export default UserMenu;