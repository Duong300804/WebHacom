import { useParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { getProductById } from '../../../../../api/APIs/productApi';
import { getCategoryById } from '../../../../../api/APIs/categoryApi';
import ProductDetailBreadcrumb from '../Breadcrumb/ProductDetailBreadcrumb';
import ProductDetailTitle from '../Title/ProductDetailTitle';
import ProductImage from '../ProductImage/ProductImage.';
import ProductConfigurations from '../ProductConfig/ProductConfigurations';
import ProductActionButton from '../ActionButton/ProductActionButton';
import InformationBox from '../InfoBox/InformationBox';
import ProductContent from '../DetailContent/ProductContent';
import ProductSpecification from '../Specification/ProductSpecification';
import ProductVideo from '../ProductVideo/ProductVideo';
import ProductNews from '../ProductNews/ProductNews';
import HighlightList from '../List/HighlightList';
import ProductReview from '../ProductReview/ProductReview';
import RelatedProduct from '../RelatedProduct/RelatedProduct';

export default function ProductDetailData() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [category, setCategory] = useState({ id: '', name: '' });
  const [parentCategory, setParentCategory] = useState(null);
  const [leftSectionHeight, setLeftSectionHeight] = useState(0); 
  const leftSectionRef = useRef(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProductById(id);
        if (response.status === 200) {
          setProduct(response.data);
          if (response.data.categoryId) {
            const categoryRes = await getCategoryById(response.data.categoryId);
            if (categoryRes.status === 200) {
              setCategory({ id: response.data.categoryId, name: categoryRes.data.name });
              if (categoryRes.data.parentId) {
                const parentCategoryRes = await getCategoryById(categoryRes.data.parentId);
                if (parentCategoryRes.status === 200) {
                  setParentCategory({ id: categoryRes.data.parentId, name: parentCategoryRes.data.name });
                }
              }
            }
          }
        }
      } catch (error) {
        console.error('Lỗi khi lấy chi tiết sản phẩm:', error);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (leftSectionRef.current) {
      setLeftSectionHeight(leftSectionRef.current.offsetHeight);
    }
  }, [product]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);


  if (!product) return <div>Đang tải...</div>;

  return (
    <div className="bg-white max-w-7xl mx-auto px-4">
        <ProductDetailBreadcrumb
          parentCategory={parentCategory}
          categoryName={category}
          productName={product.name}
        />
        <ProductDetailTitle productName={product.name} />
        <div className="flex gap-8 mt-4">
        <div className="w-full md:w-1/3">
            <ProductImage product={product} />
        </div>
        <div className="w-full flex gap-6 md:w-2/3 mb-2">
            <div className="w-full md:w-3/5">
                <ProductConfigurations product={product} />
                <ProductActionButton product={product} />
            </div>
            <div className="w-full md:w-2/5">
                <InformationBox/>
            </div>
        </div>
      </div>
      <div className="flex gap-4 mt-2">
        <div className="w-full md:w-2/3">
          <ProductContent product={product} />
        </div>
        <div className="w-full md:w-1/3">
          <ProductSpecification product={product} />
        </div>
      </div>
      <div className="flex gap-4 mt-2 ">
        <div className="w-full md:w-2/3" ref={leftSectionRef}>
          <ProductVideo product={product} />
          <HighlightList/>
          <ProductReview/>
        </div>
        <div className="w-full md:w-1/3">
          <ProductNews height={leftSectionHeight}/>
        </div>
      </div>
      <RelatedProduct product={product} />
    </div>
  );
}

