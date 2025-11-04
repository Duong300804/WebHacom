import React from 'react';

const TrackOrderContent = () => {
  return (
    <div className="space-y-6 mb-8">
      {/* Giao hàng miễn phí */}
      <div className="text-center">
        <div className="bg-red-600 text-white font-semibold px-6 py-2 inline-block rounded-md mx-auto">Giao hàng miễn phí</div>
      </div>
      {/* Trường hợp chịu phí */}
      <div className="bg-white border border-gray-300 rounded-lg shadow-md p-6">
        <p className="text-gray-700">
          Những trường hợp khách hàng chịu phí vận chuyển: Chuyển phát nhanh, giao hàng COD (thanh toán tiền tại nơi nhận hàng), giao hàng đảm bảo, những hình thức giao hàng theo yêu cầu từ Khách hàng, những sản phẩm cồng kềnh như bàn ghế, màn chiếu.
        </p>
      </div>
      {/* Trách nhiệm với hàng hóa */}
      <div className="text-center">
        <div className="bg-red-600 text-white font-semibold px-6 py-2 inline-block rounded-md mx-auto">Trách nhiệm với hàng hóa</div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ô 1: Chính sách bảo hành */}
        <div className="bg-white border border-gray-300 rounded-lg shadow-md p-4">
          <p className="font-semibold text-red-600 mb-2">Chính Sách Bảo Hành</p>
          <p className="text-gray-700 text-sm">Các sản phẩm HACOM FASTER được áp dụng đầy đủ tất cả các chính sách bảo hành của HACOM như các hình thức mua hàng khác</p>
        </div>
        {/* Ô 2: Hình thức thanh toán */}
        <div className="bg-white border border-gray-300 rounded-lg shadow-md p-4">
          <p className="font-semibold text-red-600 mb-2">Hình Thức Thanh Toán</p>
          <p className="text-gray-700 text-sm">Các sản phẩm HACOM FASTER được áp dụng đầy đủ tất cả các hình thức thanh toán của HACOM ở hiện tại</p>
        </div>
      </div>
      {/* Ô 3: Full width */}
      <div className="bg-white border border-gray-300 rounded-lg shadow-md p-6">
        <ul className="text-sm text-gray-700 space-y-2 text-justify">
          <li className="flex"><span className="text-black mr-2 flex-shrink-0">•</span>Quý khách có trách nhiệm kiểm tra hàng hóa khi nhận hàng. Khi phát hiện hàng hóa bị hư hại, trầy xước, bể vỡ, móp méo, hoặc sai hàng hóa thì ký xác nhận tình trạng hàng hóa với nhân viên giao nhận và thông báo ngay cho bộ phận chăm sóc khách hàng: 1900 1903.</li>
          <li className="flex"><span className="text-black mr-2 flex-shrink-0">•</span>Sau khi Quý khách đã ký nhận hàng mà không ghi chú hoặc có ý kiến về hàng hóa. HACOM không có trách nhiệm với những yêu cầu đổi trả vì hư hỏng, trầy xước, bể vỡ, móp méo, sai hàng hóa,... từ Quý khách sau này.</li>
          <li className="flex"><span className="text-black mr-2 flex-shrink-0">•</span>Nếu dịch vụ vận chuyển do Quý khách chỉ định và lựa chọn thì Quý khách sẽ chịu trách nhiệm với hàng hóa và các rủi ro như mất mát hoặc hư hại của hàng hóa trong suốt quá trình vận chuyển hàng từ HACOM đến Quý khách. Khách hàng sẽ chịu trách nhiệm cước phí và tổn thất liên quan.</li>
          <li className="flex"><span className="text-black mr-2 flex-shrink-0">•</span>Để bảo vệ quyền lợi khi mua sắm trực tuyến, tránh các thủ đoạn lừa đảo không mong muốn HACOM khuyến cáo khách hàng:</li>
          <li className="flex"><span className="text-black mr-2 flex-shrink-0">•</span>Chỉ thanh toán mua hàng trên Website, các kênh online và cửa hàng chính thống của HACOM.</li>
          <li className="flex"><span className="text-black mr-2 flex-shrink-0">•</span>Khi thanh toán bằng hình thức chuyển khoản, chỉ thanh toán qua số tài khoản tên chính thức của HACOM</li>
        </ul>
      </div>
    </div>
  );
};

export default TrackOrderContent;