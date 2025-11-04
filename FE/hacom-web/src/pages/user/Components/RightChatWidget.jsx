import React from 'react';
import { FaFacebookMessenger, FaPhoneAlt } from 'react-icons/fa';
import messengerImg from '../../../assets/icon/mess-right.png';
import zaloImg from '../../../assets/icon/zalo-right.png';
import { SiZalo } from 'react-icons/si';

const RightChatWidget = () => {
  return (
    <div className="fixed right-2 top-1/3 transform -translate-y-1/2 z-50 md:block hidden">
      <div className="flex flex-col gap-2">
        <div className="flex items-center bg-white border border-gray-200 rounded-lg p-2 shadow-sm hover:text-red-500 transition cursor-pointer">
          <div className="bg-white rounded-full w-6 h-6 flex justify-center items-center mr-2">
              <img src={messengerImg} alt="Messenger" className="w-full h-full" />
          </div>
          <div>
            <p className="font-semibold text-xs">Messenger</p>
            <p className="text-xs text-gray-500">(8h-21h)</p>
          </div>
        </div>
        <div className="flex items-center bg-white border border-gray-200 rounded-lg p-2 shadow-sm hover:text-red-500 transition cursor-pointer">
          <div className="bg-white rounded-full w-6 h-6 flex justify-center items-center mr-2">
            <img src={zaloImg} alt="Zalo" className="w-full h-full" />
          </div>
          <div>
            <p className="font-semibold text-xs">Chat Zalo</p>
            <p className="text-xs text-gray-500">(8h-21h)</p>
          </div>
        </div>
        <div className="flex items-center bg-white border border-gray-200 rounded-lg p-2 shadow-sm hover:text-red-500 transition cursor-pointer">
          <div className="bg-white rounded-full w-8 h-8 flex justify-center items-center mr-2 border border-gray-300">
            <FaPhoneAlt size={16} className="text-red-500" />
          </div>
          <div>
            <p className="font-semibold text-xs">1900.1903</p>
            <p className="text-xs text-gray-500">(8h-21h)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightChatWidget;