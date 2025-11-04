import { FaHome } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function Breadcrumb({ categoryName }) {
  return (
    <div className="pt-4 pb-2 text-lg font-semibold">
      <div className="flex items-center space-x-2">
        <Link to="/" className="flex items-center text-blue-800 hover:text-blue-900">
          <FaHome className="mr-1" />
          Trang chủ
        </Link>
        <span className="text-neutral-500">&gt;</span>
        <span className="text-neutral-500">{categoryName}</span>
      </div>
    </div>
  );
}