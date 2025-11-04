import { useEffect } from 'react';
import Aos from 'aos';
import { Toaster } from 'react-hot-toast';
import Header from '../Components/Header/Header';
import Notice from '../Components/Notice';
import Policy from '../Components/Policy';
import FooterMenu from '../Components/FooterMenu';
import Footer from '../Components/Footer';
import QuickAction from '../Components/QuickAction';
import ProductDetailData from './Section/DetailData/ProductDetailData';
import BottomLeftAd from '../Components/BottomLeftAd';
import RightChatWidget from '../Components/RightChatWidget';

export default function ProductDetailPage() {
  useEffect(function () {
    Aos.init({ duration: 1000 });
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="bg-white">
      <Toaster position="top-center" reverseOrder={false} />
      <Header/>
      <ProductDetailData/>
      <Notice/>
      <Policy/>
      <FooterMenu/>
      <Footer/>
      <QuickAction/>
      <BottomLeftAd/>
      <RightChatWidget/>
    </div>
  );
}