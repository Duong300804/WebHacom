import { useEffect } from 'react';
import Aos from 'aos';
import FlashBanner from './FlashBanner';
import SaleProduct from './SaleProduct';

export default function FlashSale() {
  useEffect(function () {
    Aos.init({ duration: 1000 });
  }, []);
  return (
    <div className="bg-white">
        <FlashBanner/>
        <SaleProduct/>
    </div>
  );
}