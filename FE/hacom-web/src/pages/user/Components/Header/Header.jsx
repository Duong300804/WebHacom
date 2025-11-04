import { useEffect } from 'react';
import Aos from 'aos';
import UserMenu from './Section/UserMenu';
import MainMenu from './Section/MainMenu';

export default function Header (){
useEffect(function () {
    Aos.init({ duration: 1000 });
  }, []);
  return (
    <div className="bg-white">
        <UserMenu/>
        <MainMenu/>
    </div>
  );
}