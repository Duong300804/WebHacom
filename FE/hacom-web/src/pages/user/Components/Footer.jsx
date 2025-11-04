import React from "react";
import dmca from "../../../assets/images/dmca-protected.png";
import boCongThuong from "../../../assets/images/bo-cong-thuong.png";

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-black py-6">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center md:items-start gap-6">
        {/* Khối trái */}
        <div className="text-sm leading-relaxed text-center md:text-left">
          <p>© 2024 Công ty Cổ phần Đầu tư Công nghệ HACOM</p>
          <p>Trụ sở chính: Số 129 + 131, phố Lê Thanh Nghị, Phường Bạch Mai, Hà Nội</p>
          <p>VPGD: Tầng 3 Tòa nhà LILAMA, Số 124 Minh Khai, Phường Tương Mai, Hà Nội</p>
          <p>GPĐKKD số 0101161194 do Sở KHĐT Tp Hà Nội cấp ngày 31/8/2001</p>
          <p>Email: info@hacom.vn – Điện thoại: 1900 1903</p>
        </div>
        {/* Khối phải – ảnh chứng nhận */}
        <div className="flex space-x-4">
          <img src={dmca} alt="DMCA Protected" className="h-12 md:h-16 object-contain" />
          <img src={boCongThuong} alt="Đã thông báo Bộ Công Thương" className="h-12 md:h-16 object-contain" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
