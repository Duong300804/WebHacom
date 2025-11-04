import React from 'react';
import { FaTimes } from 'react-icons/fa';
import './Modal.css'

const ModalDetail = ({ isOpen, onClose, user }) => {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full animate-fadeIn">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Chi tiết khách hàng</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes size={20} />
          </button>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700 w-40">ID:</span>
            <span className="border rounded-md px-2 py-1 bg-gray-50 text-gray-800 flex-1 text-right break-words">{user.id}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700 w-40">Tên tài khoản:</span>
            <span className="border rounded-md px-2 py-1 bg-gray-50 text-gray-800 flex-1 text-right break-words">{user.username}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700 w-40">Email:</span>
            <span className="border rounded-md px-2 py-1 bg-gray-50 text-gray-800 flex-1 text-right break-words">{user.email}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700 w-40">Họ tên:</span>
            <span className="border rounded-md px-2 py-1 bg-gray-50 text-gray-800 flex-1 text-right break-words">{user.fullName || 'Không có dữ liệu'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700 w-40">SĐT:</span>
            <span className="border rounded-md px-2 py-1 bg-gray-50 text-gray-800 flex-1 text-right break-words">{user.phone || 'Không có dữ liệu'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700 w-40">Địa chỉ:</span>
            <span className="border rounded-md px-2 py-1 bg-gray-50 text-gray-800 flex-1 text-right break-words">{user.address || 'Không có dữ liệu'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700 w-40">Ngày tạo:</span>
            <span className="border rounded-md px-2 py-1 bg-gray-50 text-gray-800 flex-1 text-right break-words">{new Date(user.createDate).toLocaleString('vi-VN')}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700 w-40">Ngày cập nhật:</span>
            <span className="border rounded-md px-2 py-1 bg-gray-50 text-gray-800 flex-1 text-right break-words">{user.updateDate ? new Date(user.updateDate).toLocaleString('vi-VN') : 'Không có dữ liệu'}</span>
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition">
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalDetail;