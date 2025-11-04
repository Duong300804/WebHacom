import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Aos from 'aos';
import { countProductsByFilter, filterProducts } from '../../../../../api/APIs/productApi';
import { getAllCategories } from '../../../../../api/APIs/categoryApi';
import { getAllBrands } from '../../../../../api/APIs/brandApi';
import { getAllTags } from '../../../../../api/APIs/tagApi';
import Breadcrumb from '../Breadcrumb/Breadcrumb';
import CategoryTitle from '../Title/CategoryTitle';
import CategoryContent from '../CategoryContent/CategoryContent';
import CategoryFooter from '../Footer/CategoryFooter';
import ProductFilter from '../FilterBar/ProductFilter';
import CategorySlider from '../Slider/CategorySlider';
import ProductList from '../Product/ProductList';

export default function CategoryData() {
  const { categoryId } = useParams();
  const location = useLocation();
  const [categoryName, setCategoryName] = useState('Danh mục');
  const [productCount, setProductCount] = useState(0);
  const [allProducts, setAllProducts] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [tags, setTags] = useState([]);
  const [filter, setFilter] = useState({
    subCategories: [],
    brands: [],
    priceRanges: [],
    tags: [],
  });
  const [sortOption, setSortOption] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  const reversePriceRangeMap = {
    'duoi10trieu': 'Dưới 10 triệu',
    '10trieu-15trieu': 'Từ 10 triệu - 15 triệu',
    '15trieu-20trieu': 'Từ 15 triệu - 20 triệu',
    '20trieu-30trieu': 'Từ 20 triệu - 30 triệu',
    '30trieu-40trieu': 'Từ 30 triệu - 40 triệu',
    '40trieu-50trieu': 'Từ 40 triệu - 50 triệu',
    'tren50trieu': 'Trên 50 triệu',
  };

  useEffect(() => {
    Aos.init({ duration: 1000 });

    const fetchData = async () => {
      try {
        // Lấy tất cả danh mục
        const catResponse = await getAllCategories();
        if (catResponse.status === 200) {
          const allCats = catResponse.data;
          const category = allCats.find((cat) => cat.id === parseInt(categoryId));
          if (category) {
            setCategoryName(category.name);
          }
          const subs = allCats.filter(cat => cat.parentId === parseInt(categoryId));
          setSubCategories(subs);
        }

        // Lấy hãng
        const brandResponse = await getAllBrands();
        if (brandResponse.status === 200) {
          setBrands(brandResponse.data);
        }

        // Lấy tag
        const tagResponse = await getAllTags();
        if (tagResponse.status === 200) {
          setTags(tagResponse.data);
        }

        // Lấy số lượng sản phẩm
        const filterRequest = {
          categoryId: parseInt(categoryId),
          includeSubCategories: true,
          inStock: 1,
        };
        const countResponse = await countProductsByFilter(filterRequest);
        if (countResponse.status === 200) {
          setProductCount(countResponse.data);
        }

        // Lấy tất cả sản phẩm 
        const productsResponse = await filterProducts(filterRequest);
        if (productsResponse.status === 200) {
          setAllProducts(productsResponse.data);
        }
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
      }
    };

    fetchData();

// Cập nhật filter từ query parameters
    const searchParams = new URLSearchParams(location.search);
    const newFilter = {
      subCategories: searchParams.get('subCategories') 
        ? searchParams.get('subCategories').split(',').map(id => parseInt(id)) 
        : [],
      brands: searchParams.get('brands') 
        ? searchParams.get('brands').split(',').map(id => parseInt(id)) 
        : [],
      priceRanges: searchParams.get('priceRanges') 
        ? searchParams.get('priceRanges').split(',').map(short => reversePriceRangeMap[short] || short) 
        : [],
      tags: searchParams.get('tags') 
        ? searchParams.get('tags').split(',').map(id => parseInt(id)) 
        : [],
    };
    setFilter(newFilter);
    setCurrentPage(1);
  }, [categoryId, location.search]);

  return (
    <div className="bg-white max-w-7xl mx-auto px-4 ">
      <Breadcrumb categoryName={categoryName} />
      <CategoryTitle categoryName={categoryName} productCount={productCount} />
      <div className="flex gap-6 mt-8">
        <div className="w-1/4 hidden md:block">
          <ProductFilter 
            subCategories={subCategories}
            brands={brands}
            tags={tags}
            allProducts={allProducts}
            filter={filter}
            setFilter={setFilter}
          />
        </div>
        <div className="w-full md:w-3/4 ">
          <CategorySlider />
          <ProductList 
            allProducts={allProducts}
            sortOption={sortOption}
            setSortOption={setSortOption}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            productsPerPage={productsPerPage}
            filter={filter}
          />
        </div>
      </div>
      <CategoryContent categoryId={categoryId} />
      <CategoryFooter />
    </div>
  );
}