import React from 'react';
import { FaTimes } from 'react-icons/fa';
import './Modal.css';

export default function SpecificationModal({ product, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 pt-12 rounded-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
        >
          <FaTimes size={24} />
        </button>
        <h2 className="text-lg font-bold text-gray-800 mb-4">{product.name}</h2>
        <table className="w-full text-left text-base text-[#212a36] border border-gray-200">
          <thead>
            <tr>
              <th colSpan="2" className="font-semibold pb-2 pl-4 border-b border-gray-200">Mô tả chi tiết</th>
            </tr>
          </thead>
          <tbody>
            {product.specifications.map((spec, index) => (
              <tr key={index} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'} border-b border-gray-200`}>
                <td className="py-2 px-4 font-semibold border-t border-r border-gray-200">{spec.name}</td>
                <td className="py-2 px-4 border-t border-gray-200">{spec.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}