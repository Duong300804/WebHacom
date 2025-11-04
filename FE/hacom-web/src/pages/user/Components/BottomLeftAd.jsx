import React, { useState, useEffect } from 'react';
import adImage from '../../../assets/images/ad-bottom.png';
import { FaTimes } from "react-icons/fa";

const BottomLeftAd = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const adElement = document.getElementById('bottom-left-ad');
    let position = 0;
    let direction = 1;
    const bounceInterval = setInterval(() => {
      if (adElement) {
        position += direction * 0.5;
        if (position >= 10 || position <= -10) direction *= -1;
        adElement.style.transform = `translateY(${position}px)`;
      }
    }, 50);

    return () => clearInterval(bounceInterval);
  }, []);

  if (!isVisible) return null;

  return (
    <div
      id="bottom-left-ad"
      className="fixed bottom-4 left-4 z-50 transition-transform duration-300"
    >
      <div className="relative">
        <img
          src={adImage}
          alt="Quảng cáo"
          className="w-40 h-auto object-contain"
        />
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-0 right-0 bg-gray-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-gray-600 transition-colors"
        >
          <FaTimes className='text-sm'/>
        </button>
      </div>
    </div>
  );
};

export default BottomLeftAd;