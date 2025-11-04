import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { FaSearch, FaInfoCircle, FaTrash, FaHome, FaEdit } from 'react-icons/fa';
import { searchUsers, deleteUser, filterUsers, getUserById } from '../../../api/APIs/userApi';
import Header from '../Components/Header';
import Sidebar from '../Components/Sidebar';
import Footer from '../Components/Footer';
import ModalDelete from '../Components/Modal/ModalDelete';
import ModalDetail from './Modal/ModalDetail';
import ModalUpdate from './Modal/ModalUpdate';

const Customer = () => {
  const [customers, setCustomers] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await filterUsers('CUSTOMER');
      if (response.status === 200) {
        setCustomers(response.data);
      } else {
        toast.error('Không thể tải danh sách khách hàng');
      }
    } catch (error) {
      toast.error('Lỗi hệ thống. Vui lòng thử lại.');
      console.error('Error fetching customers:', error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchKeyword.trim()) {
      toast.error('Vui lòng nhập từ khóa tìm kiếm');
      return;
    }
    try {
      const response = await searchUsers(searchKeyword);
      if (response.status === 200) {
        const filteredCustomers = response.data.filter(user => user.role === 'CUSTOMER');
        setCustomers(filteredCustomers);
        if (filteredCustomers.length === 0) {
          toast.error('Không tìm thấy khách hàng');
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
    fetchCustomers();
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setIsModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;

    try {
      const response = await deleteUser(userToDelete.id);
      if (response.status === 200) {
        toast.success('Xóa khách hàng thành công');
        fetchCustomers();
      } else {
        toast.error('Xóa khách hàng thất bại');
      }
    } catch (error) {
      toast.error('Lỗi hệ thống. Vui lòng thử lại.');
      console.error('Delete error:', error);
    } finally {
      setIsModalOpen(false);
      setUserToDelete(null);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setUserToDelete(null);
  };

  const handleDetailClick = async (userId) => {
    try {
      const response = await getUserById(userId);
      if (response.status === 200) {
        setSelectedUser(response.data);
        setIsDetailModalOpen(true);
      } else {
        toast.error('Không thể tải thông tin chi tiết');
      }
    } catch (error) {
      toast.error('Lỗi hệ thống. Vui lòng thử lại.');
      console.error('Detail error:', error);
    }
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedUser(null);
  };

  const handleUpdateClick = (user) => {
    setSelectedUser(user);
    setIsUpdateModalOpen(true);
  };

  const handleCloseUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setSelectedUser(null);
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
              DANH SÁCH KHÁCH HÀNG
            </h2>
            <nav className="text-sm text-gray-600 flex items-center flex-nowrap">
              <span className="flex items-center gap-1">
              <FaHome className="text-gray-600" />
              <span>Trang chủ</span>
              </span>
              <span className="mx-2">{'>'}</span>
              <Link to="/admin/customer" className="hover:underline">Quản lý khách hàng</Link>
              <span className="mx-2">{'>'}</span>
              <span className="font-medium text-gray-800">Danh sách</span>
            </nav>
          </div>
          <div className="bg-white shadow-md rounded-lg p-4">
            <div className="flex flex-col sm:flex-row justify-between mb-4">
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="Tìm kiếm khách hàng"
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
            </div>
            {customers.length > 0 ? (
              <div className="overflow-x-auto overflow-y-auto max-h-[60vh] border rounded-md">
                <table className="w-full border-collapse">
                  <thead className='sticky top-0'>
                    <tr className="bg-blue-700 text-white">
                      <th className="p-2 text-center border-r border-gray-300">STT</th>
                      <th className="p-2 text-center border-r border-gray-300">Tên tài khoản</th>
                      <th className="p-2 text-center border-r border-gray-300">Email</th>
                      <th className="p-2 text-center border-r border-gray-300">Họ tên</th>
                      <th className="p-2 text-center border-r border-gray-300">SĐT</th>
                      <th className="p-2 text-center border-r border-gray-300">Địa Chỉ</th>
                      <th className="p-2 text-center">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((user, index) => (
                      <tr
                        key={user.id}
                        className="hover:bg-gray-100 even:bg-gray-50">
                        <td className="p-2 text-center border-r border-gray-300">{index + 1}</td>
                        <td className="p-2 text-center border-r border-gray-300">{user.username}</td>
                        <td className="p-2 text-center border-r border-gray-300">{user.email}</td>
                        <td className="p-2 text-center border-r border-gray-300">{user.fullName || 'Không có dữ liệu'}</td>
                        <td className="p-2 text-center border-r border-gray-300">{user.phone || 'Không có dữ liệu'}</td>
                        {/* <td className="p-2 text-center border-r border-gray-300">{user.address || 'Không có dữ liệu'}</td> */}
                        <td className="p-2 text-center border-r border-gray-300 max-w-[200px]">
                        <div className="truncate">{user.address || 'Không có dữ liệu'}</div>
                        </td>
                        <td className="p-2 text-center">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleDetailClick(user.id)}
                              className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 flex items-center gap-1"
                              title="Chi tiết">
                              <FaInfoCircle /> Chi tiết
                            </button>
                            <button
                              onClick={() => handleUpdateClick(user)}
                              className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 flex items-center gap-1"
                              title="Sửa">
                              <FaEdit /> Sửa
                            </button>
                            <button
                              onClick={() => handleDeleteClick(user)}
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
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleDeleteConfirm}
        title="Xác nhận xóa khách hàng"
        message={`Bạn có chắc chắn muốn xóa khách hàng ${userToDelete?.username} ? Hành động này không thể hoàn tác.`}
      />
      <ModalDetail
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        user={selectedUser}
      />
      <ModalUpdate
        isOpen={isUpdateModalOpen}
        onClose={handleCloseUpdateModal}
        onUserUpdated={fetchCustomers}
        user={selectedUser}
      />
      <Footer/>
    </div>
  );
};

export default Customer;