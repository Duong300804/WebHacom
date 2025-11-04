import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { FaTimes, FaHome } from 'react-icons/fa';
import { getNewsById } from '../../../api/APIs/newsApi';
import Header from '../Components/Header';
import Sidebar from '../Components/Sidebar';
import Footer from '../Components/Footer';

const NewsDetail = () => {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNews();
  }, [id]);

  const fetchNews = async () => {
    try {
      const response = await getNewsById(id);
      if (response.status === 200) {
        setNews({
          ...response.data,
          isActive: response.data.active === true || response.data.active === 1,
          isHighlight: response.data.highlight === true || response.data.highlight === 1,
        });
      } else {
        toast.error('Không thể tải thông tin tin tức');
      }
    } catch (error) {
      toast.error('Lỗi hệ thống. Vui lòng thử lại.');
      console.error('Fetch news error:', error);
    }
  };

  if (!news) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-center" reverseOrder={false} />
      <Header username={sessionStorage.getItem('username')} />
      <Sidebar username={sessionStorage.getItem('username')} />
      <div className="p-4 sm:ml-64 pt-20">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-4 border-b-2 border-blue-700 pb-2">
            <h2 className="text-2xl font-bold text-blue-700">CHI TIẾT TIN TỨC</h2>
            <div className="flex items-center gap-4">
              <nav className="text-sm text-gray-600 flex items-center flex-nowrap">
                <span className="flex items-center gap-1">
                  <FaHome className="text-gray-600" />
                  <span>Trang chủ</span>
                </span>
                <span className="mx-2">{'>'}</span>
                <Link to="/admin/news" className="hover:underline">Quản lý tin tức</Link>
                <span className="mx-2">{'>'}</span>
                <span className="font-medium text-gray-800">Chi tiết</span>
              </nav>
              <button
                onClick={() => navigate('/admin/news')}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={20} />
              </button>
            </div>
          </div>
          <div className="bg-white shadow-md rounded-lg p-4">
            <div className="space-y-3 overflow-x-auto overflow-y-auto max-h-[60vh] border rounded-md">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700 w-40">ID:</span>
                <span className="border rounded-md px-2 py-1 bg-gray-50 text-gray-800 flex-1 text-right break-words">{news.id}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700 w-40">Tiêu đề:</span>
                <span className="border rounded-md px-2 py-1 bg-gray-50 text-gray-800 flex-1 text-right break-words">{news.title}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700 w-40">Tóm tắt:</span>
                <span className="border rounded-md px-2 py-1 bg-gray-50 text-gray-800 flex-1 text-right break-words">{news.summary}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700 w-40">Nội dung:</span>
                <span className="border rounded-md px-2 py-1 bg-gray-50 text-gray-800 flex-1 text-right break-words">{news.content}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700 w-40">Ảnh thumbnail:</span>
                <div className="border rounded-md px-2 py-1 bg-gray-50 flex-1 text-right">
                  {news.thumbnailUrl ? (
                    <img
                      src={`${import.meta.env.VITE_IMAGE_BASE_URL}${news.thumbnailUrl}`}
                      alt={news.title}
                      className="w-24 h-24 object-cover mx-auto"
                    />
                  ) : (
                    <span className="text-gray-800">Không có ảnh</span>
                  )}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700 w-40">Nổi bật:</span>
                <span className="border rounded-md px-2 py-1 bg-gray-50 text-gray-800 flex-1 text-right break-words">{news.isHighlight ? 'Có' : 'Không'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700 w-40">Hiển thị:</span>
                <span className="border rounded-md px-2 py-1 bg-gray-50 text-gray-800 flex-1 text-right break-words">{news.isActive ? 'Có' : 'Không'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700 w-40">Ngày tạo:</span>
                <span className="border rounded-md px-2 py-1 bg-gray-50 text-gray-800 flex-1 text-right break-words">{new Date(news.createdAt).toLocaleString('vi-VN')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700 w-40">Ngày cập nhật:</span>
                <span className="border rounded-md px-2 py-1 bg-gray-50 text-gray-800 flex-1 text-right break-words">{news.updatedAt ? new Date(news.updatedAt).toLocaleString('vi-VN') : 'Không có dữ liệu'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700 w-40">Trạng thái:</span>
                <span className="border rounded-md px-2 py-1 bg-gray-50 text-gray-800 flex-1 text-right break-words">{news.deleteFlag === '0' ? 'Hoạt động' : 'Đã xóa'}</span>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => navigate('/admin/news')}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NewsDetail;