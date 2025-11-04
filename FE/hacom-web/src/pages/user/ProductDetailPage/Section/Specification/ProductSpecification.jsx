import React, { useState } from 'react';
import SpecificationModal from './SpecificationModal';

export default function ProductSpecification({ product }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="py-4 px-4 mb-4 text-justify border border-gray-200 shadow-md rounded-lg">
      <h2 className="text-xl font-bold text-gray-800">Thông số kỹ thuật</h2>
      <div className="border-b border-gray-300 my-4"></div>
      <div className="relative max-h-[65vh] overflow-hidden">
        <table className="w-full text-left text-sm text-[#212a36] border border-gray-200">
          <thead>
            <tr>
              <th colSpan="2" className="text-sm font-semibold py-2 pl-4 border-b border-gray-200">Mô tả chi tiết</th>
            </tr>
          </thead>
          <tbody>
            {product.specifications.map((spec, index) => (
              <tr key={index} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}`}>
                <td className="py-2 px-4 font-semibold border-t border-r border-gray-200">{spec.name}</td>
                <td className="py-2 px-4 border-t border-gray-200">{spec.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
      </div>
      <button
        onClick={() => setIsModalOpen(true)}
        className="mt-4 w-full px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition duration-300"
      >
        Xem thêm cấu hình chi tiết
      </button>
      {isModalOpen && (
        <SpecificationModal product={product} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}