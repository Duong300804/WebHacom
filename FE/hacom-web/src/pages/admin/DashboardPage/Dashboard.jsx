import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { FaDollarSign, FaUsers, FaShoppingCart, FaBox, FaHome } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Cell, ResponsiveContainer as ResponsiveContainerPie, Legend as LegendPie } from 'recharts';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import Header from '../Components/Header';
import Sidebar from '../Components/Sidebar';
import Footer from '../Components/Footer';
import {
  getTotalProducts, getTotalRevenue, getTotalOrders, getTotalCustomers,
  getRevenueByMonth, getRevenueByCategory, getRecentOrders,
  getRecentProducts, getTopProducts, getRecentCustomers
} from '../../../api/APIs/dashboardApi'; 

const Dashboard = () => {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [revenueByMonth, setRevenueByMonth] = useState([]);
  const [revenueByCategory, setRevenueByCategory] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [recentCustomers, setRecentCustomers] = useState([]);
  const [userNames, setUserNames] = useState({}); 
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const statusMap = {
    PENDING: 'Đang chờ',
    CONFIRMED: 'Đã xác nhận',
    SHIPPED: 'Đang giao',
    DELIVERED: 'Đã giao',
    CANCELLED: 'Đã hủy',
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [
        totalProductsRes,
        totalRevenueRes,
        totalOrdersRes,
        totalCustomersRes,
        revenueByMonthRes,
        revenueByCategoryRes,
        recentOrdersRes,
        recentProductsRes,
        topProductsRes,
        recentCustomersRes
      ] = await Promise.all([
        getTotalProducts(),
        getTotalRevenue(),
        getTotalOrders(),
        getTotalCustomers(),
        getRevenueByMonth(),
        getRevenueByCategory(),
        getRecentOrders(),
        getRecentProducts(),
        getTopProducts(),
        getRecentCustomers()
      ]);

        setTotalProducts(totalProductsRes.data.total);
        setTotalRevenue(totalRevenueRes.data.total);
        setTotalOrders(totalOrdersRes.data.total);
        setTotalCustomers(totalCustomersRes.data.total);

        const monthList = revenueByMonthRes.data.revenueByMonth;
        setRevenueByMonth(
        Array.isArray(monthList)
            ? monthList.map(item => ({ ...item, target: 100000000 }))
            : []
        );

        setRevenueByCategory(revenueByCategoryRes.data.revenueByCategory || []);
        setRecentOrders(recentOrdersRes.data.recentOrders || []);
        setRecentProducts(recentProductsRes.data.recentProducts || []);
        setTopProducts(topProductsRes.data.topProducts || []);
        setRecentCustomers(recentCustomersRes.data.recentCustomers || []);

      setLoading(false);
    } catch (error) {
      toast.error('Lỗi khi tải dữ liệu thống kê');
      console.log(error);
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center p-4">Đang tải...</div>;
  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-center" reverseOrder={false} />
      <Header username={sessionStorage.getItem('username')} />
      <Sidebar username={sessionStorage.getItem('username')} />
      <div className="p-4 sm:ml-64 pt-20 pb-20">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-4 border-b-2 border-blue-700 pb-2">
            <h2 className="text-2xl font-bold text-blue-700">THỐNG KÊ</h2>
            <nav className="text-sm text-gray-600 flex items-center flex-nowrap">
              <span className="flex items-center gap-1">
                <FaHome className="text-gray-600" />
                <span>Trang chủ</span>
              </span>
              <span className="mx-2">{'>'}</span>
              <span className="font-medium text-gray-800">Thống kê</span>
            </nav>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-4 rounded-lg shadow-md relative">
              <div className="absolute top-4 right-4 bg-green-500 rounded-full p-3 text-white">
                <FaDollarSign size={24} />
              </div>
              <h3 className="text-lg font-semibold">Tổng doanh thu</h3>
              <p className="text-2xl font-bold">{totalRevenue.toLocaleString('vi-VN')} VNĐ</p>
              <div className="bg-gray-200 h-2 rounded-full mt-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '70%' }}></div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md relative">
              <div className="absolute top-4 right-4 bg-orange-500 rounded-full p-3 text-white">
                <FaUsers size={24} />
              </div>
              <h3 className="text-lg font-semibold">Số lượng khách hàng</h3>
              <p className="text-2xl font-bold">{totalCustomers}</p>
              <div className="bg-gray-200 h-2 rounded-full mt-2">
                <div className="bg-orange-500 h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md relative">
              <div className="absolute top-4 right-4 bg-red-500 rounded-full p-3 text-white">
                <FaShoppingCart size={24} />
              </div>
              <h3 className="text-lg font-semibold">Tổng số đơn hàng</h3>
              <p className="text-2xl font-bold">{totalOrders}</p>
              <div className="bg-gray-200 h-2 rounded-full mt-2">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: '50%' }}></div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md relative">
              <div className="absolute top-4 right-4 bg-purple-500 rounded-full p-3 text-white">
                <FaBox size={24} />
              </div>
              <h3 className="text-lg font-semibold">Số lượng sản phẩm</h3>
              <p className="text-2xl font-bold">{totalProducts}</p>
              <div className="bg-gray-200 h-2 rounded-full mt-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '80%' }}></div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 mb-8">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-2">Tổng quan doanh thu</h3>
              <h4 className='text-md mb-4'> Dữ liệu doanh thu theo tháng: (Đơn vị: triệu VNĐ)</h4>
              <ResponsiveContainer width="100%" height={300} className="[&>svg]:overflow-visible">
                <BarChart data={revenueByMonth} margin={{ top: 20, right: 30, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" interval={1} />
                  <YAxis  tickFormatter={(value) => `${(value / 1_000_000)}`}/>
                  <Tooltip formatter={(value) => `${(value / 1_000_000)} triệu VNĐ`}/>
                  <Legend />
                  <Bar dataKey="revenue" fill="#8884d8" name="Doanh thu" />
                  <Bar dataKey="target" fill="#82ca9d" name="Mục tiêu" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-2">Doanh thu theo danh mục</h3>
              <h4 className='text-md mb-2'>Dữ liệu sản phẩm bán ra theo danh mục: </h4>
              <ResponsiveContainerPie width="100%" height={300}>
                <PieChart>
                  <Pie dataKey="percentage" data={revenueByCategory} cx="50%" cy="50%" outerRadius={80}  innerRadius={40}  fill="#8884d8" label={({ value }) => `${value.toFixed(0)}%`}>
                    {revenueByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val) => `${val.toFixed(0)}%`}/>
                </PieChart>
              </ResponsiveContainerPie>
              <div className="mt-2">
                {revenueByCategory.map((cat, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="inline-block w-4 h-4 mr-2 rounded-sm" style={{ backgroundColor: COLORS[index % COLORS.length] }}/>
                    <span className='flex-1'>{cat.categoryName}:</span>
                    <span>{Math.round(cat.percentage)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 mb-8">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4">Đơn hàng mới</h3>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-2 text-left">Mã đơn</th>
                    <th className="p-2 text-left">Người đặt</th>
                    <th className="p-2 text-left">Tổng tiền</th>
                    <th className="p-2 text-left">Ngày mua</th>
                    <th className="p-2 text-left">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order, index) => (
                    <tr key={index}>
                      <td className="p-2">{order.id}</td>
                      <td className="p-2">{order.userName|| 'Không xác định'}</td>
                      <td className="p-2">{order.totalAmount.toLocaleString('vi-VN')} VNĐ</td>
                      <td className="p-2">{order.orderDateFormatted}</td>
                      <td className="p-2">{statusMap[order.status.toUpperCase()] || order.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4">Sản phẩm vừa thêm</h3>
                {Array.isArray(recentProducts) && recentProducts.map((product, index) => {
                const imgs = Array.isArray(product.images) ? product.images : [];
                const mainImage = imgs.find(img => img.main) || imgs[0] || {};

                return (
                    <div key={index} className="flex items-center mb-4">
                    <img
                        src={`${import.meta.env.VITE_IMAGE_BASE_URL}${mainImage.imageUrl || ''}`}
                        alt={product.name || 'Không có tên'}
                        className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                    <div>
                        <p className="font-medium mb-1">{product.name}</p>
                        <span className="bg-blue-400 text-white px-2 py-1 rounded">
                        {product.priceFormatted} VNĐ
                        </span>
                    </div>
                    </div>
                );
                })}
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4">Sản phẩm bán chạy nhất</h3>
                {Array.isArray(topProducts) && topProducts.map((product, index) => {
                const imgs = Array.isArray(product.images) ? product.images : [];
                const mainImage = imgs.find(img => img.main) || imgs[0] || {};

                return (
                    <div key={index} className="flex items-center mb-4">
                    <img
                        src={`${import.meta.env.VITE_IMAGE_BASE_URL}${mainImage.imageUrl || ''}`}
                        alt={product.name || 'Không có tên'}
                        className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                    <div>
                        <p className="font-medium">{product.name}</p>
                        <p>Số lượng bán: {product.soldQuantity || 0}</p>
                        <p>Tổng doanh thu: {product.totalRevenue?.toLocaleString('vi-VN')} VNĐ</p>
                    </div>
                    </div>
                );
                })}
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4">Khách hàng mới</h3>
              {recentCustomers.map((customer, index) => (
                <div key={index} className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center mr-4">
                    <FaUsers />
                  </div>
                  <div>
                    <p className="font-medium">{customer.fullName}</p>
                    <p>Đăng ký {formatDistanceToNow(new Date(customer.createDate), { locale: vi, addSuffix: true })}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;