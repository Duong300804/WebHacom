import { useEffect } from 'react';
import Aos from 'aos';
import Slider from './Slider';

export default function HeroSlider() {
  useEffect(function () {
    Aos.init({ duration: 1000 });
  }, []);
  return (
    <div className="bg-white">
        <Slider/>
    </div>
  );
}