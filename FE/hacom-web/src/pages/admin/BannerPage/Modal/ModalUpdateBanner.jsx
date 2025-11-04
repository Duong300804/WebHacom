import React, { useState, useEffect } from 'react';
import { FaTimes, FaChevronDown } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { updateBanner } from '../../../../api/APIs/bannerApi';
import './Modal.css';

const ModalUpdateBanner = ({ isOpen, onClose, onBannerUpdated, banner }) => {
  const [formData, setFormData] = useState({
    title: '',
    imageUrl: '',
    link: '',
    position: 'SLIDE_TRANG_CHU',
    isActive: true,
  });

  const positionOptions = [
    { value: 'SLIDE_TRANG_CHU', label: 'Slide trang chủ' },
    { value: 'BANNER_PHAI', label: 'Banner phải' },
    { value: 'BANNER_TRAI', label: 'Banner trái' },
    { value: 'BANNER_DUOI', label: 'Banner dưới' },
    { value: 'BANNER', label: 'Banner' },
    { value: 'BANNER_LAPTOP', label: 'Banner Laptop' },
    { value: 'BANNER_PC', label: 'Banner PC' },
  ];

  useEffect(() => {
    if (banner) {
      setFormData({
        title: banner.title || '',
        imageUrl: banner.imageUrl || '',
        link: banner.link || '',
        position: banner.position || 'SLIDE_TRANG_CHU',
        isActive: banner.isActive === true || banner.isActive === 1,
      });
    }
  }, [banner]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (e) => {
    setFormData((prev) => ({ ...prev, isActive: e.target.value === 'true' }));
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
        setFormData((prev) => ({ ...prev, imageUrl: result.data }));
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
      const response = await updateBanner(banner.id, formData);
      if (response.status === 200) {
        toast.success('Cập nhật banner thành công');
        onBannerUpdated();
        onClose();
      } else {
        switch (response.status) {
          case 409:
            toast.error('Tiêu đề hoặc vị trí đã tồn tại');
            break;
          case 422:
            toast.error('Dữ liệu không hợp lệ');
            break;
          case 404:
            toast.error('Không tìm thấy banner');
            break;
          default:
            toast.error('Cập nhật banner thất bại');
        }
      }
    } catch (error) {
      toast.error('Lỗi hệ thống. Vui lòng thử lại.');
      console.error('Update banner error:', error);
    }
  };

  if (!isOpen || !banner) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full animate-fadeIn">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Cập nhật banner</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label className="font-medium text-gray-700">Tiêu đề:</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="border rounded-md px-2 py-1 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label className="font-medium text-gray-700">Ảnh:</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e.target.files[0])}
              className="border rounded-md px-2 py-1 focus:outline-none focus:border-blue-500"
            />
            {formData.imageUrl && (
              <img
                src={`${import.meta.env.VITE_IMAGE_BASE_URL}${formData.imageUrl}`}
                alt="Preview"
                className="mt-2 w-24 h-24 object-cover"
              />
            )}
          </div>
          <div className="flex flex-col">
            <label className="font-medium text-gray-700">Đường dẫn:</label>
            <input
              type="text"
              name="link"
              value={formData.link}
              onChange={handleChange}
              className="border rounded-md px-2 py-1 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label className="font-medium text-gray-700">Vị trí:</label>
            <div className="relative">
              <select
                name="position"
                value={formData.position}
                onChange={handleChange}
                required
                className="appearance-none w-full px-2 py-1 border rounded-md focus:outline-none focus:border-blue-500"
              >
                {positionOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" />
            </div>
          </div>
          <div className="flex flex-col">
            <label className="font-medium text-gray-700">Hiển thị:</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="isActive"
                  value="true"
                  checked={formData.isActive === true}
                  onChange={handleRadioChange}
                />
                Hiển thị
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="isActive"
                  value="false"
                  checked={formData.isActive === false}
                  onChange={handleRadioChange}
                />
                Không hiển thị
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
            >
              Cập nhật
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalUpdateBanner;