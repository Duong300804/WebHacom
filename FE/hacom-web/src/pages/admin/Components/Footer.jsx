import React from 'react';

const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 sm:left-64 w-full sm:w-[calc(100%-16rem)] bg-white shadow-md z-50 h-12 flex items-center justify-between px-4">
      <div className="text-gray-500 text-sm">
       Copyright © {new Date().getFullYear()} HaCom-HaNoiComputer . All rights reserved.
      </div>
      <div className="text-gray-500 text-sm">
        Version 1.0.0
      </div>
    </footer>
  );
};

export default Footer;