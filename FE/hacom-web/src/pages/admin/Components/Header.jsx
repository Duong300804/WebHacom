import React, { useState, useEffect }  from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaBell } from 'react-icons/fa';
import { FiLogOut } from "react-icons/fi";
import { getAllNotifications, getUnreadNotifications, markAsRead, markAllAsRead } from '../../../api/APIs/notificationApi';

const Header = ({ username }) => {
  const navigate = useNavigate();
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const titleMap = {
    USER_CANCEL_ORDER: 'Đơn hàng bị hủy bới khách hàng',
    PRODUCT_OUT_OF_STOCK: 'Sản phẩm đã hết hàng',
    NEW_ORDER_ADMIN: 'Bạn có đơn hàng mới',
    NEW_USER: 'Bạn có khách hàng mới',
  };

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    let intervalId;

    const fetchNotifications = async () => {
      try {
        const unreadRes = await getUnreadNotifications();
        setUnreadCount(unreadRes.data.length || 0);

        const allRes = await getAllNotifications();
        // Sort theo createdAt desc
        const sorted = allRes.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        const now = new Date();
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(now.getDate() - 2);
        const recent = sorted.filter(item => new Date(item.createdAt) >= threeDaysAgo);
        setNotifications(recent);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };
    fetchNotifications();
    if (!showDropdown) {
      intervalId = setInterval(fetchNotifications, 3000);
    }
    return () => clearInterval(intervalId);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('username');
    navigate('/login');
  };

  const handleNotificationClick = async (item) => {
    if (!item.isRead) {
      try {
        await markAsRead(item.id);
        setUnreadCount(prev => prev - 1);
        setNotifications(prev => prev.map(n => n.id === item.id ? { ...n, isRead: true } : n));
      } catch (error) {
        console.error('Error marking as read:', error);
      }
    }
    setShowDropdown(false);
    // Redirect dựa trên type
    if (item.type === 'NEW_ORDER_ADMIN' || item.type === 'USER_CANCEL_ORDER' || item.type === 'ORDER_STATUS_UPDATED') {
      navigate('/admin/order');
    }else if (item.type === 'PRODUCT_OUT_OF_STOCK'){
      navigate('/admin/product');
    }else if (item.type === 'NEW_USER'){
      navigate('/admin/customer');
    }
  };

    const handleMarkAllRead = async () => {
    try {
      await markAllAsRead();
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50 h-16 flex items-center">
      <div className="logo w-64 h-full bg-blue-300 text-white text-center font-bold text-lg uppercase tracking-wider flex items-center justify-center">
        Quản Lý
      </div>
      <div className="flex-1 flex justify-between items-center px-4">
        <div className="text-gray-500 font-medium">
          <strong>{today}</strong>
        </div>
        <div className="flex items-center gap-4"> 
          <div className="relative cursor-pointer" onClick={() => setShowDropdown(!showDropdown)}>
            <FaBell className="text-gray-500 text-2xl" />
            {unreadCount > 0 && (
              <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs px-1 min-w-[16px] text-center">
                {unreadCount}
              </div>
            )}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-96 bg-white shadow-lg rounded-lg overflow-y-auto max-h-96 z-50 border border-gray-300">
                <div className="p-3 border-b text-gray-700 font-medium">
                  Bạn có {unreadCount} thông báo mới
                </div>
                {notifications.length > 0 ? (
                  notifications.map(item => (
                    <div
                      key={item.id}
                      onClick={() => handleNotificationClick(item)}
                      className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${!item.isRead ? 'font-bold bg-gray-100' : 'bg-white'}`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-semibold text-sm">{titleMap[item.type] || item.type.replace('_', ' ')}</div> 
                          <div className="text-sm text-gray-600">{item.message}</div> 
                        </div>
                        <div className="text-xs text-gray-500 whitespace-nowrap ml-2">
                          {new Date(item.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-center text-gray-500">Không có thông báo</div>
                )}
                <button
                  onClick={handleMarkAllRead}
                  className="w-full p-2 text-center text-blue-500 hover:bg-gray-100 border-t"
                >
                  Đánh dấu tất cả đã đọc
                </button>
              </div>
            )}
          </div>
          <FaUserCircle className="text-gray-500 text-2xl" />
          <span className="text-gray-700">{username}</span>
          <button
            onClick={handleLogout}
            className="ml-4 flex items-center gap-2 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm shadow">
            <FiLogOut size={16} />
            Đăng xuất
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;