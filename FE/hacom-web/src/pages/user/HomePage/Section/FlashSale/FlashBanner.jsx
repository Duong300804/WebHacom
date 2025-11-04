import React from "react";
import flashImg from '../../../../../assets/images/flash_sale_hacom.png' 

const FlashBanner = () => {
    return(
        <div className="max-w-6xl mx-auto px-4 py-2 justify-center">
            <img src={flashImg} 
                 alt="Flash Sale hacom"
                 className="w-4/5 mx-auto h-auto object-cover rounded-lg"/>
        </div>
    );
}

export default FlashBanner;