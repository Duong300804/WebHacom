import React from 'react';
import { FaUserCircle } from 'react-icons/fa';

const SidebarProfile = ({ username }) => {
  return (
    <div className="flex items-center p-4 border-b border-gray-700 gap-3">
      <FaUserCircle className="text-white text-3xl mr-3" />
      <div className="flex flex-col">
        <span className="text-white font-medium">{username}</span>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-green-400 text-sm">Online</span>
        </div>
      </div>
    </div>
  );
};

export default SidebarProfile;