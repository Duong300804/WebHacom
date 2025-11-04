import React from 'react';
import { FaTimes } from 'react-icons/fa';
import trackOrderNotFoundImg from '../../../../assets/images/track-order-notfound.jpg'
import './Modal.css';

const TrackOrderNotFoundModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full relative animate-fadeIn">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
          <FaTimes size={20} />
        </button>
        <div className="text-center">
          <img src={trackOrderNotFoundImg} alt="Không tìm thấy đơn hàng" className="mx-auto mb-4 w-48 h-auto" />
          <h3 className="text-lg font-bold text-black mb-4">Không tìm thấy đơn hàng phù hợp</h3>
          <p className="text-gray-600">Vui lòng kiểm tra lại thông tin và thử lại.</p>
        </div>
      </div>
    </div>
  );
};

export default TrackOrderNotFoundModal;