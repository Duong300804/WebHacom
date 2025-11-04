import React, { useState, useEffect } from 'react';
import { getAllNews } from '../../../../../api/APIs/newsApi';

export default function ProductNews({ height }) {
  const [news, setNews] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await getAllNews();
        if (response.status === 200) {
          const normalizedNews = response.data
            .filter(item => item.deleteFlag === '0' && (item.active === true || item.active === 1))
            .slice(0, 5)
            .map(item => ({
              ...item,
              isActive: item.active === true || item.active === 1,
              isHighlight: item.highlight === true || item.highlight === 1,
            }));
          setNews(normalizedNews);
        }
      } catch (error) {
        console.error('Lỗi khi lấy danh sách tin tức:', error);
      }
    };
    fetchNews();
  }, []);

  return (
    <div className="py-4 px-4 mb-4 text-justify border border-gray-200 shadow-md rounded-lg ">
      <h2 className="text-xl font-bold text-gray-800">Tin tức mới nhất</h2>
      <div className="border-b border-gray-300 my-4"></div>
     <div className="relative overflow-y-auto sidebar-scrollbar" 
      style={{ height: height ? `${height - 70}px` : 'auto' }}>
        {news.length > 0 ? (
          news.map((newsItem, index) => (
            <div key={newsItem.id} className="mb-4 last:mb-0">
              {newsItem.thumbnailUrl && (
                <div className="mb-2">
                  <img
                    src={`${import.meta.env.VITE_IMAGE_BASE_URL}${newsItem.thumbnailUrl}`}
                    alt={newsItem.title}
                    className="w-full h-52 object-cover rounded-lg"
                  />
                </div>
              )}
              <h3 className="text-base font-semibold text-gray-800">{newsItem.title}</h3>
              <p className="text-sm text-[#212a36] mt-1">{newsItem.summary}</p>
              {index < news.length - 1 && <div className="border-b border-gray-300 my-4"></div>}
            </div>
          ))
        ) : (
          <p className="text-[17px] text-[#212a36] text-center">Không có tin tức</p>
        )}
      </div>
    </div>
  );
}