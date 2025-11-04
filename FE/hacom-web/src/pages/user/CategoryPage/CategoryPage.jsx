import { useEffect, useState } from 'react';
import Aos from 'aos';
import Header from '../Components/Header/Header';
import Notice from '../Components/Notice';
import Policy from '../Components/Policy';
import FooterMenu from '../Components/FooterMenu';
import Footer from '../Components/Footer';
import QuickAction from '../Components/QuickAction';
import BottomLeftAd from '../Components/BottomLeftAd';
import CategoryData from './Section/CategoryData/CategoryData';
import RightChatWidget from '../Components/RightChatWidget';

export default function CategoryPage() {
  useEffect(function () {
    Aos.init({ duration: 1000 });
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-white">
      <Header/>
      <CategoryData/>
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