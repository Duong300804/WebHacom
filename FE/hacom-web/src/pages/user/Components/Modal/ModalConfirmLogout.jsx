import React from 'react';
import './Modal.css'

const ModalConfirmLogout = ({ isOpen, onClose, onConfirm, title = "Xác nhận thoát tài khoản", message = "Bạn có chắc chắn muốn thoát tài khoản không?" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[80]">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full animate-fadeIn">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
          >
            Thoát
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmLogout;