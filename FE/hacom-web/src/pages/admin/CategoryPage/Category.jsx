// File: src/pages/Admin/Category/Category.js
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { FaSearch, FaPlus, FaEdit, FaTrash, FaInfoCircle, FaHome, FaChevronDown } from 'react-icons/fa';
import { getAllCategories, searchCategories, deleteCategory, getCategoryById, filterCategories } from '../../../api/APIs/categoryApi';
import Header from '../Components/Header';
import Sidebar from '../Components/Sidebar';
import Footer from '../Components/Footer';
import ModalDelete from '../Components/Modal/ModalDelete';
import ModalDetail from './Modal/ModalDetail';
import ModalCreate from './Modal/ModalCreate';
import ModalUpdate from './Modal/ModalUpdate';

const Category = () => {
  const [currentTab, setCurrentTab] = useState('cha');
  const [allCha, setAllCha] = useState([]);
  const [displayedCha, setDisplayedCha] = useState([]);
  const [displayedCon, setDisplayedCon] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedParent, setSelectedParent] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedParentName, setSelectedParentName] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (currentTab === 'con' && selectedParent !== 'all') {
        handleSearch({ preventDefault: () => {} });
    } else {
        fetchCategories();
     }
    }, [selectedParent, currentTab]);

  const fetchCategories = async () => {
    try {
      const response = await getAllCategories();
      if (response.status === 200) {
        const categories = response.data;
        const cha = categories.filter(cat => cat.parentId === null);
        const con = categories.filter(cat => cat.parentId !== null);
        setAllCha(cha);
        setDisplayedCha(cha);
        setDisplayedCon(con);
      } else {
        toast.error('Không thể tải danh sách danh mục');
      }
    } catch (error) {
      toast.error('Lỗi hệ thống. Vui lòng thử lại.');
      console.error('Error fetching categories:', error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (currentTab === 'cha') {
      if (!searchKeyword.trim()) {
        toast.error('Vui lòng nhập từ khóa tìm kiếm');
        return;
      }
      try {
        const response = await searchCategories(searchKeyword);
        if (response.status === 200) {
          const filteredCha = response.data.filter(cat => cat.parentId === null);
          setDisplayedCha(filteredCha);
          if (filteredCha.length === 0) {
            toast.error('Không tìm thấy danh mục');
          }
        } else {
          toast.error('Tìm kiếm thất bại');
        }
      } catch (error) {
        toast.error('Lỗi hệ thống. Vui lòng thử lại.');
        console.error('Search error:', error);
      }
    } else {
      try {
        let response;
        if (selectedParent !== 'all') {
          const filterRequest = {
            name: searchKeyword.trim() || null,
            parentId: selectedParent
          };
          response = await filterCategories(filterRequest);
        } else if (searchKeyword.trim()) {
          response = await searchCategories(searchKeyword);
        } else {
          fetchCategories();
          return;
        }
        if (response.status === 200) {
          const filteredCon = response.data.filter(cat => cat.parentId !== null);
          setDisplayedCon(filteredCon);
          if (filteredCon.length === 0) {
            toast.error('Không tìm thấy danh mục con');
          }
        } else {
          toast.error('Tìm kiếm hoặc lọc thất bại');
        }
      } catch (error) {
        toast.error('Lỗi hệ thống. Vui lòng thử lại.');
        console.error('Search/Filter error:', error);
      }
    }
  };

  const handleResetSearch = () => {
    setSearchKeyword('');
    setSelectedParent('all');
    fetchCategories();
  };

  const handleDeleteClick = (category) => {
    setCategoryToDelete(category);
    setIsModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;

    try {
      const response = await deleteCategory(categoryToDelete.id);
      if (response.status === 200) {
        toast.success('Xóa danh mục thành công');
        fetchCategories();
      } else {
        switch (response.status) {
          case 404:
            toast.error('Không tìm thấy danh mục');
            break;
          case 409:
            toast.error('Danh mục có danh mục con, không thể xóa');
            break;
          default:
            toast.error('Xóa danh mục thất bại');
        }
      }
    } catch (error) {
      toast.error('Lỗi hệ thống. Vui lòng thử lại.');
      console.error('Delete error:', error);
    } finally {
      setIsModalOpen(false);
      setCategoryToDelete(null);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCategoryToDelete(null);
  };

  const handleDetailClick = async (categoryId) => {
    try {
      const response = await getCategoryById(categoryId);
      if (response.status === 200) {
        setSelectedCategory(response.data);
        if (response.data.parentId) {
          const parentResponse = await getCategoryById(response.data.parentId);
          if (parentResponse.status === 200) {
            setSelectedParentName(parentResponse.data.name);
          } else {
            setSelectedParentName('Không xác định');
          }
        } else {
          setSelectedParentName(null);
        }
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
    setSelectedCategory(null);
    setSelectedParentName(null);
  };

  const handleCreateClick = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleUpdateClick = (category) => {
    setSelectedCategory(category);
    setIsUpdateModalOpen(true);
  };

  const handleCloseUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setSelectedCategory(null);
  };

  const idToName = allCha.reduce((acc, cat) => {
    acc[cat.id] = cat.name;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-center" reverseOrder={false} />
      <Header username={sessionStorage.getItem('username')} />
      <Sidebar username={sessionStorage.getItem('username')} />
      <div className="p-4 sm:ml-64 pt-20">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-4 border-b-2 border-blue-700 pb-2">
            <h2 className="text-2xl font-bold text-blue-700">
              DANH SÁCH DANH MỤC
            </h2>
            <nav className="text-sm text-gray-600 flex items-center flex-nowrap">
              <span className="flex items-center gap-1">
              <FaHome className="text-gray-600" />
              <span>Trang chủ</span>
              </span>
              <span className="mx-2">{'>'}</span>
              <Link to="/admin/category" className="hover:underline">Quản lý danh mục</Link>
              <span className="mx-2">{'>'}</span>
              <span className="font-medium text-gray-800">Danh sách</span>
            </nav>
          </div>
          <div className="bg-white shadow-md rounded-lg p-4">
            <div className="flex mb-4">
              <button
                onClick={() => setCurrentTab('cha')}
                className={`px-4 py-2 rounded-t-lg ${currentTab === 'cha' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
              >
                Danh mục
              </button>
              <button
                onClick={() => setCurrentTab('con')}
                className={`px-4 py-2 rounded-t-lg ${currentTab === 'con' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
              >
                Danh mục con
              </button>
            </div>
            <div className="flex flex-col sm:flex-row justify-between mb-4">
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="Tìm kiếm danh mục"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                />
                {currentTab === 'con' && (
                  <div className="relative inline-block w-48">
                    <select
                      value={selectedParent}
                      onChange={(e) => setSelectedParent(e.target.value)}
                      className="appearance-none w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                    >
                      <option value="all">Tất cả</option>
                      {allCha.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" />
                  </div>
                )}
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center gap-2">
                    <FaSearch /> Tìm kiếm
                  </button>
                  {(searchKeyword || (currentTab === 'con' && selectedParent !== 'all')) && (
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
                <FaPlus /> Thêm danh mục
              </button>
            </div>
            {currentTab === 'cha' ? (
              displayedCha.length > 0 ? (
                <div className="overflow-x-auto overflow-y-auto max-h-[53vh] border rounded-md">
                  <table className="w-full border-collapse">
                    <thead className="sticky top-0">
                      <tr className="bg-blue-700 text-white">
                        <th className="p-2 text-center border-r border-gray-300">STT</th>
                        <th className="p-2 text-center border-r border-gray-300">Tên danh mục</th>
                        <th className="p-2 text-center">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayedCha.map((category, index) => (
                        <tr key={category.id} className="hover:bg-gray-100 even:bg-gray-50">
                          <td className="p-2 text-center border-r border-gray-300">{index + 1}</td>
                          <td className="p-2 text-center border-r border-gray-300">{category.name}</td>
                          <td className="p-2 text-center">
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => handleDetailClick(category.id)}
                                className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 flex items-center gap-1"
                                title="Chi tiết"
                              >
                                <FaInfoCircle /> Chi tiết
                              </button>
                              <button
                                onClick={() => handleUpdateClick(category)}
                                className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 flex items-center gap-1"
                                title="Sửa"
                              >
                                <FaEdit /> Sửa
                              </button>
                              <button
                                onClick={() => handleDeleteClick(category)}
                                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 flex items-center gap-1"
                                title="Xóa"
                              >
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
              )
            ) : (
              displayedCon.length > 0 ? (
                <div className="overflow-x-auto overflow-y-auto max-h-[53vh] border rounded-md">
                  <table className="w-full border-collapse">
                    <thead className="sticky top-0">
                      <tr className="bg-blue-700 text-white">
                        <th className="p-2 text-center border-r border-gray-300">STT</th>
                        <th className="p-2 text-center border-r border-gray-300">Tên danh mục</th>
                        <th className="p-2 text-center border-r border-gray-300">Danh mục cha</th>
                        <th className="p-2 text-center">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayedCon.map((category, index) => (
                        <tr key={category.id} className="hover:bg-gray-100 even:bg-gray-50">
                          <td className="p-2 text-center border-r border-gray-300">{index + 1}</td>
                          <td className="p-2 text-center border-r border-gray-300">{category.name}</td>
                          <td className="p-2 text-center border-r border-gray-300">{idToName[category.parentId] || 'Không xác định'}</td>
                          <td className="p-2 text-center">
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => handleDetailClick(category.id)}
                                className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 flex items-center gap-1"
                                title="Chi tiết"
                              >
                                <FaInfoCircle /> Chi tiết
                              </button>
                              <button
                                onClick={() => handleUpdateClick(category)}
                                className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 flex items-center gap-1"
                                title="Sửa"
                              >
                                <FaEdit /> Sửa
                              </button>
                              <button
                                onClick={() => handleDeleteClick(category)}
                                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 flex items-center gap-1"
                                title="Xóa"
                              >
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
              )
            )}
          </div>
        </div>
      </div>
      <ModalDelete
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleDeleteConfirm}
        title="Xác nhận xóa danh mục"
        message={`Bạn có chắc chắn muốn xóa danh mục ${categoryToDelete?.name} ? Hành động này không thể hoàn tác.`}
      />
      <ModalDetail
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        category={selectedCategory}
        parentName={selectedParentName}
      />
      <ModalCreate
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onCategoryCreated={fetchCategories}
        isChild={currentTab === 'con'}
        parentOptions={allCha.map(cat => ({ value: cat.id, label: cat.name }))}
      />
      <ModalUpdate
        isOpen={isUpdateModalOpen}
        onClose={handleCloseUpdateModal}
        onCategoryUpdated={fetchCategories}
        category={selectedCategory}
        isChild={currentTab === 'con'}
        parentOptions={allCha.map(cat => ({ value: cat.id, label: cat.name }))}
      />
      <Footer />
    </div>
  );
};

export default Category;