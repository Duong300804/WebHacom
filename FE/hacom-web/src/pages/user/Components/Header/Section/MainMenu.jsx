import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { getUnreadNotifications } from '../../../../../api/APIs/notificationApi';
import { FaSearch, FaBell, FaShoppingCart, FaBars, FaTruck } from 'react-icons/fa'; 
import hacomLogo from '../../../../../assets/logo/hacom-logo-footer.png'; 
import ytLogo from "../../../../../assets/icon/youtube-footer.png"; 
import fbLogo from "../../../../../assets/icon/facebook-footer.png";
import instaLogo from "../../../../../assets/icon/insta-footer.png";
import tiktokLogo from "../../../../../assets/icon/tiktok-footer.png";
import newsLogo from "../../../../../assets/icon/news-footer.png";
import CategoryMenu from '../../CategoryMenu';

const MainMenu = () => {
  const [isScrolled, setIsScrolled] = useState(false); 
  const [searchValue, setSearchValue] = useState(''); 
  const [notificationCount, setNotificationCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(!!sessionStorage.getItem('username'));
  const [cartCount, setCartCount] = useState(0); 
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuTimeout, setMenuTimeout] = useState(null); 
  const navigate = useNavigate();

  const getCartKey = () => {
    const user = sessionStorage.getItem('username');
    return user ? `cart_${user}` : 'cart_guest';
  };

  useEffect(() => {
    const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem(getCartKey()) || '[]');
    setCartCount(cart.length);
    };
    updateCartCount(); 
    window.addEventListener('cartUpdated', updateCartCount);
    window.addEventListener('userChanged', updateCartCount); 
    return () => {
      window.removeEventListener('cartUpdated', updateCartCount);
      window.removeEventListener('userChanged', updateCartCount);
    };
  }, []);

  useEffect(() => {
    const updateNotifications = async () => {
      const username = sessionStorage.getItem('username');
      if (username) {
        try {
          const unreadRes = await getUnreadNotifications();
          setNotificationCount(Math.max(0, unreadRes.data.length || 0));
        } catch (error) {
          console.error('Error fetching notifications:', error);
        }
      } else {
        setNotificationCount(0); 
      }
    };
    updateNotifications(); 
    const intervalId = setInterval(updateNotifications, 5000);
    const handleUserChanged = () => {
      setIsLoggedIn(!!sessionStorage.getItem('username'));
      updateNotifications();
    };
    window.addEventListener('userChanged', handleUserChanged);
    return () => {
      window.removeEventListener('userChanged', handleUserChanged);
      clearInterval(intervalId); 
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 800) { 
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/search?keyword=${encodeURIComponent(searchValue)}`);
    }
  };

  // Hàm để mở menu
  const handleMouseEnter = () => {
    if (menuTimeout) {
      clearTimeout(menuTimeout); // Hủy timeout nếu đang có
    }
    setIsMenuOpen(true);
  };

  // Hàm để đóng menu với độ trễ
  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setIsMenuOpen(false);
    }, 300); // Độ trễ 300ms
    setMenuTimeout(timeout);
  };

  const renderMenuContent = () =>(
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-4">
        {/* Phần bên trái: Danh mục (chỉ khi scrolled) + Logo */}
        <div className="flex items-center gap-4">
          {isScrolled && (
            <div className="relative">
              <button 
                onMouseEnter={handleMouseEnter} 
                onMouseLeave={handleMouseLeave} 
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition text-sm"
              >
                <FaBars className="text-lg" />
                <span>Danh mục</span>
              </button>
              {isMenuOpen && (
                <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                  <CategoryMenu onClose={() => setIsMenuOpen(false)} /> 
                </div>
              )}
            </div>
          )}
          <Link to="/">
            <img 
              src={hacomLogo} 
              alt="Logo HACOM" 
              className={`h-10 w-auto object-contain transition-all duration-300 ${isScrolled ? 'ml-0' : ''}`} 
            />
          </Link>
        </div>
        {/* Ô tìm kiếm */}
        <form onSubmit={handleSearchSubmit} className="flex-grow max-w-xl flex">
          <input
            type="text"
            placeholder="Nhập tên sản phẩm, từ khóa cần tìm"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="px-4 py-2 bg-white text-black text-sm border border-red-500 rounded-l-full focus:outline-none w-full"
          />
          <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded-r-full font-semibold flex items-center justify-center">
            <FaSearch className="text-lg" />
          </button>
        </form>

        {/* Các icon mạng xã hội */}
        <div className="flex items-center gap-2">
          <a href="#"><img src={ytLogo} alt="YouTube" className="h-8 w-8 rounded-full object-cover hover:scale-105 transition" /></a>
          <a href="#"><img src={fbLogo} alt="Facebook" className="h-8 w-8 rounded-full object-cover hover:scale-105 transition" /></a>
          <a href="#"><img src={instaLogo} alt="Instagram" className="h-8 w-8 rounded-full object-cover hover:scale-105 transition" /></a>
          <a href="#"><img src={tiktokLogo} alt="TikTok" className="h-8 w-8 rounded-full object-cover hover:scale-105 transition" /></a>
          <a href="#"><img src={newsLogo} alt="News" className="h-8 w-8 rounded-full object-cover hover:scale-105 transition" /></a>
        </div>

        {/* Tra cứu đơn hàng */}
        <div className="flex items-center gap-2 cursor-pointer hover:scale-105 transition" 
            onClick={() => navigate('/track-order')}
        >
          <div className="bg-white rounded-full border border-gray-300 p-2 shadow-lg hover:scale-105 transition">
            <FaTruck className="text-red-600 text-2xl" /> 
          </div>
          <div className="text-sm leading-tight hover:text-[#243a76] transition-colors">
            <span>Tra cứu</span><br />
            <span>đơn hàng</span>
          </div>
        </div>

        {/* Thông báo (bỏ khi scrolled) */}
        {!isScrolled && (
          <div 
            className="relative flex items-center gap-2 cursor-pointer hover:scale-105 transition"
            onClick={() => {
              if (!isLoggedIn) {
                toast.error('Vui lòng đăng nhập để xem thông báo');
              } else {
                navigate('/account', { state: { activeTab: 'notices' } });
              }
            }}
          >
            <div className="relative">
              <FaBell className="text-2xl text-[#243a76]" />
              {isLoggedIn && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[8px] font-bold rounded-full px-1.5 py-0.5">
                {notificationCount}
              </span>
            )}
            </div>
            <span className="text-sm hover:text-[#243a76] transition-colors">Thông báo</span>
          </div>
        )}

       {/* Giỏ hàng */}
        <div 
          className="flex items-center gap-2 cursor-pointer hover:scale-105 transition" 
          onClick={() => navigate('/cart')}
        >
          <div className="relative">
            <FaShoppingCart className="text-2xl text-[#243a76]" />
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[8px] font-bold rounded-full px-1.5 py-0.5">
              {cartCount}
            </span>
          </div>
          <span className="text-sm hover:text-[#243a76] transition-colors">Giỏ hàng</span>
        </div>
      </div>
  );

  return (
    <div className="relative">
      {/* MainMenu bình thường */}
      <div className={`bg-white py-4 shadow-md transition-opacity duration-300 ${isScrolled ? 'opacity-0' : 'opacity-100'}`}>
        {renderMenuContent()}
      </div>
      {/* MainMenu khi scroll */}
      <div className={`bg-white py-4 shadow-md fixed top-0 left-0 w-full z-50 transform transition-transform duration-300 ${isScrolled ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
        {renderMenuContent()}
      </div>
    </div>
  );
};

export default MainMenu;