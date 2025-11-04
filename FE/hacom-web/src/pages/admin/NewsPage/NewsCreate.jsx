import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { FaTimes, FaHome, FaChevronDown } from 'react-icons/fa';
import { createNews } from '../../../api/APIs/newsApi';
import Header from '../Components/Header';
import Sidebar from '../Components/Sidebar';
import Footer from '../Components/Footer';

const NewsCreate = () => {
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    thumbnailUrl: '',
    isHighlight: true,
    isActive: true,
  });
  const navigate = useNavigate();

  const booleanOptions = [
    { value: true, label: 'Có' },
    { value: false, label: 'Không' },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value === 'true' }));
  };

  const handleImageUpload = async (file) => {
    if (!file) return;
    const uploadData = new FormData();
    uploadData.append('file', file);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/upload-image`, {
        method: 'POST',
        body: uploadData,
      });
      const result = await response.json();
      if (result.status === 200) {
        setFormData((prev) => ({ ...prev, thumbnailUrl: result.data }));
        toast.success('Upload ảnh thành công');
      } else {
        toast.error(result.message || 'Lỗi khi upload ảnh');
      }
    } catch (error) {
      toast.error('Lỗi hệ thống khi upload ảnh');
      console.error('Upload image error:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await createNews(formData);
      if (response.status === 201) {
        toast.success('Tạo tin tức thành công');
        navigate('/admin/news');
      } else {
        switch (response.status) {
          case 409:
            toast.error('Tiêu đề đã tồn tại');
            break;
          case 422:
            toast.error('Dữ liệu không hợp lệ');
            break;
          default:
            toast.error('Tạo tin tức thất bại');
        }
      }
    } catch (error) {
      toast.error('Lỗi hệ thống. Vui lòng thử lại.');
      console.error('Create news error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-center" reverseOrder={false} />
      <Header username={sessionStorage.getItem('username')} />
      <Sidebar username={sessionStorage.getItem('username')} />
      <div className="p-4 sm:ml-64 pt-20">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-4 border-b-2 border-blue-700 pb-2">
            <h2 className="text-2xl font-bold text-blue-700">THÊM TIN TỨC</h2>
            <div className="flex items-center gap-4">
              <nav className="text-sm text-gray-600 flex items-center flex-nowrap">
                <span className="flex items-center gap-1">
                  <FaHome className="text-gray-600" />
                  <span>Trang chủ</span>
                </span>
                <span className="mx-2">{'>'}</span>
                <Link to="/admin/news" className="hover:underline">Quản lý tin tức</Link>
                <span className="mx-2">{'>'}</span>
                <span className="font-medium text-gray-800">Thêm</span>
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
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-4 overflow-x-auto overflow-y-auto max-h-[53vh] border rounded-md p-4">
                <div className="flex flex-col">
                  <label className="font-medium text-gray-700">Tiêu đề:</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="border rounded-md px-2 py-1 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="font-medium text-gray-700">Tóm tắt:</label>
                  <input
                    type="text"
                    name="summary"
                    value={formData.summary}
                    onChange={handleInputChange}
                    required
                    className="border rounded-md px-2 py-1 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="font-medium text-gray-700">Nội dung:</label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    required
                    rows="8"
                    className="border rounded-md px-2 py-1 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="font-medium text-gray-700">Ảnh thumbnail:</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e.target.files[0])}
                    className="border rounded-md px-2 py-1 focus:outline-none focus:border-blue-500"
                  />
                  {formData.thumbnailUrl && (
                    <img
                      src={`${import.meta.env.VITE_IMAGE_BASE_URL}${formData.thumbnailUrl}`}
                      alt="Thumbnail Preview"
                      className="mt-2 w-24 h-24 object-cover"
                    />
                  )}
                </div>
                <div className="flex flex-col">
                  <label className="font-medium text-gray-700">Nổi bật:</label>
                  <div className="flex gap-4">
                    {booleanOptions.map((option) => (
                      <label key={option.value} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="isHighlight"
                          value={option.value}
                          checked={formData.isHighlight === option.value}
                          onChange={() => handleRadioChange('isHighlight', option.value)}
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col">
                  <label className="font-medium text-gray-700">Hiển thị:</label>
                  <div className="flex gap-4">
                    {booleanOptions.map((option) => (
                      <label key={option.value} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="isActive"
                          value={option.value}
                          checked={formData.isActive === option.value}
                          onChange={() => handleRadioChange('isActive', option.value)}
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => navigate('/admin/news')}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                >
                  Thêm
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NewsCreate;