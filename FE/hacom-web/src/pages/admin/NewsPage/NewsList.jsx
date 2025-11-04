import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { FaSearch, FaPlus, FaEdit, FaTrash, FaInfoCircle, FaHome, FaChevronDown } from 'react-icons/fa';
import { getAllNews, searchNews, deleteNews, filterNews } from '../../../api/APIs/newsApi';
import Header from '../Components/Header';
import Sidebar from '../Components/Sidebar';
import Footer from '../Components/Footer';
import ModalDelete from '../Components/Modal/ModalDelete';

const NewsList = () => {
  const [news, setNews] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterHighlight, setFilterHighlight] = useState('all');
  const [filterActive, setFilterActive] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newsToDelete, setNewsToDelete] = useState(null);
  const navigate = useNavigate();

    const highlightOptions = [
        { value: 'all', label: 'Tất cả' },
        { value: 'true', label: 'Có nổi bật' },
        { value: 'false', label: 'Không nổi bật' },
    ];

    const activeOptions = [
        { value: 'all', label: 'Tất cả' },
        { value: 'true', label: 'Có hiển thị' },
        { value: 'false', label: 'Không hiển thị' },
    ];


  useEffect(() => {
    fetchNews();
  }, []);

  useEffect(() => {
    handleFilterNews();
  }, [filterHighlight, filterActive]);

  const fetchNews = async () => {
    try {
      const response = await getAllNews();
      if (response.status === 200) {
        const normalizedNews = response.data.map(item => ({
          ...item,
          isActive: item.active === true || item.active === 1,
          isHighlight: item.highlight === true || item.highlight === 1,
        }));
        setNews(normalizedNews);
      } else {
        toast.error('Không thể tải danh sách tin tức');
      }
    } catch (error) {
      toast.error('Lỗi hệ thống. Vui lòng thử lại.');
      console.error('Error fetching news:', error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchKeyword.trim()) {
      toast.error('Vui lòng nhập từ khóa tìm kiếm');
      return;
    }
    try {
      const response = await searchNews(searchKeyword);
      if (response.status === 200) {
        const normalizedNews = response.data.map(item => ({
          ...item,
          isActive: item.active === true || item.active === 1,
          isHighlight: item.highlight === true || item.highlight === 1,
        }));
        setNews(normalizedNews);
        if (response.data.length === 0) {
          toast.error('Không tìm thấy tin tức');
        }
      } else {
        toast.error('Tìm kiếm thất bại');
      }
    } catch (error) {
      toast.error('Lỗi hệ thống. Vui lòng thử lại.');
      console.error('Search error:', error);
    }
  };

  const handleFilterNews = async () => {
    try {
      const filterRequest = {
        isHighlight: filterHighlight !== 'all' ? filterHighlight === 'true' : null,
        isActive: filterActive !== 'all' ? filterActive === 'true' : null,
      };
      const response = await filterNews(filterRequest);
      if (response.status === 200) {
        const normalizedNews = response.data.map(item => ({
          ...item,
          isActive: item.active === true || item.active === 1,
          isHighlight: item.highlight === true || item.highlight === 1,
        }));
        setNews(normalizedNews);
        if (response.data.length === 0) {
          toast.error('Không tìm thấy tin tức với bộ lọc này');
        }
      } else {
        toast.error('Lọc tin tức thất bại');
      }
    } catch (error) {
      toast.error('Lỗi hệ thống. Vui lòng thử lại.');
      console.error('Filter error:', error);
    }
  };

  const handleResetSearch = () => {
    setSearchKeyword('');
    setFilterHighlight('all');
    setFilterActive('all');
    fetchNews();
  };

  const handleDeleteClick = (newsItem) => {
    setNewsToDelete(newsItem);
    setIsModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!newsToDelete) return;
    try {
      const response = await deleteNews(newsToDelete.id);
      if (response.status === 200) {
        toast.success('Xóa tin tức thành công');
        fetchNews();
      } else {
        toast.error('Xóa tin tức thất bại');
      }
    } catch (error) {
      toast.error('Lỗi hệ thống. Vui lòng thử lại.');
      console.error('Delete error:', error);
    } finally {
      setIsModalOpen(false);
      setNewsToDelete(null);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewsToDelete(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-center" reverseOrder={false} />
      <Header username={sessionStorage.getItem('username')} />
      <Sidebar username={sessionStorage.getItem('username')} />
      <div className="p-4 sm:ml-64 pt-20">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-4 border-b-2 border-blue-700 pb-2">
            <h2 className="text-2xl font-bold text-blue-700">DANH SÁCH TIN TỨC</h2>
            <nav className="text-sm text-gray-600 flex items-center flex-nowrap">
              <span className="flex items-center gap-1">
                <FaHome className="text-gray-600" />
                <span>Trang chủ</span>
              </span>
              <span className="mx-2">{'>'}</span>
              <Link to="/admin/news" className="hover:underline">Quản lý tin tức</Link>
              <span className="mx-2">{'>'}</span>
              <span className="font-medium text-gray-800">Danh sách</span>
            </nav>
          </div>
          <div className="bg-white shadow-md rounded-lg p-4">
            <div className="flex flex-col sm:flex-row justify-between mb-4">
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="Tìm kiếm tin tức"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                />
                <div className="relative inline-block w-48">
                    <select
                        value={filterHighlight}
                        onChange={(e) => setFilterHighlight(e.target.value)}
                        className="appearance-none w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                    >
                        {highlightOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                        ))}
                    </select>
                    <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" />
                    </div>

                    <div className="relative inline-block w-48">
                    <select
                        value={filterActive}
                        onChange={(e) => setFilterActive(e.target.value)}
                        className="appearance-none w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                    >
                        {activeOptions.map((option) => (
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
                  {(searchKeyword || filterHighlight !== 'all' || filterActive !== 'all') && (
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
                onClick={() => navigate('/admin/news/create')}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center gap-2 mt-2 sm:mt-0"
              >
                <FaPlus /> Thêm tin tức
              </button>
            </div>
            {news.length > 0 ? (
              <div className="overflow-x-auto overflow-y-auto max-h-[60vh] border rounded-md">
                <table className="w-full border-collapse">
                  <thead className="sticky top-0">
                    <tr className="bg-blue-700 text-white">
                      <th className="p-2 text-center border-r border-gray-300">STT</th>
                      <th className="p-2 text-center border-r border-gray-300">Tiêu đề</th>
                      <th className="p-2 text-center border-r border-gray-300">Ảnh</th>
                      <th className="p-2 text-center border-r border-gray-300">Nổi bật</th>
                      <th className="p-2 text-center border-r border-gray-300">Hiển thị</th>
                      <th className="p-2 text-center">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {news.map((newsItem, index) => (
                      <tr key={newsItem.id} className="hover:bg-gray-100 even:bg-gray-50">
                        <td className="p-2 text-center border-r border-gray-300">{index + 1}</td>
                        <td className="p-2 text-center border-r border-gray-300 truncate max-w-xs">{newsItem.title}</td>
                        <td className="p-2 text-center border-r border-gray-300">
                          {newsItem.thumbnailUrl ? (
                            <img
                              src={`${import.meta.env.VITE_IMAGE_BASE_URL}${newsItem.thumbnailUrl}`}
                              alt={newsItem.title}
                              className="w-16 h-16 object-cover mx-auto"
                            />
                          ) : (
                            'Không có ảnh'
                          )}
                        </td>
                        <td className="p-2 text-center border-r border-gray-300">
                          <input
                            type="checkbox"
                            checked={newsItem.isHighlight}
                            disabled
                            className="h-5 w-5"
                          />
                        </td>
                        <td className="p-2 text-center border-r border-gray-300">
                          <input
                            type="checkbox"
                            checked={newsItem.isActive}
                            disabled
                            className="h-5 w-5"
                          />
                        </td>
                        <td className="p-2 text-center">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => navigate(`/admin/news/detail/${newsItem.id}`)}
                              className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 flex items-center gap-1"
                              title="Chi tiết"
                            >
                              <FaInfoCircle /> Chi tiết
                            </button>
                            <button
                              onClick={() => navigate(`/admin/news/edit/${newsItem.id}`)}
                              className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 flex items-center gap-1"
                              title="Sửa"
                            >
                              <FaEdit /> Sửa
                            </button>
                            <button
                              onClick={() => handleDeleteClick(newsItem)}
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
        title="Xác nhận xóa tin tức"
        message={`Bạn có chắc chắn muốn xóa tin tức ${newsToDelete?.title} ? Hành động này không thể hoàn tác.`}
      />
      <Footer />
    </div>
  );
};

export default NewsList;