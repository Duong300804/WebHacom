import { FaHome } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function ProductDetailBreadcrumb({ parentCategory, categoryName, productName }) {
  return (
    <div className="pt-6 pb-2 text-lg font-semibold">
      <div className="flex items-center space-x-2">
        <Link to="/" className="flex items-center text-blue-800 hover:text-blue-900">
          <FaHome className="mr-1" />
          Trang chủ
        </Link>
        {parentCategory && (
          <>
            <span className="text-neutral-500">&gt;</span>
            <Link to={`/category/${parentCategory.id}`} className="text-blue-800 hover:text-blue-900">
              {parentCategory.name}
            </Link>
          </>
        )}
        <span className="text-neutral-500">&gt;</span>
        <Link 
          to={`/category/${parentCategory ? parentCategory.id : categoryName.id}?subCategories=${categoryName.id}`} 
          className="text-blue-800 hover:text-blue-900"
        >
          {categoryName.name}
        </Link>
        <span className="text-neutral-500">&gt;</span>
        <span className="text-neutral-500">{productName}</span>
      </div>
    </div>
  );
}