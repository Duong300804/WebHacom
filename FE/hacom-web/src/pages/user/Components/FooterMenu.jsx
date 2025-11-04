import React from "react";
import hacomLogoFooter from '../../../assets/logo/hacom-logo-footer.png'
import paymentMethod from "../../../assets/images/payment-method.png";
import fbLogo from "../../../assets/icon/facebook-footer.png";
import ytLogo from "../../../assets/icon/youtube-footer.png";
import instaLogo from "../../../assets/icon/insta-footer.png";
import tiktokLogo from "../../../assets/icon/tiktok-footer.png";
import newsLogo from "../../../assets/icon/news-footer.png";

const FooterMenu = () => {
  return (
    <div className="bg-white text-black py-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8">
        {/* Cột 1 */}
        <div className="space-y-1 text-sm">
          <img src={hacomLogoFooter} alt="Logo HACOM" className="h-15 w-auto object-contain" />
          <p className="font-semibold uppercase">Tổng đài</p>
          <p>Mua hàng: 19001903</p>
          <p>Khiếu nại: 19001903</p>
          <p className="font-semibold uppercase">Phương thức thanh toán</p>
          <img src={paymentMethod} alt="Phương thức thanh toán" className="mt-1 max-w-[160px] object-contain" />
        </div>

        {/* Cột 2 */}
        <div className="space-y-2 text-sm">
          <p className="font-semibold uppercase">Giới thiệu HACOM</p>
          <ul className="space-y-1">
            <li><a href="#" className="hover:text-red-500">Giới thiệu công ty</a></li>
            <li><a href="#" className="hover:text-red-500">Liên hệ hợp tác kinh doanh</a></li>
            <li><a href="#" className="hover:text-red-500">Thông tin tuyển dụng</a></li>
            <li><a href="#" className="hover:text-red-500">Tin công nghệ</a></li>
            <li><a href="#" className="hover:text-red-500">Tin tức</a></li>
            <li><a href="#" className="hover:text-red-500">HACOM - Cộng đồng</a></li>
          </ul>
        </div>

        {/* Cột 3 */}
        <div className="space-y-2 text-sm">
          <p className="font-semibold uppercase">Hỗ trợ khách hàng</p>
          <ul className="space-y-1">
            <li><a href="#" className="hover:text-red-500">Tra cứu đơn hàng</a></li>
            <li><a href="#" className="hover:text-red-500">Hướng dẫn mua hàng trực tuyến</a></li>
            <li><a href="#" className="hover:text-red-500">Hướng dẫn thanh toán</a></li>
            <li><a href="#" className="hover:text-red-500">Hướng dẫn mua hàng trả góp</a></li>
            <li><a href="#" className="hover:text-red-500">Bảng giá vật tư và dịch vụ sửa chữa lắp đặt</a></li>
            <li><a href="#" className="hover:text-red-500">In hóa đơn điện tử</a></li>
            <li><a href="#" className="hover:text-red-500">Góp ý, Khiếu Nại</a></li>
          </ul>
        </div>

        {/* Cột 4 */}
        <div className="space-y-2 text-sm">
          <p className="font-semibold uppercase">Chính sách chung</p>
          <ul className="space-y-1">
            <li><a href="#" className="hover:text-red-500">Chính sách, quy định chung</a></li>
            <li><a href="#" className="hover:text-red-500">Chính sách bảo hành</a></li>
            <li><a href="#" className="hover:text-red-500">Chính sách cho doanh nghiệp</a></li>
            <li><a href="#" className="hover:text-red-500">Chính sách hàng chính hãng</a></li>
            <li><a href="#" className="hover:text-red-500">Bảo mật thông tin khách hàng</a></li>
            <li><a href="#" className="hover:text-red-500">Chính sách nhập lại tính phí</a></li>
            <li><a href="#" className="hover:text-red-500">Chính sách giao hàng</a></li>
          </ul>
        </div>

        {/* Cột 5 */}
        <div className="space-y-3 text-sm">
          <p className="font-semibold uppercase">Thông tin khuyến mại</p>
          <ul className="space-y-1">
            <li><a href="#" className="hover:text-red-500">Thông tin khuyến mại</a></li>
            <li><a href="#" className="hover:text-red-500">Sản phẩm khuyến mại</a></li>
            <li><a href="#" className="hover:text-red-500">Sản phẩm mới</a></li>
          </ul>
          <p className="font-semibold uppercase mt-4">Kết nối với HACOM</p>
          <div className="flex flex-wrap gap-2 mt-2">
            <a href="#"><img src={ytLogo} alt="YouTube" className="h-8 w-8 rounded-full object-cover hover:scale-105 transition" /></a>
            <a href="#"><img src={fbLogo} alt="Facebook" className="h-8 w-8   rounded-full object-cover hover:scale-105 transition" /></a>
            <a href="#"><img src={instaLogo} alt="Instagram" className="h-8 w-8   rounded-full object-cover hover:scale-105 transition" /></a>
            <a href="#"><img src={tiktokLogo} alt="TikTok" className="h-8 w-8  rounded-full object-cover hover:scale-105 transition" /></a>
            <a href="#"><img src={newsLogo} alt="News" className="h-8 w-8   rounded-full object-cover hover:scale-105 transition" /></a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterMenu;
