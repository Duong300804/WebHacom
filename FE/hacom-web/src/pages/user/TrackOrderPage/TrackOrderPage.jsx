import { useEffect } from 'react';
import Aos from 'aos';
import { Toaster } from 'react-hot-toast';
import Header from '../Components/Header/Header';
import TrackOrderData from './Section/TrackOrderData';
import Notice from '../Components/Notice';
import Policy from '../Components/Policy';
import FooterMenu from '../Components/FooterMenu';
import Footer from '../Components/Footer';
import QuickAction from '../Components/QuickAction';
import BottomLeftAd from '../Components/BottomLeftAd';
import RightChatWidget from '../Components/RightChatWidget';

export default function TrackOrderPage() {
  useEffect(function () {
    Aos.init({ duration: 1000 });
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="bg-white">
      <Toaster position="top-center" reverseOrder={false} />
      <Header/>
      <TrackOrderData/>
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