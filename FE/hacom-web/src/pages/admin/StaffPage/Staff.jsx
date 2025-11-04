import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { FaSearch, FaPlus, FaEdit, FaTrash, FaChevronDown, FaInfoCircle, FaHome } from 'react-icons/fa';
import { deleteStaff, getStaffById, getAllStaff, filterStaff, searchStaff } from '../../../api/APIs/staffApi';
import Header from '../Components/Header';
import Sidebar from '../Components/Sidebar';
import Footer from '../Components/Footer';
import ModalDelete from '../Components/Modal/ModalDelete';
import ModalDetail from './Modal/ModalDetail';
import ModalCreate from './Modal/ModalCreate';
import ModalUpdate from './Modal/ModalUpdate';

const Staff = () => {
  const [staffs, setStaffs] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterPosition, setFilterPosition] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStaffs();
  }, []);

  useEffect(() => {
    if (filterPosition === 'all') {
      fetchStaffs();
    } else {
      handleFilterByPosition(filterPosition);
    }
  }, [filterPosition]);

  const fetchStaffs = async () => {
    try {
      const response = await getAllStaff();
      if (response.status === 200) {
        console.log("All staffs:", response.data);
        setStaffs(response.data);
      } else {
        toast.error('Không thể tải danh sách nhân viên');
      }
    } catch (error) {
      toast.error('Lỗi hệ thống. Vui lòng thử lại.');
      console.error('Error fetching staffs:', error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchKeyword.trim()) {
      toast.error('Vui lòng nhập từ khóa tìm kiếm');
      return;
    }
    try {
      const response = await searchStaff(searchKeyword);
      if (response.status === 200) {
        setStaffs(response.data);
        if (response.data.length === 0) {
          toast.error('Không tìm thấy nhân viên');
        }
      } else {
        toast.error('Tìm kiếm thất bại');
      }
    } catch (error) {
      toast.error('Lỗi hệ thống. Vui lòng thử lại.');
      console.error('Search error:', error);
    }
  };

  const handleFilterByPosition = async () => {
    try {
      if (filterPosition === 'all') {
        fetchStaffs();
      } else {
        const response = await filterStaff(filterPosition);
        if (response.status === 200) {
            console.log("Filter staffs:", response.data); // 👀 log ra để check
          setStaffs(response.data);
          if (response.data.length === 0) {
            toast.error('Không tìm thấy nhân viên với chức vụ này');
          }
        } else {
          toast.error('Lọc nhân viên thất bại');
        }
      }
    } catch (error) {
      toast.error('Lỗi hệ thống. Vui lòng thử lại.');
      console.error('Filter error:', error);
    }
  };

  const handleResetSearch = () => {
    setSearchKeyword('');
    setFilterPosition('all');
    fetchStaffs();
  };

  const handleDeleteClick = (staff) => {
    setStaffToDelete(staff);
    setIsModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!staffToDelete) return;

    try {
      const response = await deleteStaff(staffToDelete.id);
      if (response.status === 200) {
        toast.success('Xóa nhân viên thành công');
        fetchStaffs();
      } else {
        toast.error('Xóa nhân viên thất bại');
      }
    } catch (error) {
      toast.error('Lỗi hệ thống. Vui lòng thử lại.');
      console.error('Delete error:', error);
    } finally {
      setIsModalOpen(false);
      setStaffToDelete(null);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setStaffToDelete(null);
  };

  const handleDetailClick = async (staffId) => {
    try {
      const response = await getStaffById(staffId);
      if (response.status === 200) {
        setSelectedStaff(response.data);
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
    setSelectedStaff(null);
  };

  const handleCreateClick = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleUpdateClick = (staff) => {
    setSelectedStaff(staff);
    setIsUpdateModalOpen(true);
  };

  const handleCloseUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setSelectedStaff(null);
  };

  const positionLabels = {
    SALE: 'Bán hàng',
    TECHNICIAN: 'Kỹ thuật viên',
    SERVICE: 'Dịch vụ',
    WARRANTY: 'Bảo hành',
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
              DANH SÁCH NHÂN VIÊN
            </h2>
            <nav className="text-sm text-gray-600 flex items-center flex-nowrap">
              <span className="flex items-center gap-1">
                <FaHome className="text-gray-600" />
                <span>Trang chủ</span>
              </span>
              <span className="mx-2">{'>'}</span>
              <Link to="/admin/staff" className="hover:underline">Quản lý nhân viên</Link>
              <span className="mx-2">{'>'}</span>
              <span className="font-medium text-gray-800">Danh sách</span>
            </nav>
          </div>
          <div className="bg-white shadow-md rounded-lg p-4">
            <div className="flex flex-col sm:flex-row justify-between mb-4">
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="Tìm kiếm nhân viên"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                />
                <div className="relative inline-block w-48">
                  <select
                    value={filterPosition}
                    onChange={(e) => setFilterPosition(e.target.value)}
                    className="appearance-none w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  >
                    <option value="all">Tất cả chức vụ</option>
                    <option value="SALE">Bán hàng</option>
                    <option value="TECHNICIAN">Kỹ thuật viên</option>
                    <option value="SERVICE">Dịch vụ</option>
                    <option value="WARRANTY">Bảo hành</option>
                  </select>
                  <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center gap-2">
                    <FaSearch /> Tìm kiếm
                  </button>
                  {(searchKeyword || filterPosition !== 'all') && (
                    <button
                      type="button"
                      onClick={handleResetSearch}
                      className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600">
                        Quay lại
                    </button>
                  )}
                </div>
              </form>
              <button
                onClick={handleCreateClick}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center gap-2 mt-2 sm:mt-0"
              >
                <FaPlus /> Thêm nhân viên
              </button>
            </div>
            {staffs.length > 0 ? (
              <div className="overflow-x-auto overflow-y-auto max-h-[60vh] border rounded-md">
                <table className="w-full border-collapse">
                  <thead className="sticky top-0">
                    <tr className="bg-blue-700 text-white">
                      <th className="p-2 text-center border-r border-gray-300">STT</th>
                      <th className="p-2 text-center border-r border-gray-300">Tên tài khoản</th>
                      <th className="p-2 text-center border-r border-gray-300">Họ tên</th>
                      <th className="p-2 text-center border-r border-gray-300">SĐT</th>
                      <th className="p-2 text-center border-r border-gray-300">Địa chỉ</th>
                      <th className="p-2 text-center border-r border-gray-300">Chức vụ</th>
                      <th className="p-2 text-center">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staffs.map((staff, index) => (
                      <tr key={staff.id} className="hover:bg-gray-100 even:bg-gray-50">
                        <td className="p-2 text-center border-r border-gray-300">{index + 1}</td>
                        <td className="p-2 text-center border-r border-gray-300">{staff.username || 'Không có dữ liệu'}</td>
                        <td className="p-2 text-center border-r border-gray-300">{staff.fullName || 'Không có dữ liệu'}</td>
                        <td className="p-2 text-center border-r border-gray-300">{staff.phone || 'Không có dữ liệu'}</td>
                        <td className="p-2 text-center border-r border-gray-300 max-w-[200px]">
                          <div className="truncate">{staff.address || 'Không có dữ liệu'}</div>
                        </td>
                        <td className="p-2 text-center border-r border-gray-300">{staff.position ? positionLabels[staff.position] : 'Không có dữ liệu'}</td>
                        <td className="p-2 text-center">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleDetailClick(staff.id)}
                              className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 flex items-center gap-1"
                              title="Chi tiết">
                              <FaInfoCircle /> Chi tiết
                            </button>
                            <button
                              onClick={() => handleUpdateClick(staff)}
                              className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 flex items-center gap-1"
                              title="Sửa">
                              <FaEdit /> Sửa
                            </button>
                            <button
                              onClick={() => handleDeleteClick(staff)}
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
        title="Xác nhận xóa nhân viên"
        message={`Bạn có chắc chắn muốn xóa nhân viên ${staffToDelete?.fullName} ? Hành động này không thể hoàn tác.`}
      />
      <ModalDetail
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        staff={selectedStaff}
      />
      <ModalCreate
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onStaffCreated={fetchStaffs}
      />
      <ModalUpdate
        isOpen={isUpdateModalOpen}
        onClose={handleCloseUpdateModal}
        onStaffUpdated={fetchStaffs}
        staff={selectedStaff}
      />
      <Footer />
    </div>
  );
};

export default Staff;