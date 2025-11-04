import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FaUser, FaUserTie, FaListAlt, FaIndustry, FaTags, FaChartBar, FaLaptop, FaImage, FaNewspaper, FaChevronDown, FaUsers, FaRegIdCard } from 'react-icons/fa';
import { FaBoxArchive } from "react-icons/fa6";
import { Toaster, toast } from 'react-hot-toast';
import SidebarProfile from './SidebarProfile';

const Sidebar = ({ username }) => {
  const [isUserManagementOpen, setIsUserManagementOpen] = useState(false);
  const location = useLocation();
  const userRole = sessionStorage.getItem('role'); 

  useEffect(() => {
    const userManagementPaths = ['/admin/user', '/admin/staff', '/admin/customer'];
    if (userManagementPaths.includes(location.pathname)) {
      setIsUserManagementOpen(true);
    } else {
      setIsUserManagementOpen(false);
    }
  }, [location.pathname]);

  const toggleUserManagement = () => {
    setIsUserManagementOpen(!isUserManagementOpen);
  };

  const handleRestrictedAccess = (e, path) => {
    if (userRole !== 'ADMIN' && (path === '/admin/user' || path === '/admin/staff')) {
      e.preventDefault();
      toast.error('Bạn không có quyền truy cập!');
    }
  };

  return (
    <div className="fixed top-0 left-0 h-full w-64 bg-gray-900 text-white pt-16 border-r border-gray-300 overflow-y-auto sidebar-scrollbar">
      <Toaster position="top-center" reverseOrder={false} />
      <SidebarProfile username={username} />
      <ul className="list-none p-0">
        <li>
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              `flex items-center p-4 hover:bg-gray-700 transition-all ${isActive ? 'bg-gray-700' : ''}`
            }
          >
            <FaChartBar className="mr-4 text-lg" />
            <span>Thống kê</span>
          </NavLink>
        </li>
        <li>
          <div
            onClick={toggleUserManagement}
            className="flex items-center p-4 hover:bg-gray-700 transition-all cursor-pointer"
          >
            <FaUsers className="mr-4 text-lg" />
            <span>Người dùng</span>
            <FaChevronDown
              className={`ml-auto transform transition-transform duration-300 ${isUserManagementOpen ? 'rotate-180' : ''}`}
            />
          </div>
          {isUserManagementOpen && (
            <ul className="list-none pl-8">
              <li>
                <NavLink
                  to="/admin/user"
                  onClick={(e) => handleRestrictedAccess(e, '/admin/user')}
                  className={({ isActive }) =>
                    `flex items-center p-4 hover:bg-gray-600 transition-all ${isActive ? 'bg-gray-600' : ''}`
                  }
                >
                  <FaUser className="mr-4 text-lg" />
                  <span>Tài khoản</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin/customer"
                  className={({ isActive }) =>
                    `flex items-center p-4 hover:bg-gray-600 transition-all ${isActive ? 'bg-gray-600' : ''}`
                  }
                >
                  <FaUserTie className="mr-4 text-lg" />
                  <span>Khách hàng</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin/staff"
                  onClick={(e) => handleRestrictedAccess(e, '/admin/staff')}
                  className={({ isActive }) =>
                    `flex items-center p-4 hover:bg-gray-600 transition-all ${isActive ? 'bg-gray-600' : ''}`
                  }
                >
                  <FaRegIdCard className="mr-4 text-lg" />
                  <span>Nhân viên</span>
                </NavLink>
              </li>
            </ul>
          )}
        </li>
        <li>
          <NavLink
            to="/admin/category"
            className={({ isActive }) =>
              `flex items-center p-4 hover:bg-gray-700 transition-all ${isActive ? 'bg-gray-700' : ''}`
            }
          >
            <FaListAlt className="mr-4 text-lg" />
            <span>Danh mục</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/brand"
            className={({ isActive }) =>
              `flex items-center p-4 hover:bg-gray-700 transition-all ${isActive ? 'bg-gray-700' : ''}`
            }
          >
            <FaIndustry className="mr-4 text-lg" />
            <span>Hãng</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/tag"
            className={({ isActive }) =>
              `flex items-center p-4 hover:bg-gray-700 transition-all ${isActive ? 'bg-gray-700' : ''}`
            }
          >
            <FaTags className="mr-4 text-lg" />
            <span>Thẻ</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/product"
            className={({ isActive }) =>
              `flex items-center p-4 hover:bg-gray-700 transition-all ${isActive ? 'bg-gray-700' : ''}`
            }
          >
            <FaLaptop className="mr-4 text-lg" />
            <span>Sản phẩm</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/order"
            className={({ isActive }) =>
              `flex items-center p-4 hover:bg-gray-700 transition-all ${isActive ? 'bg-gray-700' : ''}`
            }
          >
            <FaBoxArchive className="mr-4 text-lg" />
            <span>Đơn hàng</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/banner"
            className={({ isActive }) =>
              `flex items-center p-4 hover:bg-gray-700 transition-all ${isActive ? 'bg-gray-700' : ''}`
            }
          >
            <FaImage className="mr-4 text-lg" />
            <span>Banner</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/news"
            className={({ isActive }) =>
              `flex items-center p-4 hover:bg-gray-700 transition-all ${isActive ? 'bg-gray-700' : ''}`
            }
          >
            <FaNewspaper className="mr-4 text-lg" />
            <span>Tin tức</span>
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;