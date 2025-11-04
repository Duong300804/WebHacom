import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { FaSearch, FaPlus, FaEdit, FaTrash, FaInfoCircle, FaHome, FaFilter } from 'react-icons/fa';
import { getAllOrders, searchOrders, deleteOrder } from '../../../api/APIs/orderApi';
import { getUserById } from '../../../api/APIs/userApi';
import Header from '../Components/Header';
import Sidebar from '../Components/Sidebar';
import Footer from '../Components/Footer';
import ModalDelete from '../Components/Modal/ModalDelete';
import OrderUpdateModal from './Modal/OrderUpdateModal';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [userNames, setUserNames] = useState({});
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const navigate = useNavigate();

  const statusMap = {
    PENDING: 'Đang chờ',
    CONFIRMED: 'Đã xác nhận',
    SHIPPED: 'Đang giao',
    DELIVERED: 'Đã giao',
    CANCELLED: 'Đã hủy',
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await getAllOrders();
      if (response.status === 200) {
      const sorted = response.data.sort(
        (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
      );
      setOrders(sorted);
        const nameMap = {};
        for (const order of sorted) {
          const userRes = await getUserById(order.userId);
          if (userRes.status === 200) {
            nameMap[order.userId] = userRes.data.fullName || userRes.data.username;
          }
        }
        setUserNames(nameMap);
      } else {
        toast.error('Không thể tải danh sách đơn hàng');
      }
    } catch (error) {
      toast.error('Lỗi hệ thống. Vui lòng thử lại.');
      console.error('Error fetching orders:', error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchKeyword.trim()) {
      toast.error('Vui lòng nhập từ khóa tìm kiếm');
      return;
    }
    try {
      const response = await searchOrders(searchKeyword);
      if (response.status === 200) {
        setOrders(response.data);
        if (response.data.length === 0) {
          toast.error('Không tìm thấy đơn hàng');
        }
      } else {
        toast.error('Tìm kiếm thất bại');
      }
    } catch (error) {
      toast.error('Lỗi hệ thống. Vui lòng thử lại.');
      console.error('Search error:', error);
    }
  };

  const handleResetSearch = () => {
    setSearchKeyword('');
    fetchOrders();
  };

  const handleDeleteClick = (order) => {
    setOrderToDelete(order);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!orderToDelete) return;

    try {
      const response = await deleteOrder(orderToDelete.id);
      if (response.status === 200) {
        toast.success('Xóa đơn hàng thành công');
        fetchOrders();
      } else {
        toast.error('Xóa đơn hàng thất bại');
      }
    } catch (error) {
      toast.error('Lỗi hệ thống. Vui lòng thử lại.');
      console.error('Delete error:', error);
    } finally {
      setIsDeleteModalOpen(false);
      setOrderToDelete(null);
    }
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setOrderToDelete(null);
  };

  const handleUpdateClick = (order) => {
    setSelectedOrder(order);
    setIsUpdateModalOpen(true);
  };

  const handleCloseUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setSelectedOrder(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-center" reverseOrder={false} />
      <Header username={sessionStorage.getItem('username')} />
      <Sidebar username={sessionStorage.getItem('username')} />
      <div className="p-4 sm:ml-64 pt-20">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-4 border-b-2 border-blue-700 pb-2">
            <h2 className="text-2xl font-bold text-blue-700">
              DANH SÁCH ĐƠN HÀNG
            </h2>
            <nav className="text-sm text-gray-600 flex items-center flex-nowrap">
              <span className="flex items-center gap-1">
              <FaHome className="text-gray-600" />
              <span> Trang chủ</span>
              </span>
              <span className="mx-2">{'>'}</span>
              <Link to="/admin/order" className="hover:underline">Quản lý đơn hàng</Link>
              <span className="mx-2">{'>'}</span>
              <span className="font-medium text-gray-800">Danh sách</span>
            </nav>
          </div>
          <div className="bg-white shadow-md rounded-lg p-4">
            <div className="flex flex-col sm:flex-row justify-between mb-4">
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="Tìm kiếm đơn hàng"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center gap-2">
                    <FaSearch /> Tìm kiếm
                  </button>
                  {searchKeyword && (
                    <button
                      type="button"
                      onClick={handleResetSearch}
                      className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600">
                        Quay lại
                    </button>
                  )}
                </div>
              </form>
              <div className="flex gap-2 mt-2 sm:mt-0">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center gap-2"
                >
                  <FaPlus /> Thêm đơn hàng
                </button>
                <button
                  onClick={() => navigate('/admin/order/filter')}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 flex items-center gap-2"
                >
                  <FaFilter /> Lọc đơn hàng
                </button>
              </div>
            </div>
            {orders.length > 0 ? (
              <div className="overflow-x-auto overflow-y-auto max-h-[60vh] border rounded-md">
                <table className="w-full border-collapse">
                  <thead className='sticky top-0'>
                    <tr className="bg-blue-700 text-white">
                      <th className="p-2 text-center border-r border-gray-300">STT</th>
                      <th className="p-2 text-center border-r border-gray-300">Người mua</th>
                      <th className="p-2 text-center border-r border-gray-300">Mã đơn hàng</th>
                      <th className="p-2 text-center border-r border-gray-300">Ngày đặt hàng</th>
                      <th className="p-2 text-center border-r border-gray-300">Trạng thái</th>
                      <th className="p-2 text-center">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order, index) => (
                      <tr
                        key={order.id}
                        className="hover:bg-gray-100 even:bg-gray-50">
                        <td className="p-2 text-center border-r border-gray-300">{index + 1}</td>
                        <td className="p-2 text-center border-r border-gray-300">{userNames[order.userId] || 'Không xác định'}</td>
                        <td className="p-2 text-center border-r border-gray-300">{order.id}</td>
                        <td className="p-2 text-center border-r border-gray-300">{order.orderDateFormatted}</td>
                        <td className="p-2 text-center border-r border-gray-300">{statusMap[order.status.toUpperCase()] || order.status}</td>
                        <td className="p-2 text-center">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => navigate(`/admin/order/detail/${order.id}`)}
                              className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 flex items-center gap-1"
                              title="Chi tiết">
                              <FaInfoCircle /> Chi tiết
                            </button>
                            <button
                              onClick={() => handleUpdateClick(order)}
                              className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 flex items-center gap-1"
                              title="Sửa">
                              <FaEdit /> Sửa
                            </button>
                            <button
                              onClick={() => handleDeleteClick(order)}
                              className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 flex items-center gap-1"
                              title="Xóa">
                              <FaTrash /> Xóa
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center text-gray-600">Không có dữ liệu</div>
            )}
          </div>
        </div>
      </div>
      <ModalDelete
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDeleteConfirm}
        title="Xác nhận xóa đơn hàng"
        message={`Bạn có chắc chắn muốn xóa đơn hàng ${orderToDelete?.id} ? Hành động này không thể hoàn tác.`}
      />
      <OrderUpdateModal
        isOpen={isUpdateModalOpen}
        onClose={handleCloseUpdateModal}
        onOrderUpdated={fetchOrders}
        order={selectedOrder}
      />
      <Footer/>
    </div>
  );
};

export default OrderList;