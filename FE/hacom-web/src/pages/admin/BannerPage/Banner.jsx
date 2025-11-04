import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { FaSearch, FaPlus, FaEdit, FaTrash, FaInfoCircle, FaChevronDown, FaHome } from 'react-icons/fa';
import { getAllBanners, searchBanners, deleteBanner, filterBanners, getBannerById } from '../../../api/APIs/bannerApi';
import Header from '../Components/Header';
import Sidebar from '../Components/Sidebar';
import Footer from '../Components/Footer';
import ModalDelete from '../Components/Modal/ModalDelete';
import ModalDetailBanner from './Modal/ModalDetailBanner';
import ModalCreateBanner from './Modal/ModalCreateBanner';
import ModalUpdateBanner from './Modal/ModalUpdateBanner';

const Banner = () => {
  const [banners, setBanners] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterPosition, setFilterPosition] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState(null);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const navigate = useNavigate();

  const positionOptions = [
    { value: 'all', label: 'Tất cả' },
    { value: 'SLIDE_TRANG_CHU', label: 'Slide trang chủ' },
    { value: 'BANNER_PHAI', label: 'Banner phải' },
    { value: 'BANNER_TRAI', label: 'Banner trái' },
    { value: 'BANNER_DUOI', label: 'Banner dưới' },
    { value: 'BANNER', label: 'Banner' },
    { value: 'BANNER_LAPTOP', label: 'Banner Laptop' },
    { value: 'BANNER_PC', label: 'Banner PC' },
  ];

  useEffect(() => {
    fetchBanners();
  }, []);

  useEffect(() => {
    if (filterPosition === 'all') {
      fetchBanners();
    } else {
      handleFilterByPosition();
    }
  }, [filterPosition]);

  const fetchBanners = async () => {
    try {
      const response = await getAllBanners();
      if (response.status === 200) {
        const normalizedBanners = response.data.map(banner => ({
          ...banner,
          isActive: banner.active === true || banner.active === 1
        }));
        setBanners(normalizedBanners);
      } else {
        toast.error('Không thể tải danh sách banner');
      }
    } catch (error) {
      toast.error('Lỗi hệ thống. Vui lòng thử lại.');
      console.error('Error fetching banners:', error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchKeyword.trim()) {
      toast.error('Vui lòng nhập từ khóa tìm kiếm');
      return;
    }
    try {
      const response = await searchBanners(searchKeyword);
      if (response.status === 200) {
        const normalizedBanners = response.data.map(banner => ({
          ...banner,
          isActive: banner.active === true || banner.active === 1
        }));
        setBanners(normalizedBanners);
        if (response.data.length === 0) {
          toast.error('Không tìm thấy banner');
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
      const filterRequest = { position: filterPosition !== 'all' ? filterPosition : null };
      const response = await filterBanners(filterRequest);
      if (response.status === 200) {
        const normalizedBanners = response.data.map(banner => ({
          ...banner,
          isActive: banner.active === true || banner.active === 1
        }));
        setBanners(normalizedBanners);
        if (response.data.length === 0) {
          toast.error('Không tìm thấy banner với vị trí này');
        }
      } else {
        toast.error('Lọc banner thất bại');
      }
    } catch (error) {
      toast.error('Lỗi hệ thống. Vui lòng thử lại.');
      console.error('Filter error:', error);
    }
  };

  const handleResetSearch = () => {
    setSearchKeyword('');
    setFilterPosition('all');
    fetchBanners();
  };

  const handleDeleteClick = (banner) => {
    setBannerToDelete(banner);
    setIsModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!bannerToDelete) return;

    try {
      const response = await deleteBanner(bannerToDelete.id);
      if (response.status === 200) {
        toast.success('Xóa banner thành công');
        fetchBanners();
      } else {
        toast.error('Xóa banner thất bại');
      }
    } catch (error) {
      toast.error('Lỗi hệ thống. Vui lòng thử lại.');
      console.error('Delete error:', error);
    } finally {
      setIsModalOpen(false);
      setBannerToDelete(null);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setBannerToDelete(null);
  };

  const handleDetailClick = async (bannerId) => {
    try {
      const response = await getBannerById(bannerId);
      if (response.status === 200) {
        setSelectedBanner({
          ...response.data,
          isActive: response.data.active === true || response.data.active === 1
        });
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
    setSelectedBanner(null);
  };

  const handleCreateClick = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleUpdateClick = (banner) => {
    setSelectedBanner({
      ...banner,
      isActive: banner.active === true || banner.active === 1
    });
    setIsUpdateModalOpen(true);
  };

  const handleCloseUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setSelectedBanner(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-center" reverseOrder={false} />
      <Header username={sessionStorage.getItem('username')} />
      <Sidebar username={sessionStorage.getItem('username')} />
      <div className="p-4 sm:ml-64 pt-20">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-4 border-b-2 border-blue-700 pb-2">
            <h2 className="text-2xl font-bold text-blue-700">DANH SÁCH BANNER</h2>
            <nav className="text-sm text-gray-600 flex items-center flex-nowrap">
              <span className="flex items-center gap-1">
                <FaHome className="text-gray-600" />
                <span>Trang chủ</span>
              </span>
              <span className="mx-2">{'>'}</span>
              <Link to="/admin/banner" className="hover:underline">Quản lý banner</Link>
              <span className="mx-2">{'>'}</span>
              <span className="font-medium text-gray-800">Danh sách</span>
            </nav>
          </div>
          <div className="bg-white shadow-md rounded-lg p-4">
            <div className="flex flex-col sm:flex-row justify-between mb-4">
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="Tìm kiếm banner"
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
                    {positionOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center gap-2"
                  >
                    <FaSearch /> Tìm kiếm
                  </button>
                  {(searchKeyword || filterPosition !== 'all') && (
                    <button
                      type="button"
                      onClick={handleResetSearch}
                      className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                    >
                      Quay lại
                    </button>
                  )}
                </div>
              </form>
              <button
                onClick={handleCreateClick}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center gap-2 mt-2 sm:mt-0"
              >
                <FaPlus /> Thêm banner
              </button>
            </div>
            {banners.length > 0 ? (
              <div className="overflow-x-auto overflow-y-auto max-h-[60vh] border rounded-md">
                <table className="w-full border-collapse">
                  <thead className="sticky top-0">
                    <tr className="bg-blue-700 text-white">
                      <th className="p-2 text-center border-r border-gray-300">STT</th>
                      <th className="p-2 text-center border-r border-gray-300">Tiêu đề</th>
                      <th className="p-2 text-center border-r border-gray-300">Ảnh</th>
                      <th className="p-2 text-center border-r border-gray-300">Vị trí</th>
                      <th className="p-2 text-center border-r border-gray-300">Hiển thị</th>
                      <th className="p-2 text-center">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {banners.map((banner, index) => (
                      <tr key={banner.id} className="hover:bg-gray-100 even:bg-gray-50">
                        <td className="p-2 text-center border-r border-gray-300">{index + 1}</td>
                        <td className="p-2 text-center border-r border-gray-300">{banner.title}</td>
                        <td className="p-2 text-center border-r border-gray-300">
                          {banner.imageUrl ? (
                            <img
                              src={`${import.meta.env.VITE_IMAGE_BASE_URL}${banner.imageUrl}`}
                              alt={banner.title}
                              className="w-16 h-16 object-cover mx-auto"
                            />
                          ) : (
                            'Không có ảnh'
                          )}
                        </td>
                        <td className="p-2 text-center border-r border-gray-300">
                          {positionOptions.find((opt) => opt.value === banner.position)?.label || banner.position}
                        </td>
                        <td className="p-2 text-center border-r border-gray-300">
                          <input
                            type="checkbox"
                            checked={banner.isActive}
                            disabled
                            className="h-5 w-5"
                          />
                        </td>
                        <td className="p-2 text-center">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleDetailClick(banner.id)}
                              className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 flex items-center gap-1"
                              title="Chi tiết"
                            >
                              <FaInfoCircle /> Chi tiết
                            </button>
                            <button
                              onClick={() => handleUpdateClick(banner)}
                              className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 flex items-center gap-1"
                              title="Sửa"
                            >
                              <FaEdit /> Sửa
                            </button>
                            <button
                              onClick={() => handleDeleteClick(banner)}
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
            )}
          </div>
        </div>
      </div>
      <ModalDelete
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleDeleteConfirm}
        title="Xác nhận xóa banner"
        message={`Bạn có chắc chắn muốn xóa banner ${bannerToDelete?.title} ? Hành động này không thể hoàn tác.`}
      />
      <ModalDetailBanner
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        banner={selectedBanner}
      />
      <ModalCreateBanner
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onBannerCreated={fetchBanners}
      />
      <ModalUpdateBanner
        isOpen={isUpdateModalOpen}
        onClose={handleCloseUpdateModal}
        onBannerUpdated={fetchBanners}
        banner={selectedBanner}
      />
      <Footer />
    </div>
  );
};

export default Banner;