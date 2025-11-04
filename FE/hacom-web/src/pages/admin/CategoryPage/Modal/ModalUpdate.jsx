import React, { useState, useEffect } from 'react';
import { FaTimes, FaChevronDown } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { updateCategory } from '../../../../api/APIs/categoryApi';
import './Modal.css';

const ModalUpdate = ({ isOpen, onClose, onCategoryUpdated, category, isChild, parentOptions }) => {
  const [formData, setFormData] = useState({
    name: '',
    parentId: '',
  });

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        parentId: category.parentId ? category.parentId.toString() : '',
      });
    }
  }, [category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const categoryData = {
      name: formData.name,
      parentId: isChild ? (formData.parentId || null) : null,
    };
    if (isChild && !categoryData.parentId) {
      toast.error('Vui lòng chọn danh mục cha');
      return;
    }
    try {
      const response = await updateCategory(category.id, categoryData);
      if (response.status === 200) {
        toast.success('Cập nhật danh mục thành công');
        onCategoryUpdated();
        onClose();
      } else {
        switch (response.status) {
          case 409:
            toast.error('Tên danh mục đã tồn tại');
            break;
          case 422:
            toast.error('Dữ liệu không hợp lệ');
            break;
          case 404:
            toast.error('Không tìm thấy danh mục hoặc danh mục cha');
            break;
          default:
            toast.error('Cập nhật danh mục thất bại');
        }
      }
    } catch (error) {
      toast.error('Lỗi hệ thống. Vui lòng thử lại.');
      console.error('Update category error:', error);
    }
  };

  if (!isOpen || !category) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full animate-fadeIn">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Cập nhật danh mục</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label className="font-medium text-gray-700">Tên danh mục:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="border rounded-md px-2 py-1 focus:outline-none focus:border-blue-500"
            />
          </div>
          {isChild && (
            <div className="flex flex-col">
              <label className="font-medium text-gray-700">Danh mục cha:</label>
              <div className="relative">
                <select
                  name="parentId"
                  value={formData.parentId}
                  onChange={handleChange}
                  required
                  className="appearance-none w-full px-2 py-1 border rounded-md focus:outline-none focus:border-blue-500"
                >
                  <option value="">Chọn danh mục cha</option>
                  {parentOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" />
              </div>
            </div>
          )}
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

export default ModalUpdate;