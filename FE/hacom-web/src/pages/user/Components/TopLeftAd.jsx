import React from 'react';
import topLeftAdImg from '../../../assets/images/top-left-ad.png';
import topLeftAdHacomImg from '../../../assets/images/top-left-ad-hacom.png'

const TopLeftAd = () => {
    return (
        <div className="fixed top-1/4 left-4 z-50">
            <div className='relative'>
                <img src={topLeftAdHacomImg} 
                     alt="Quảng cáo" 
                     className='w-24 h-auto object-contain boder border-gray-100 shadow-lg'/>
            </div>
        </div>
    );
}

export default TopLeftAd;