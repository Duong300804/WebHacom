import { useEffect, useState } from 'react';
import { FaFacebook, FaYoutube, FaTiktok, FaInstagram, FaArrowUp} from "react-icons/fa";

const QuickAction = () => {
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollToTop(true);
      } else {
        setShowScrollToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed hidden sm:hidden md:block bottom-2 right-2 z-50">
      <div className="flex flex-col gap-4 bg-black bg-opacity-10 p-2 rounded-3xl">
        <div className="bg-red-500 hover:bg-red-600 rounded-full w-10 h-10 flex justify-center items-center cursor-pointer">
          <FaYoutube size={24} className="text-white"/>
        </div>
        <div className="bg-red-500 hover:bg-red-600 rounded-full w-10 h-10 flex justify-center items-center cursor-pointer">
          <FaFacebook size={24} className="text-white"/>
        </div>
        <div className="bg-red-500 hover:bg-red-600 rounded-full w-10 h-10 flex justify-center items-center cursor-pointer">
          <FaTiktok size={24} className="text-white"/>
        </div>
        <div className="bg-red-500 hover:bg-red-600 rounded-full w-10 h-10 flex justify-center items-center cursor-pointer"> 
          <FaInstagram size={24} className="text-white"/>
        </div>
        {showScrollToTop && (
          <div
            className="bg-red-500 hover:bg-red-600 rounded-full w-10 h-10 flex justify-center items-center cursor-pointer"
            title="Scroll to top"
            onClick={scrollToTop}>
            <FaArrowUp size={24} className="text-white" />
          </div>
        )}
      </div>
    </div>
  );
};

export default QuickAction;
