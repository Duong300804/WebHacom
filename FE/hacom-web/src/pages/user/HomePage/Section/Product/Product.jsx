import React from 'react';
import { useEffect } from 'react';
import Aos from 'aos';
import ProductList from './ProductList';


export default function Product() {
  useEffect(function () {
    Aos.init({ duration: 1000 });
  }, []);
  return (
    <div className="bg-white">
       <ProductList categoryId={11}/>
       <ProductList categoryId={12}/>
       <ProductList categoryId={13}/>
    </div>
  );
}