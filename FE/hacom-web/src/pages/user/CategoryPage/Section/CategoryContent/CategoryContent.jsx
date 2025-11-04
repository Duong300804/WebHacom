import { useState } from 'react';
import { useRef } from "react";
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';
import laptopContentImg from '../../../../../assets/images/laptop_content.png'

export default function CategoryContent({ categoryId }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef(null);

  const toggleExpand = () => {
    if (isExpanded) {
      contentRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setIsExpanded(!isExpanded);
  };

  const contents = {
    11: {
      title: 'NHỮNG ĐIỀU CẦN LƯU Ý KHI CHỌN MUA LAPTOP',
      content: (
        <>
          <p>
            Để có thể sở hữu được một sản phẩm chất lượng và ưng ý nhất thì bạn cần xem xét các yếu tố như sau khi mua laptop:
          </p>
          <ul className="list-disc pl-6 mt-2">
            <li>
              <strong>Sản phẩm chính hãng:</strong> Tốt nhất là bạn nên lựa chọn những laptop có thương hiệu nổi tiếng. Điều này phần nào đã chứng minh được chất lượng của laptop. Những thương hiệu được nhiều người ưa chuộng trong thời gian dài thì chắc chắn là sản phẩm có các ưu điểm nổi bật, mang đến nhiều giá trị tối ưu cho người dùng khi sử dụng sản phẩm. Khi đã chọn các thương hiệu nổi tiếng thì hàng chính hãng cũng là điều bạn nên đặc biệt quan tâm bởi vì hàng giả, hàng nhái hiện nay trên thị trường có rất nhiều.
            </li>
            <li>
              <strong>Cấu hình sản phẩm:</strong> Đây là vấn đề mà bạn cần nghiên cứu trước, đặc biệt là đối với những người không có kiến thức chuyên môn trong lĩnh vực công nghệ. Nắm được một số đặc điểm cấu hình cơ bản của laptop không chỉ giúp bạn lựa chọn được laptop dễ dàng hơn mà bạn còn có thể biết được loại nào đáp ứng được các yêu cầu sử dụng của mình. Tùy vào mục đích để học tập, làm việc, chơi game hay giải trí đơn thuần mà sẽ có những dòng máy chuyên dụng mang đến cho bạn những trải nghiệm mượt mà hơn.
            </li>
            <li>
              <strong>Giá cả hợp lý:</strong> Tất nhiên giá cả luôn là vấn đề khiến nhiều người đắn đo suy nghĩ mỗi khi muốn mua một thứ gì đó và đối với laptop cũng vậy. Tìm được các cửa hàng có mức giá phù hợp thì sẽ giúp bạn tiết kiệm được chi phí hơn. Do đó, bạn có thể tham khảo tình hình giá cả chung trước rồi so sánh giá ở một vài nơi thì chắc chắn sẽ chọn được chỗ bán sản phẩm mà bạn muốn mua với mức giá tốt nhất.
            </li>
          </ul>
          {isExpanded && (
            <>
              <h3 className="text-xl font-bold mt-6">NÊN MUA LAPTOP Ở ĐÂU?</h3>
              <p className="mt-2">
                Trong cuộc sống hiện đại bây giờ, một chiếc laptop hay PC sẽ giúp ích cho chúng ta trong rất nhiều việc như học tập, giải trí, làm việc. Tuy nhiên trên thị trường lại có rất nhiều các thương hiệu laptop kèm theo rất nhiều kiểu dáng, cấu hình khiến bạn khó lựa chọn. Không chỉ vậy, ngay cả khi lựa chọn được mẫu ưng ý, việc mua laptop ở đâu uy tín cũng là câu hỏi mà nhiều bạn đang tự đặt ra!
              </p>
              <img
                src={laptopContentImg}
                alt="Laptop Content"
                className="my-4 w-full max-w-7xl rounded-md"
              />
              <p>
                Hà Nội là một trong những thành phố lớn nhất cả nước, đi kèm với đó là sự phát triển vô cùng mạnh mẽ. Sự phát triển đó kéo theo vô vàn các thương hiệu, cửa hàng, siêu thị điện máy phân phối laptop. Trong đó, <span className="text-red-600">HACOM</span> là một trong những doanh nghiệp hàng đầu tại Hà Nội về phân phối bán lẻ các sản phẩm công nghệ, linh kiện máy tính, laptop. Được thành lập từ 2001, với gần 20 năm phát triển và hoạt động trong lĩnh vực bán lẻ công nghệ, HACOM đã tạo dựng được danh tiếng của mình trên thị trường và trong lòng khách hàng! Đây cũng chính là địa chỉ mà bạn có thể chọn cho mình một chiếc laptop ưng ý với cấu hình tốt với chi phí phù hợp nhất!
              </p>
            </>
          )}
        </>
      ),
    },
    // Add more category content here, e.g., for PC (categoryId=12)
    12: {
      title: 'NHỮNG ĐIỀU CẦN LƯU Ý KHI CHỌN MUA PC',
      content: <p>Nội dung cho danh mục PC sẽ được thêm sau.</p>,
    },
  };

  const categoryContent = contents[categoryId] || {
    title: 'Nội dung danh mục',
    content: <p>Không có nội dung cho danh mục này.</p>,
  };

  return (
    <div ref={contentRef} className="py-8 text-justify">
      <h2 className="text-2xl font-bold text-gray-800 uppercase">{categoryContent.title}</h2>
      <div
        className={`relative mt-2 text-[17px] text-[#212a36] transition-all duration-300 ${
          isExpanded ? 'max-h-none' : 'max-h-[300px] overflow-hidden'
        }`}>
        {categoryContent.content}
        {!isExpanded && (
          <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
        )}
      </div>
      <button
        onClick={toggleExpand}
        className="mt-4 px-4 py-2 rounded-md border flex items-center gap-2 transition duration-300
                   bg-white text-blue-800 border-blue-700 hover:bg-red-700 hover:text-white hover:border-0 mx-auto">
        {isExpanded ? 'Thu gọn' : 'Xem thêm'}
        {isExpanded ? <FaArrowUp /> : <FaArrowDown />}
      </button>
    </div>
  );
}