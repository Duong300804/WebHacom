import React from 'react';
import '../../../admin/OrderPage/Modal/Modal.css'

const CancelOrderModal = ({ isOpen, onClose, onConfirm, orderId }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md animate-fadeIn">
        <h2 className="text-xl font-bold mb-4">Xác nhận hủy đơn hàng</h2>
        <p className="mb-6">Bạn có chắc chắn muốn hủy đơn hàng #{orderId}? Hành động này không thể hoàn tác.</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
          >
            Đóng
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
          >
            Hủy đơn
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelOrderModal;