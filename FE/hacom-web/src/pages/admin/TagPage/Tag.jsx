import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { FaSearch, FaPlus, FaEdit, FaTrash, FaInfoCircle, FaHome } from 'react-icons/fa';
import { getAllTags, searchTags, deleteTag, getTagById } from '../../../api/APIs/tagApi';
import Header from '../Components/Header';
import Sidebar from '../Components/Sidebar';
import Footer from '../Components/Footer';
import ModalDelete from '../Components/Modal/ModalDelete';
import ModalDetail from './Modal/ModalDetail';
import ModalCreate from './Modal/ModalCreate';
import ModalUpdate from './Modal/ModalUpdate';

const Tag = () => {
  const [tags, setTags] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [tagToDelete, setTagToDelete] = useState(null);
  const [selectedTag, setSelectedTag] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const response = await getAllTags();
      if (response.status === 200) {
        setTags(response.data);
      } else {
        toast.error('Không thể tải danh sách thẻ');
      }
    } catch (error) {
      toast.error('Lỗi hệ thống. Vui lòng thử lại.');
      console.error('Error fetching tags:', error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchKeyword.trim()) {
      toast.error('Vui lòng nhập từ khóa tìm kiếm');
      return;
    }
    try {
      const response = await searchTags(searchKeyword);
      if (response.status === 200) {
        setTags(response.data);
        if (response.data.length === 0) {
          toast.error('Không tìm thấy thẻ');
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
    fetchTags();
  };

  const handleDeleteClick = (tag) => {
    setTagToDelete(tag);
    setIsModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!tagToDelete) return;

    try {
      const response = await deleteTag(tagToDelete.id);
      if (response.status === 200) {
        toast.success('Xóa thẻ thành công');
        fetchTags();
      } else {
        toast.error('Xóa thẻ thất bại');
      }
    } catch (error) {
      toast.error('Lỗi hệ thống. Vui lòng thử lại.');
      console.error('Delete error:', error);
    } finally {
      setIsModalOpen(false);
      setTagToDelete(null);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTagToDelete(null);
  };

  const handleDetailClick = async (tagId) => {
    try {
      const response = await getTagById(tagId);
      if (response.status === 200) {
        setSelectedTag(response.data);
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
    setSelectedTag(null);
  };

  const handleCreateClick = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleUpdateClick = (tag) => {
    setSelectedTag(tag);
    setIsUpdateModalOpen(true);
  };

  const handleCloseUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setSelectedTag(null);
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
              DANH SÁCH THẺ
            </h2>
            <nav className="text-sm text-gray-600 flex items-center flex-nowrap">
              <span className="flex items-center gap-1">
              <FaHome className="text-gray-600" />
              <span>Trang chủ</span>
              </span>
              <span className="mx-2">{'>'}</span>
              <Link to="/admin/tag" className="hover:underline">Quản lý thẻ</Link>
              <span className="mx-2">{'>'}</span>
              <span className="font-medium text-gray-800">Danh sách</span>
            </nav>
          </div>
          <div className="bg-white shadow-md rounded-lg p-4">
            <div className="flex flex-col sm:flex-row justify-between mb-4">
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="Tìm kiếm thẻ"
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
              <button
                onClick={handleCreateClick}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center gap-2 mt-2 sm:mt-0"
              >
                <FaPlus /> Thêm thẻ
              </button>
            </div>
            {tags.length > 0 ? (
              <div className="overflow-x-auto overflow-y-auto max-h-[60vh] border rounded-md">
                <table className="w-full border-collapse">
                  <thead className='sticky top-0'>
                    <tr className="bg-blue-700 text-white">
                      <th className="p-2 text-center border-r border-gray-300">STT</th>
                      <th className="p-2 text-center border-r border-gray-300">Tên thẻ</th>
                      <th className="p-2 text-center">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tags.map((tag, index) => (
                      <tr
                        key={tag.id}
                        className="hover:bg-gray-100 even:bg-gray-50">
                        <td className="p-2 text-center border-r border-gray-300">{index + 1}</td>
                        <td className="p-2 text-center border-r border-gray-300">{tag.name}</td>
                        <td className="p-2 text-center">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleDetailClick(tag.id)}
                              className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 flex items-center gap-1"
                              title="Chi tiết">
                              <FaInfoCircle /> Chi tiết
                            </button>
                            <button
                              onClick={() => handleUpdateClick(tag)}
                              className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 flex items-center gap-1"
                              title="Sửa">
                              <FaEdit /> Sửa
                            </button>
                            <button
                              onClick={() => handleDeleteClick(tag)}
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
        title="Xác nhận xóa thẻ"
        message={`Bạn có chắc chắn muốn xóa thẻ ${tagToDelete?.name} ? Hành động này không thể hoàn tác.`}
      />
      <ModalDetail
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        tag={selectedTag}
      />
      <ModalCreate
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onTagCreated={fetchTags}
      />
      <ModalUpdate
        isOpen={isUpdateModalOpen}
        onClose={handleCloseUpdateModal}
        onTagUpdated={fetchTags}
        tag={selectedTag}
      />
      <Footer/>
    </div>
  );
};

export default Tag;