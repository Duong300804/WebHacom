import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { FaTimes, FaSearch, FaChevronDown, FaHome, FaInfoCircle, FaEdit, FaTrash   } from 'react-icons/fa';
import { filterOrders, getAllOrders } from '../../../api/APIs/orderApi';
import { getUserById } from '../../../api/APIs/userApi';
import Header from '../Components/Header';
import Sidebar from '../Components/Sidebar';
import Footer from '../Components/Footer';

const OrderFilter = () => {
  const [orders, setOrders] = useState([]);
  const [userNames, setUserNames] = useState({});
  const [filter, setFilter] = useState({
    status: '',
    minTotal: '',
    maxTotal: '',
    startDate: '',
    endDate: '',
  });
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
        setOrders(response.data);
        const nameMap = {};
        for (const order of response.data) {
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

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilterSubmit = async (e) => {
    e.preventDefault();
    try {
      const filterRequest = {
        status: filter.status || null,
        minTotal: filter.minTotal ? parseFloat(filter.minTotal) : null,
        maxTotal: filter.maxTotal ? parseFloat(filter.maxTotal) : null,
        startDate: filter.startDate || null,
        endDate: filter.endDate || null,
      };
      const response = await filterOrders(filterRequest);
      if (response.status === 200) {
        setOrders(response.data);
        if (response.data.length === 0) {
          toast.error('Không tìm thấy đơn hàng phù hợp');
        }
      } else {
        toast.error('Lọc đơn hàng thất bại');
      }
    } catch (error) {
      toast.error('Lỗi hệ thống. Vui lòng thử lại.');
      console.error('Filter error:', error);
    }
  };

  const handleResetFilter = () => {
    setFilter({
      status: '',
      minTotal: '',
      maxTotal: '',
      startDate: '',
      endDate: '',
    });
    fetchOrders();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-center" reverseOrder={false} />
      <Header username={sessionStorage.getItem('username')} />
      <Sidebar username={sessionStorage.getItem('username')} />
      <div className="p-4 sm:ml-64 pt-20">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-4 border-b-2 border-blue-700 pb-2">
            <h2 className="text-2xl font-bold text-blue-700">LỌC ĐƠN HÀNG</h2>
            <div className="flex items-center gap-4">
              <nav className="text-sm text-gray-600 flex items-center flex-nowrap">
                <span className="flex items-center gap-1">
                  <FaHome className="text-gray-600" />
                  <span>Trang chủ</span>
                </span>
                <span className="mx-2">{'>'}</span>
                <Link to="/admin/order" className="hover:underline">Quản lý đơn hàng</Link>
                <span className="mx-2">{'>'}</span>
                <span className="font-medium text-gray-800">Lọc</span>
              </nav>
              <button
                onClick={() => navigate('/admin/order')}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={20} />
              </button>
            </div>
          </div>
          <div className="bg-white shadow-md rounded-lg p-4">
            <form onSubmit={handleFilterSubmit} className="flex flex-col gap-4 mb-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex flex-col w-full sm:w-1/4">
                  <label className="font-medium text-gray-700">Trạng thái:</label>
                  <div className="relative">
                    <select
                      name="status"
                      value={filter.status}
                      onChange={handleFilterChange}
                      className="appearance-none w-full px-2 py-1 border rounded-md focus:outline-none focus:border-blue-500"
                    >
                      <option value="">Tất cả</option>
                      <option value="PENDING">Đang chờ</option>
                      <option value="CONFIRMED">Đã xác nhận</option>
                      <option value="SHIPPED">Đang giao</option>
                      <option value="DELIVERED">Đã giao</option>
                      <option value="CANCELLED">Đã hủy</option>
                    </select>
                    <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" />
                  </div>
                </div>
                <div className="flex flex-col w-full sm:w-1/4">
                  <label className="font-medium text-gray-700">Giá từ:</label>
                  <input
                    type="text"
                    name="minTotal"
                    value={filter.minTotal ? Number(filter.minTotal).toLocaleString('vi-VN') : ''}
                    onChange={(e) => {
                    const rawValue = e.target.value.replace(/\D/g, '');
                    handleFilterChange({ target: { name: 'minTotal', value: rawValue } });
                    }}
                    placeholder="Giá tối thiểu"
                    className="border rounded-md px-2 py-1 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="flex flex-col w-full sm:w-1/4">
                  <label className="font-medium text-gray-700">Giá đến:</label>
                  <input
                    type="text"
                    name="maxTotal"
                    value={filter.maxTotal ? Number(filter.maxTotal).toLocaleString('vi-VN') : ''}
                    onChange={(e) => {
                    const rawValue = e.target.value.replace(/\D/g, '');
                    handleFilterChange({ target: { name: 'maxTotal', value: rawValue } });
                    }}
                    placeholder="Giá tối đa"
                    className="border rounded-md px-2 py-1 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="flex flex-col w-full sm:w-1/4">
                  <label className="font-medium text-gray-700">Từ ngày:</label>
                  <input
                    type="date"
                    name="startDate"
                    value={filter.startDate}
                    onChange={handleFilterChange}
                    className="border rounded-md px-2 py-1 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="flex flex-col w-full sm:w-1/4">
                  <label className="font-medium text-gray-700">Đến ngày:</label>
                  <input
                    type="date"
                    name="endDate"
                    value={filter.endDate}
                    onChange={handleFilterChange}
                    className="border rounded-md px-2 py-1 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center gap-2"
                >
                  <FaSearch /> Lọc
                </button>
                {(filter.status || filter.minTotal || filter.maxTotal || filter.startDate || filter.endDate) && (
                  <button
                    type="button"
                    onClick={handleResetFilter}
                    className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                  >
                    Đặt lại
                  </button>
                )}
              </div>
            </form>
            {orders.length > 0 ? (
              <div className="overflow-x-auto overflow-y-auto max-h-[60vh] border rounded-md">
                <table className="w-full border-collapse">
                  <thead className='sticky top-0'>
                    <tr className="bg-blue-700 text-white">
                      <th className="p-2 text-center border-r border-gray-300">STT</th>
                      <th className="p-2 text-center border-r border-gray-300">Người mua</th>
                      <th className="p-2 text-center border-r border-gray-300">Mã đơn hàng</th>
                      <th className="p-2 text-center border-r border-gray-300">Ngày đặt hàng</th>
                      <th className="p-2 text-center border-r border-gray-300">Tổng tiền</th>
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
                        <td className="p-2 text-center border-r border-gray-300">{order.totalAmountFormatted}</td>
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
                              className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 flex items-center gap-1"
                              title="Sửa">
                              <FaEdit /> Sửa
                            </button>
                            <button
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
      <Footer/>
    </div>
  );
};

export default OrderFilter;