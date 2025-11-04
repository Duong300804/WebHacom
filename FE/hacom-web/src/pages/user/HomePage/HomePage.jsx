import Footer from "../Components/Footer";
import { useEffect } from 'react';
import Aos from 'aos';
import { Toaster } from 'react-hot-toast';
import FooterMenu from "../Components/FooterMenu";
import Policy from "../Components/Policy";
import Notice from "../Components/Notice";
import QuickAction from "../Components/QuickAction";
import Header from "../Components/Header/Header";
import HeroSlider from "./Section/HeroSlider/HeroSlider";
import FlashSale from "./Section/FlashSale/FlashSale";
import Customer from "./Section/Customer/Customer";
import TagProduct from "./Section/TagProduct/TagProduct";
import Product from "./Section/Product/Product";
import BottomLeftAd from "../Components/BottomLeftAd";
import RightChatWidget from "../Components/RightChatWidget";

export default function HomePage() {
  useEffect(function () {
    Aos.init({ duration: 1000 });
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="bg-white">
        <Toaster position="top-center" reverseOrder={false} />
        <Header/>
        <HeroSlider/>
        <Customer/>
        <FlashSale/>
        <TagProduct/>
        <Product/>
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