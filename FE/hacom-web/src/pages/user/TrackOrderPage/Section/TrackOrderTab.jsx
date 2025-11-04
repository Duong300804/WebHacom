import React from 'react';
import { FaSearch } from 'react-icons/fa';
import trackOrderMainImg from '../../../../assets/images/track-order-main.png'; 
import shippingPolicyImg from '../../../../assets/images/shipping-policy.png'; 

const TrackOrderTab = ({ currentTab, setCurrentTab, phone, setPhone, orderId, setOrderId, onSearch }) => {
  const tabs = [
    { title: 'Tra cứu đơn hàng' },
    { title: 'Chính sách giao hàng' },
    { title: 'Quy trình giao hàng' },
    { title: 'Cách thức tra cứu' },
  ];

  const renderTabContent = () => {
    switch (currentTab) {
      case 0: // Tab 1: Tra cứu đơn hàng
        return (
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold text-blue-900 mb-8">Tra Cứu Đơn Hàng</h2>
            <div className="space-y-4 max-w-md mx-auto">
              <div>
                <label className="block text-left text-lg font-medium text-gray-700 mb-1">Nhập số điện thoại của bạn:</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ví dụ: 0123456789"
                />
              </div>
              <div>
                <label className="block text-left text-lg font-medium text-gray-700 mb-1">Nhập mã hóa đơn của bạn:</label>
                <input
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ví dụ: DH123456"
                />
              </div>
              <button
                onClick={onSearch}
                className="flex items-center justify-center gap-2 bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 transition font-medium w-full"
              >
                <FaSearch />
                Tra Cứu
              </button>
            </div>
          </div>
        );
      case 1: // Tab 2: Chính sách giao hàng
        return (
          <div className="py-8">
            {/* Ảnh riêng cho tab 2 (thay path nếu cần) */}
            <img src={shippingPolicyImg} alt="Chính sách giao hàng" className="w-96 h-auto mb-6 rounded-lg mx-auto" />
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-red-600 text-white font-semibold py-2 rounded-md mb-2">Miễn phí vận chuyển</div>
                <p className="text-sm">Không giới hạn giá trị đơn hàng</p>
                <p className="text-sm">Không giới hạn địa điểm nhận hàng.</p>
              </div>
              <div className="text-center">
                <div className="bg-red-600 text-white font-semibold py-2 rounded-md mb-2">Nhanh chóng</div>
                <p className="text-sm">Giao hàng nhanh chóng, đúng hẹn.</p>
              </div>
              <div className="text-center">
                <div className="bg-red-600 text-white font-semibold py-2 rounded-md mb-2">Khuyến mại giảm giá</div>
                <p className="text-sm">Hưởng đầy đủ chương trình khuyến mại, giảm giá của sản phẩm.</p>
              </div>
            </div>
          </div>
        );
      case 2: // Tab 3: Quy trình giao hàng
        return (
          <div className="py-8 space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">1</div>
              <div>
                <p className="font-semibold text-red-600">Chờ thực hiện</p>
                <p>HACOM đang thực hiện lên đơn cho khách hàng.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">2</div>
              <div>
                <p className="font-semibold text-red-600">Kho xuất hàng</p>
                <p>Kho tiếp nhận đơn hàng <span className="text-red-600">&rarr;</span> Kiểm tra chất lượng và số lượng sản phẩm trên đơn hàng <span className="text-red-600">&rarr;</span> Bàn giao hàng hoá cho nhân viên kỹ thuật.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">3</div>
              <div>
                <p className="font-semibold text-red-600">Lắp ráp, cài đặt</p>
                <p>Kỹ thuật nhận đơn hàng <span className="text-red-600">&rarr;</span> Thực hiện lắp đặt sản phẩm cho khách hàng <span className="text-red-600">&rarr;</span> Bàn giao cho nhân viên giao vận.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">4</div>
              <div>
                <p className="font-semibold text-red-600">Đơn hàng đang giao</p>
                <p>Nhân viên giao vận thực hiện giao hàng cho khách hàng.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">5</div>
              <div>
                <p className="font-semibold text-red-600">Đã giao hàng thành công</p>
                <p>Nhân viên giao vận bàn giao sản phẩm tận nơi <span className="text-red-600">&rarr;</span> Khách hàng ký tên xác nhận nhận đơn thành công.</p>
              </div>
            </div>
          </div>
        );
      case 3: // Tab 4: Cách thức tra cứu
        return (
          <div className="py-8 space-y-6">
            <div>
              <p className="font-semibold text-red-600 mb-2">Khách hàng tự tra cứu thông tin</p>
              <p>Sau khi HACOM lên đơn hàng, khách hàng sẽ được cung cấp mã đơn hàng. Khách hàng nhập thông tin tra cứu theo form trong tab Tra cứu đơn hàng.</p>
            </div>
            <div>
              <p className="font-semibold text-red-600 mb-2">Gọi điện qua Hotline</p>
              <p>Tổng đài chăm sóc khách hàng: <strong>1900 1903</strong>.</p>
              <p><strong>Thời gian làm việc:</strong></p>
              <ul className="list-disc pl-5">
                <li><strong>Các ngày thứ 2,3,4,6,7</strong> - Thời gian làm việc từ: <strong>08:00 - 17:30</strong></li>
                <li><strong>Các ngày thứ 5 & Chủ nhật</strong> - Thời gian làm việc từ: <strong>08:30 - 17:30</strong></li>
              </ul>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="mb-8">
      <img src={trackOrderMainImg} alt="Track Order Main" className="w-full h-auto rounded-lg" />
      
      {/* Tabs buttons*/}
      <div className="bg-white rounded-lg p-1 flex justify-around shadow-sm border-b-2 border-gray-300">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setCurrentTab(index)}
            className={`px-8 py-6 rounded-md transition text-lg font-medium flex-1 ${
              currentTab === index
                ? 'text-red-600'
                : 'text-black hover:text-red-600'
            }`}
          >
            {tab.title}
          </button>
        ))}
      </div>
      
      {/* Nội dung tabs - độc lập hoàn toàn */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default TrackOrderTab;