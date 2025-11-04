import React from 'react';

export default function ProductVideo({ product }) {
  return (
    <div className="py-4 px-4 mb-4 text-justify border border-gray-200 shadow-md rounded-lg">
      <h2 className="text-xl font-bold text-gray-800">Video sản phẩm</h2>
      <div className="border-b border-gray-300 my-4"></div>
      <div className="relative w-full">
        {product.videoUrl ? (
          <iframe
            className="w-full aspect-video rounded-lg"
            src={product.videoUrl.replace('watch?v=', 'embed/')+ '?rel=0'}
            title="Video sản phẩm"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        ) : (
          <p className="text-[17px] text-[#212a36] text-center">Không có video</p>
        )}
      </div>
    </div>
  );
}