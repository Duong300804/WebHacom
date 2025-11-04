import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { getAllNotifications, getUnreadNotifications, markAsRead, markAllAsRead } from '../../../../api/APIs/notificationApi';
import { useNavigate } from 'react-router-dom';

const NoticeTab = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const titleMap = {
    NEW_ORDER: 'Đơn hàng mới',
    ORDER_CANCELLED: 'Đơn hàng bị hủy',
    ORDER_STATUS_UPDATED: 'Cập nhật trạng thái đơn hàng',
  };

  const statusMap = {
    PENDING: 'Đang chờ',
    CONFIRMED: 'Đã xác nhận',
    SHIPPED: 'Đang giao',
    DELIVERED: 'Đã giao',
    CANCELLED: 'Đã hủy',
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const unreadRes = await getUnreadNotifications();
        setUnreadCount(Math.max(0, unreadRes.data.length || 0));

        const allRes = await getAllNotifications();
        const sorted = allRes.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setNotifications(sorted);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        toast.error('Không thể tải thông báo');
      }
    };
    fetchNotifications();
    const intervalId = setInterval(fetchNotifications, 10000);
    return () => clearInterval(intervalId);
  }, []);

  const handleNotificationClick = async (item) => {
    if (!item.isRead) {
      try {
        await markAsRead(item.id);
        setUnreadCount(prev => Math.max(0, prev - 1));
        setNotifications(prev => prev.map(n => n.id === item.id ? { ...n, isRead: true } : n));
      } catch (error) {
        console.error('Error marking as read:', error);
      }
    }
    navigate('/account', { state: { activeTab: 'orders' } });
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead();
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      toast.success('Đã đánh dấu tất cả đã đọc');
    } catch (error) {
      console.error('Error marking all as read:', error);
      toast.error('Lỗi khi đánh dấu tất cả đã đọc');
    }
  };

  const formatMessage = (message) => {
    const regex = /trạng thái: (\w+)/;
    const match = message.match(regex);
    if (match && match[1]) {
      const status = match[1].toUpperCase();
      const vietnameseStatus = statusMap[status] || status;
      return message.replace(regex, `trạng thái: ${vietnameseStatus}`);
    }
    return message;
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-black mb-4">Danh sách thông báo</h2>
      <hr className="border-gray-300 mb-4" />
      <div className="flex justify-between items-center mb-4">
        <p className="text-gray-700 text-lg font-semibold">Bạn có {unreadCount} thông báo mới</p>
        <button
          onClick={handleMarkAllRead}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
        >
          Đánh dấu tất cả đã đọc
        </button>
      </div>
      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 sidebar-scrollbar">
        {notifications.length > 0 ? (
          notifications.map(item => (
            <div
              key={item.id}
              onClick={() => handleNotificationClick(item)}
              className={`p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 ${!item.read ? 'font-bold bg-gray-100' : 'bg-white'}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-semibold text-base">{titleMap[item.type] || item.type.replace('_', ' ')}</div>
                  <div className="text-base text-gray-600">{formatMessage(item.message)}</div>
                </div>
                <div className="text-xs text-gray-500 whitespace-nowrap ml-2">
                  {new Date(item.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-600">Không có thông báo nào</div>
        )}
      </div>
    </div>
  );
};

export default NoticeTab;