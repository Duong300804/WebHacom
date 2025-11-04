import { useEffect, useState } from 'react';
import Aos from 'aos';
import { useSearchParams } from 'react-router-dom';
import SearchBreadcrumb from "./Section/SearchBreadcrumb";
import SearchTitle from "./Section/SearchTitle";
import SearchProductList from "./Section/SearchProductList";
import Header from '../Components/Header/Header';
import Notice from '../Components/Notice';
import Policy from '../Components/Policy';
import FooterMenu from '../Components/FooterMenu';
import Footer from '../Components/Footer';
import QuickAction from '../Components/QuickAction';
import BottomLeftAd from '../Components/BottomLeftAd';
import RightChatWidget from '../Components/RightChatWidget';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('keyword') || '';

  useEffect(function () {
    Aos.init({ duration: 1000 });
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-white">
      <Header/>
      <div className="max-w-7xl mx-auto px-4">
        <SearchBreadcrumb keyword={keyword} />
        <SearchTitle keyword={keyword} />
        <SearchProductList keyword={keyword} />
      </div>
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
