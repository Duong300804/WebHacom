import React from 'react';
import { FaTimes } from 'react-icons/fa';
import './Modal.css';

const ModalDetailBanner = ({ isOpen, onClose, banner }) => {
  const positionOptions = [
    { value: 'SLIDE_TRANG_CHU', label: 'Slide trang chủ' },
    { value: 'BANNER_PHAI', label: 'Banner phải' },
    { value: 'BANNER_TRAI', label: 'Banner trái' },
    { value: 'BANNER_DUOI', label: 'Banner dưới' },
    { value: 'BANNER', label: 'Banner' },
    { value: 'BANNER_LAPTOP', label: 'Banner Laptop' },
    { value: 'BANNER_PC', label: 'Banner PC' },
  ];

  if (!isOpen || !banner) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full animate-fadeIn">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Chi tiết banner</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes size={20} />
          </button>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700 w-40">ID:</span>
            <span className="border rounded-md px-2 py-1 bg-gray-50 text-gray-800 flex-1 text-right break-words">{banner.id}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700 w-40">Tiêu đề:</span>
            <span className="border rounded-md px-2 py-1 bg-gray-50 text-gray-800 flex-1 text-right break-words">{banner.title}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700 w-40">Ảnh:</span>
            <div className="border rounded-md px-2 py-1 bg-gray-50 flex-1 text-right">
              {banner.imageUrl ? (
                <img
                  src={`${import.meta.env.VITE_IMAGE_BASE_URL}${banner.imageUrl}`}
                  alt={banner.title}
                  className="w-24 h-24 object-cover mx-auto"
                />
              ) : (
                <span className="text-gray-800">Không có ảnh</span>
              )}
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700 w-40">Đường dẫn:</span>
            <span className="border rounded-md px-2 py-1 bg-gray-50 text-gray-800 flex-1 text-right break-words">{banner.link || 'Không có'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700 w-40">Vị trí:</span>
            <span className="border rounded-md px-2 py-1 bg-gray-50 text-gray-800 flex-1 text-right break-words">
              {positionOptions.find((opt) => opt.value === banner.position)?.label || banner.position}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700 w-40">Hiển thị:</span>
            <span className="border rounded-md px-2 py-1 bg-gray-50 text-gray-800 flex-1 text-right break-words">
              {banner.active ? 'Hiển thị' : 'Không hiển thị'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700 w-40">Ngày tạo:</span>
            <span className="border rounded-md px-2 py-1 bg-gray-50 text-gray-800 flex-1 text-right break-words">{new Date(banner.createdAt).toLocaleString('vi-VN')}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700 w-40">Ngày cập nhật:</span>
            <span className="border rounded-md px-2 py-1 bg-gray-50 text-gray-800 flex-1 text-right break-words">
              {banner.updatedAt ? new Date(banner.updatedAt).toLocaleString('vi-VN') : 'Không có dữ liệu'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700 w-40">Trạng thái:</span>
            <span className="border rounded-md px-2 py-1 bg-gray-50 text-gray-800 flex-1 text-right break-words">{banner.deleteFlag === '0' ? 'Hoạt động' : 'Đã xóa'}</span>
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalDetailBanner;