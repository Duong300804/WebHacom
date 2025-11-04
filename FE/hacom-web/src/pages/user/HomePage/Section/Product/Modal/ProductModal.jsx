import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FaStar } from 'react-icons/fa';
import { useFloating, offset, flip, shift } from "@floating-ui/react";
import { RiListSettingsFill } from "react-icons/ri";
import { CiGift } from "react-icons/ci";
import './Modal.css';

export default function ProductModal({ product, isOpen, onClose, referenceEl }) {
  const { x, y, strategy, refs } = useFloating({
    placement: "right-start",
    middleware: [offset(10), flip(), shift()],
  });

  useEffect(() => {
    if (referenceEl?.current) {
      refs.setReference(referenceEl.current);
    }
  }, [referenceEl, refs]);

  if (!isOpen || !product) return null;

  const modalContent = (
    <div
      ref={refs.setFloating}
      style={{ position: strategy, top: y ?? 0, left: x ?? 0 }}
      className="bg-white rounded-lg shadow-lg w-96 z-50 animate-fadeIn"
      onMouseEnter={() => {}}
      onMouseLeave={onClose}
    >
      {/* Tên sản phẩm */}
      <div className="bg-[repeating-linear-gradient(to_right,#ed1b24_0,#243a76_50%,#ed1b24_100%)] bg-[length:200%_200%] rounded-t-lg p-2">
        <h2 className="text-white font-bold text-xs line-clamp-2">{product.name}</h2>
      </div>

      {/* Thông tin cơ bản */}
      <div className="px-3 py-1 space-y-2">
        <div className="grid grid-cols-3 text-sm">
          <span className="font-medium text-black">Giá bán</span>
          <span className="text-red-500 font-semibold">{product.discountPriceFormatted} VNĐ</span>
        </div>
        <div className="grid grid-cols-3 text-sm">
          <span className="font-medium text-black">Bảo hành</span>
          <span className="text-black">24 tháng</span>
        </div>
        <div className="grid grid-cols-3 text-sm">
          <span className="font-medium text-black">Kho hàng</span>
          <span className="text-black">Liên hệ HACOM</span>
        </div>
      </div>

      {/* Đường kẻ ngang */}
      <hr className="border-gray-300" />

      {/* Thông tin sản phẩm */}
      <div className="p-3 space-y-2">
        {/* Cấu hình sản phẩm */}
        <div className="inline-block bg-[linear-gradient(91.56deg,#f52194_2.74%,#fa9f2c_96.84%)] text-white px-2 py-1 rounded-md text-sm">
          <span className="flex items-center gap-1">
           <RiListSettingsFill />
            Cấu hình sản phẩm
          </span>
        </div>
        <div className="text-xs font-semibold text-gray-700">
          {product.configurations && product.configurations.length > 0 ? (
            product.configurations.map((config, index) => (
              <div key={index} className="flex items-start gap-2">
                <span>•</span>
                <span>{config.name}: {config.description}</span>
              </div>
            ))
          ) : (
            <span>Không có cấu hình</span>
          )}
        </div>

        {/* Chương trình khuyến mãi */}
        <div className="inline-block bg-[linear-gradient(91.56deg,#f52194_2.74%,#fa9f2c_96.84%)] text-white px-2 py-1 rounded-md text-sm mt-2">
          <span className="flex items-center gap-1">
            <CiGift />
            Chương trình khuyến mãi
          </span>
        </div>
        <div className="text-sm text-red-400 space-y-1">
          <div className="flex items-center gap-2">
            <FaStar className="text-yellow-400 w-4 h-4" />
            <span>Bảo hành tại nơi sử dụng</span>
          </div>
          <div className="flex items-center gap-2">
            <FaStar className="text-yellow-400 w-4 h-4" />
            <span>Bảo hành siêu tốc 1 đổi 1 trong 24h</span>
          </div>
          <div className="flex items-center gap-2">
            <FaStar className="text-yellow-400 w-4 h-4" />
            <span>Miễn phí 100% vận chuyển toàn quốc</span>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.getElementById('modal-root'));
}