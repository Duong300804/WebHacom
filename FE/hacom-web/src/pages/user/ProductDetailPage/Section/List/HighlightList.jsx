import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllNews } from '../../../../../api/APIs/newsApi';

export default function HighlightList() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    const fetchHighlightNews = async () => {
      try {
        const response = await getAllNews();
        if (response.status === 200) {
          const normalizedNews = response.data
            .filter(item => item.deleteFlag === '0' && 
                           (item.active === true || item.active === 1) && 
                           (item.highlight === true || item.highlight === 1))
            .slice(0, 6)
            .map(item => ({
              ...item,
              isActive: item.active === true || item.active === 1,
              isHighlight: item.highlight === true || item.highlight === 1,
            }));
          setNews(normalizedNews);
        }
      } catch (error) {
        console.error('Lỗi khi lấy danh sách tin tức nổi bật:', error);
      }
    };
    fetchHighlightNews();
  }, []);

  return (
    <div className="py-4 px-4 mb-4 text-justify border border-gray-200 shadow-md rounded-lg bg-gray-50 ">
      <h2 className="text-xl font-bold text-gray-800">Chuyên mục nổi bật</h2>
      <div className="border-b border-gray-300 my-4"></div>
      <div className="relative overflow-y-auto">
        {news.length > 0 ? (
          <ul className="list-disc list-outside pl-5">
            {news.map((newsItem) => (
              <li key={newsItem.id} className="mb-2">
                <Link
                //   to={`/admin/news/detail/${newsItem.id}`}
                  className="text-blue-500 hover:text-blue-700 hover:underline text-base"
                >
                  {newsItem.title}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-[17px] text-[#212a36] text-center mt-32">Không có tin tức nổi bật</p>
        )}
      </div>
    </div>
  );
}