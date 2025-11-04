import React from 'react';
import './Customer.css';

import customer1 from '../../../../../assets/images/customer_1.png';
import customer2 from '../../../../../assets/images/customer_2.png';
import customer3 from '../../../../../assets/images/customer_3.png';
import customer4 from '../../../../../assets/images/customer_4.png';
import customer5 from '../../../../../assets/images/customer_5.png';

export default function Customer() {
  return (
    <div className="max-w-7xl mx-auto py-4">
      <div className="flex flex-row gap-2">
        {/* Ô 1: Ảnh đầu tiên */}
        <div className="w-1/4 relative overflow-hidden rounded-lg bg-[repeating-linear-gradient(to_right,#ed1b24_0,#243a76_50%,#ed1b24_100%)] bg-[length:200%_200%] p-4 animate-gradient">
          <img
            src={customer1}
            alt="Khách Hàng 1"
            className="w-full h-auto object-cover relative z-10"
            loading="lazy"
          />
        </div>
        {/* Ô 2: 4 ảnh còn lại trên một dòng */}
        <div className="w-3/4 relative overflow-hidden rounded-lg bg-[repeating-linear-gradient(to_right,#ed1b24_0,#243a76_50%,#ed1b24_100%)] bg-[length:200%_200%] p-4 animate-gradient">
          <div className="flex flex-row gap-4 h-full">
            {[customer2, customer3, customer4, customer5].map((img, index) => (
              <div key={index} className="flex-1">
                <img
                  src={img}
                  alt={`Khách Hàng ${index + 2}`}
                  className="w-full h-auto  object-cover relative z-10 rounded-md"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}