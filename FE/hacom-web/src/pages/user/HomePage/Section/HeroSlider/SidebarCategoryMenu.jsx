import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; 
import { createPortal } from 'react-dom'; 
import { FaLaptop, FaDesktop, FaChevronRight } from 'react-icons/fa';
import { GiPc } from "react-icons/gi";
import { HiOutlineCpuChip } from "react-icons/hi2";
import { PiMonitorBold } from "react-icons/pi";
import { BsUsbMini } from "react-icons/bs";
import { PiThermometerCold } from "react-icons/pi";
import { FaRegLightbulb } from "react-icons/fa";
import { IoGameController } from "react-icons/io5";
import { PiOfficeChair } from "react-icons/pi";
import { FaHeadphones } from "react-icons/fa";
import { FaVolumeUp } from "react-icons/fa";
import { FaWifi } from "react-icons/fa";
import { getAllCategories, getCategoryById } from '../../../../../api/APIs/categoryApi';
import { getAllBrands } from '../../../../../api/APIs/brandApi';
import { getAllTags } from '../../../../../api/APIs/tagApi';

const SidebarCategoryMenu = ({ onClose }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [timeoutId, setTimeoutId] = useState(null);
  const [menuHeight, setMenuHeight] = useState(0);
  const menuRef = useRef(null);
  const navigate = useNavigate(); 
  const location = useLocation(); 

  const icons = [FaLaptop, GiPc, HiOutlineCpuChip, PiMonitorBold, BsUsbMini, PiThermometerCold, FaRegLightbulb,
                IoGameController, PiOfficeChair, FaHeadphones, FaVolumeUp, FaWifi];

  const priceRanges = [
    'Dưới 10 triệu',
    'Từ 10 triệu - 15 triệu',
    'Từ 15 triệu - 20 triệu',
    'Từ 20 triệu - 30 triệu',
    'Từ 30 triệu - 40 triệu',
    'Từ 40 triệu - 50 triệu',
    'Trên 50 triệu',
  ];

  const priceRangeMap = {
    'Dưới 10 triệu': 'duoi10trieu',
    'Từ 10 triệu - 15 triệu': '10trieu-15trieu',
    'Từ 15 triệu - 20 triệu': '15trieu-20trieu',
    'Từ 20 triệu - 30 triệu': '20trieu-30trieu',
    'Từ 30 triệu - 40 triệu': '30trieu-40trieu',
    'Từ 40 triệu - 50 triệu': '40trieu-50trieu',
    'Trên 50 triệu': 'tren50trieu',
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getAllCategories();
        const parentCategories = res.data.filter(cat => !cat.parentId);
        setCategories(parentCategories);
        setLoading(false);
      } catch (err) {
        setError('Lỗi khi tải danh mục');
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (menuRef.current) {
      setMenuHeight(menuRef.current.offsetHeight);
    }
  }, [categories]);

  const handleCategoryHover = async (category) => {
    if (timeoutId) clearTimeout(timeoutId);
    setHoveredCategory(category);

    try {
      const subcategories = (await getAllCategories()).data.filter(cat => cat.parentId === category.id);
      const brands = (await getAllBrands()).data;
      const tags = (await getAllTags()).data;

      setModalData({
        category,
        subcategories,
        brands,
        tags,
      });
    } catch (err) {
      setError('Lỗi khi tải dữ liệu modal');
    }
  };

  const handleCategoryClick = (categoryId) => {
    navigate(`/category/${categoryId}`);
    onClose(); 
  };

  const handleCategoryLeave = () => {
    const id = setTimeout(() => {
      setHoveredCategory(null);
      setModalData(null);
    }, 500);
    setTimeoutId(id);
  };

  const handleModalHover = () => {
    if (timeoutId) clearTimeout(timeoutId);
  };

  const handleModalLeave = () => {
    const id = setTimeout(() => {
      setHoveredCategory(null);
      setModalData(null);
    }, 500);
    setTimeoutId(id);
  };

  if (loading) {
    return <div className="p-4 bg-white rounded-lg shadow-md">Đang tải...</div>;
  }

  if (error) {
    return <div className="p-4 bg-white rounded-lg shadow-md text-red-600">{error}</div>;
  }

  return (
    <>
      {/* Overlay khi hover */}
      {(hoveredCategory && modalData) && createPortal(
        <div 
          className="fixed inset-0 bg-black bg-opacity-40 z-30 transition-opacity duration-300"
          onClick={onClose}
        ></div>,
        document.body
      )}
      {/* Menu chính */}
      <div 
        ref={menuRef}
        className="absolute top-0 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-50 overflow-hidden"
      >
        <ul 
          className="divide-y divide-gray-200"
          onMouseLeave={handleCategoryLeave}
          onMouseEnter={handleModalHover}
        >
          {categories.map((category, index) => (
            <li 
              key={category.id}
              className="group flex items-center justify-between px-4 py-3 cursor-pointer transition hover:bg-red-600"
              onMouseEnter={() => handleCategoryHover(category)}
              onClick={() => handleCategoryClick(category.id)}
            >
              <div className="flex items-center gap-3">
                {icons[index] ? React.createElement(icons[index], { className: 'text-xl text-gray-700 group-hover:text-white' }) : <FaLaptop className="text-xl text-gray-700 group-hover:text-white" />}
                <span className="text-sm group-hover:text-white">{category.name}</span>
              </div>
              <FaChevronRight className="text-sm group-hover:text-white" />
            </li>
          ))}
        </ul>
      </div>
      {/* Modal hiển thị khi hover */}
      {hoveredCategory && modalData && (
        <div 
          className="absolute top-0 left-full ml-2 bg-white border border-gray-300 rounded-lg shadow-lg z-40 overflow-auto sidebar-scrollbar" 
          style={{ width: 'calc(100vw - 25%)', maxWidth: '66vw', height: '74vh' }}
          onMouseEnter={handleModalHover}
          onMouseLeave={handleModalLeave}
        >
          <div className="p-6 grid grid-cols-4 gap-6 h-full">
            {/* Cột 1: Danh mục con */}
            <div className="space-y-3">
              <h3 className="text-red-600 font-semibold text-sm">
                {modalData.category.name} theo nhu cầu
              </h3>
              <div className="space-y-1">
                {modalData.subcategories.length > 0 ? (
                  modalData.subcategories.map((subcat) => (
                    <div 
                      key={subcat.id}
                      className="group flex items-center justify-between py-1 px-2 rounded hover:bg-gray-50 cursor-pointer transition-all relative"
                      onClick={() => {
                        const parentId = modalData.category.id;
                        navigate(`/category/${parentId}?subCategories=${subcat.id}`);
                        onClose(); // Đóng menu sau khi click
                      }}
                    >
                      <span className="text-sm text-gray-700">{subcat.name}</span>
                      <FaChevronRight className="text-xs text-gray-400 group-hover:text-red-600 transition-colors" />
                      <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-gray-500">Không có danh mục con</div>
                )}
              </div>
            </div>
            {/* Cột 2: Hãng sản xuất */}
            <div className="space-y-3">
              <h3 className="text-red-600 font-semibold text-sm">
                {modalData.category.name} theo hãng
              </h3>
              <div className="space-y-1">
                {modalData.brands.length > 0 ? (
                  modalData.brands.map((brand) => (
                    <div 
                      key={brand.id}
                      className="group flex items-center justify-between py-1 px-2 rounded hover:bg-gray-50 cursor-pointer transition-all relative"
                      onClick={() => {
                        const parentId = modalData.category.id;
                        navigate(`/category/${parentId}?brands=${brand.id}`);
                        onClose(); // Đóng menu sau khi click
                      }}
                    >
                      <span className="text-sm text-gray-700">{brand.name}</span>
                      <FaChevronRight className="text-xs text-gray-400 group-hover:text-red-600 transition-colors" />
                      <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-gray-500">Không có hãng</div>
                )}
              </div>
            </div>
            {/* Cột 3: Khoảng giá */}
            <div className="space-y-3">
              <h3 className="text-red-600 font-semibold text-sm">
                {modalData.category.name} theo khoảng giá
              </h3>
              <div className="space-y-1">
                {priceRanges.map((priceRange, index) => (
                  <div 
                    key={index}
                    className="group flex items-center justify-between py-1 px-2 rounded hover:bg-gray-50 cursor-pointer transition-all relative"
                    onClick={() => {
                      const parentId = modalData.category.id;
                      navigate(`/category/${parentId}?priceRanges=${priceRangeMap[priceRange]}`);
                      onClose(); // Đóng menu sau khi click
                    }}
                  >
                    <span className="text-sm text-gray-700">{priceRange}</span>
                    <FaChevronRight className="text-xs text-gray-400 group-hover:text-red-600 transition-colors" />
                    <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                  </div>
                ))}
              </div>
            </div>
            {/* Cột 4: Sản phẩm nổi bật (Tags) */}
            <div className="space-y-3">
              <h3 className="text-red-600 font-semibold text-sm">
                {modalData.category.name} nổi bật
              </h3>
              <div className="space-y-1">
                {modalData.tags.length > 0 ? (
                  modalData.tags.map((tag) => (
                    <div 
                      key={tag.id}
                      className="group flex items-center justify-between py-1 px-2 rounded hover:bg-gray-50 cursor-pointer transition-all relative"
                      onClick={() => {
                        const parentId = modalData.category.id;
                        navigate(`/category/${parentId}?tags=${tag.id}`);
                        onClose(); // Đóng menu sau khi click
                      }}
                    >
                      <span className="text-sm text-gray-700">{tag.name}</span>
                      <FaChevronRight className="text-xs text-gray-400 group-hover:text-red-600 transition-colors" />
                      <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-gray-500">Không có thẻ nổi bật</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SidebarCategoryMenu;