import React, { useState, useEffect } from 'react';
import { FaTimes, FaChevronDown } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { updateStaff } from '../../../../api/APIs/staffApi';
import './Modal.css';

const ModalUpdate = ({ isOpen, onClose, onStaffUpdated, staff }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    position: 'SALE',
  });

  useEffect(() => {
    if (staff) {
      setFormData({
        fullName: staff.fullName || '',
        phone: staff.phone || '',
        address: staff.address || '',
        position: staff.position || 'SALE',
      });
    }
  }, [staff]);

  const positionOptions = [
    { value: 'SALE', label: 'Bán hàng' },
    { value: 'TECHNICIAN', label: 'Kỹ thuật viên' },
    { value: 'SERVICE', label: 'Dịch vụ' },
    { value: 'WARRANTY', label: 'Bảo hành' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await updateStaff(staff.id, formData);
      if (response.status === 200) {
        toast.success('Cập nhật nhân viên thành công');
        onStaffUpdated();
        onClose();
      } else {
        switch (response.status) {
          case 409:
            toast.error('Số điện thoại đã tồn tại');
            break;
          case 422:
            toast.error('Dữ liệu không hợp lệ');
            break;
          default:
            toast.error('Cập nhật nhân viên thất bại');
        }
      }
    } catch (error) {
      toast.error('Lỗi hệ thống. Vui lòng thử lại.');
      console.error('Update staff error:', error);
    }
  };

  if (!isOpen || !staff) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full animate-fadeIn">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Sửa thông tin nhân viên</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes size={20} />
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto pr-1 create-user-scroll-bar">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col">
              <label className="font-medium text-gray-700">Họ và tên:</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="border rounded-md px-2 py-1 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-medium text-gray-700">Số điện thoại:</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="border rounded-md px-2 py-1 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-medium text-gray-700">Địa chỉ:</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="border rounded-md px-2 py-1 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-medium text-gray-700">Chức vụ:</label>
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
    </div>
  );
};

export default ModalUpdate;