import React, { useState, useRef, useEffect } from 'react';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';

export default function ProductContent({ product }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef(null);
  const innerContentRef = useRef(null);

  useEffect(() => {
    if (innerContentRef.current) {
      if (!isExpanded) {
        innerContentRef.current.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        innerContentRef.current.scrollTo({ top: innerContentRef.current.scrollHeight, behavior: "instant" });
        setTimeout(() => {
          innerContentRef.current.scrollTo({ top: 0, behavior: "smooth" });
        }, 100);
      }
    }
  }, [isExpanded]);

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev); 
  };

  return (
    <div ref={contentRef} className="py-4 px-4 mb-4 text-justify border border-gray-200 shadow-md rounded-lg">
      <h2 className="text-xl font-bold text-gray-800 text-left truncate w-full">
        Đánh giá: <span>{product.name}</span>
      </h2>
      <div className="border-b border-gray-300 my-4"></div>
      <div
        ref={innerContentRef}
        className={`relative mt-2 text-[17px] text-[#212a36] transition-all duration-300 max-h-[65vh] sidebar-scrollbar ${
          isExpanded ? 'overflow-y-auto' : 'overflow-hidden'
        }`}
      >
        {product.contents.map((content, index) => (
          <div key={index} className="mb-4">
            <h3 className="text-lg font-semibold">{content.title}</h3>
            <p className="mt-2 text-justify">{content.description}</p>
            {content.imageUrl && (
              <div className="mt-2">
                <img
                  src={`${import.meta.env.VITE_IMAGE_BASE_URL}${content.imageUrl}`}
                  alt={content.title}
                  className="w-full h-auto mx-auto rounded-lg"
                />
              </div>
            )}
          </div>
        ))}
        {!isExpanded && (
          <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
        )}
      </div>
      <button
        onClick={toggleExpand}
        className="mt-4 px-4 py-2 rounded-full border flex items-center gap-2 transition duration-300
                   bg-white text-blue-800 border-blue-700 hover:bg-red-700 hover:text-white hover:border-0 mx-auto"
      >
        {isExpanded ? 'Thu gọn' : 'Xem thêm'}
        {isExpanded ? <FaArrowUp /> : <FaArrowDown />}
      </button>
    </div>
  );
}