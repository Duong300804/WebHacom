import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { FaTimes, FaHome } from 'react-icons/fa';
import { getProductById } from '../../../api/APIs/productApi';
import { getBrandById } from '../../../api/APIs/brandApi';
import { getCategoryById } from '../../../api/APIs/categoryApi';
import { getTagById } from '../../../api/APIs/tagApi';
import Header from '../Components/Header';
import Sidebar from '../Components/Sidebar';
import Footer from '../Components/Footer';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [brandName, setBrandName] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [tagName, setTagName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const response = await getProductById(id);
      if (response.status === 200) {
        setProduct(response.data);
        const [brandRes, categoryRes, tagRes] = await Promise.all([
          getBrandById(response.data.brandId),
          getCategoryById(response.data.categoryId),
          response.data.tagId ? getTagById(response.data.tagId) : Promise.resolve({ data: null }),
        ]);
        setBrandName(brandRes.data?.name || 'Không xác định');
        setCategoryName(categoryRes.data?.name || 'Không xác định');
        setTagName(tagRes.data?.name || 'Không có thẻ');
      } else {
        toast.error('Không thể tải thông tin sản phẩm');
      }
    } catch (error) {
      toast.error('Lỗi hệ thống. Vui lòng thử lại.');
      console.error('Detail error:', error);
    }
  };

  if (!product) return <div className="text-center p-4">Đang tải...</div>;

  const mainImage = product.images.find(img => img.main) || product.images[0];

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-center" reverseOrder={false} />
      <Header username={sessionStorage.getItem('username')} />
      <Sidebar username={sessionStorage.getItem('username')} />
      <div className="p-4 sm:ml-64 pt-20">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-4 border-b-2 border-blue-700 pb-2">
            <h2 className="text-2xl font-bold text-blue-700">CHI TIẾT SẢN PHẨM</h2>
            <div className="flex items-center gap-4">
              <nav className="text-sm text-gray-600 flex items-center flex-nowrap">
                <span className="flex items-center gap-1">
                  <FaHome className="text-gray-600" />
                  <span>Trang chủ</span>
                </span>
                <span className="mx-2">{'>'}</span>
                <Link to="/admin/product" className="hover:underline">Quản lý sản phẩm</Link>
                <span className="mx-2">{'>'}</span>
                <span className="font-medium text-gray-800">Chi tiết</span>
              </nav>
              <button
                onClick={() => navigate('/admin/product')}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={20} />
              </button>
            </div>
          </div>
          <div className="bg-white shadow-md rounded-lg p-4">
            <div className="space-y-3 overflow-auto max-h-[60vh] border rounded-md">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700 w-40">ID:</span>
                <span className="border rounded-md px-2 py-1 bg-gray-50 text-gray-800 flex-1 text-right">{product.id}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700 w-40">Tên sản phẩm:</span>
                <span className="border rounded-md px-2 py-1 bg-gray-50 text-gray-800 flex-1 text-right break-words">{product.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700 w-40">Mã sản phẩm:</span>
                <span className="border rounded-md px-2 py-1 bg-gray-50 text-gray-800 flex-1 text-right break-words">{product.code}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700 w-40">Ảnh sản phẩm:</span>
                {/* Hiển thị 1 ảnh */}
                {/* <span className="border rounded-md px-2 py-1 bg-gray-50 text-gray-800 flex-1 text-right">
                  {mainImage ? (
                    <img src={`${import.meta.env.VITE_IMAGE_BASE_URL}${mainImage.imageUrl}`} alt={product.name} className="w-24 h-24 object-cover mx-auto" />
                  ) : (
                    'Không có ảnh'
                  )}
                </span> */}
                {/* Hiển thị toàn bộ ảnh */}
                <span className="border rounded-md px-2 py-1 bg-gray-50 text-gray-800 flex-1 justify-end flex gap-2 overflow-x-auto">
                {product.images && product.images.length > 0 ? (
                    product.images.map((image, index) => (
                    <img
                        key={index}
                        src={`${import.meta.env.VITE_IMAGE_BASE_URL}${image.imageUrl}`}
                        alt={`${product.name}-${index}`}
                        className="w-24 h-24 object-cover"
                    />
                    ))
                ) : (
                    'Không có ảnh'
                )}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700 w-40">Hãng:</span>
                <span className="border rounded-md px-2 py-1 bg-gray-50 text-gray-800 flex-1 text-right">{brandName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700 w-40">Danh mục:</span>
                <span className="border rounded-md px-2 py-1 bg-gray-50 text-gray-800 flex-1 text-right">{categoryName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700 w-40">Thẻ:</span>
                <span className="border rounded-md px-2 py-1 bg-gray-50 text-gray-800 flex-1 text-right">{tagName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700 w-40">Giá:</span>
                <span className="border rounded-md px-2 py-1 bg-gray-50 text-gray-800 flex-1 text-right">{product.priceFormatted} VNĐ</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700 w-40">Giá giảm:</span>
                <span className="border rounded-md px-2 py-1 bg-gray-50 text-gray-800 flex-1 text-right">{product.discountPriceFormatted || 'Không có'} VNĐ</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700 w-40">Số lượng:</span>
                <span className="border rounded-md px-2 py-1 bg-gray-50 text-gray-800 flex-1 text-right">{product.inStock}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700 w-40">Video URL:</span>
                <span className="border rounded-md px-2 py-1 bg-gray-50 text-gray-800 flex-1 text-right break-words">
                  {product.videoUrl ? (
                    <a href={product.videoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                      {product.videoUrl}
                    </a>
                  ) : (
                    'Không có video'
                  )}
                </span>
              </div>
              <div className="flex justify-between items-start">
                <span className="font-medium text-gray-700 w-40">Cấu hình:</span>
                <div className="border rounded-md px-2 py-1 bg-gray-50 text-gray-800 flex-1 text-right">
                  {product.configurations.length > 0 ? (
                    product.configurations.map((config, index) => (
                      <div key={index} className="mb-2">
                        {config.name}: {config.description}
                      </div>
                    ))
                  ) : (
                    'Không có cấu hình'
                  )}
                </div>
              </div>
              <div className="flex justify-between items-start">
                <span className="font-medium text-gray-700 w-40">Thông số kỹ thuật:</span>
                <div className="border rounded-md px-2 py-1 bg-gray-50 text-gray-800 flex-1 text-right">
                  {product.specifications.length > 0 ? (
                    product.specifications.map((spec, index) => (
                      <div key={index} className="mb-2">
                        {spec.name}: {spec.description}
                      </div>
                    ))
                  ) : (
                    'Không có thông số'
                  )}
                </div>
              </div>
              <div className="flex justify-between items-start">
                <span className="font-medium text-gray-700 w-40">Nội dung:</span>
                <div className="border rounded-md px-2 py-1 bg-gray-50 text-gray-800 flex-1 text-right">
                  {product.contents.length > 0 ? (
                    product.contents.map((content, index) => (
                      <div key={index} className="mb-2">
                        {content.title}: {content.description}
                        {content.imageUrl && (
                          <div className="mt-2">
                            <img src={`${import.meta.env.VITE_IMAGE_BASE_URL}${content.imageUrl}`} alt={content.title} className="w-24 h-24 object-cover mx-auto" />
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    'Không có nội dung'
                  )}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700 w-40">Ngày tạo:</span>
                <span className="border rounded-md px-2 py-1 bg-gray-50 text-gray-800 flex-1 text-right">{new Date(product.createdAt).toLocaleString('vi-VN')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700 w-40">Ngày cập nhật:</span>
                <span className="border rounded-md px-2 py-1 bg-gray-50 text-gray-800 flex-1 text-right">{new Date(product.updatedAt).toLocaleString('vi-VN')}</span>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => navigate('/admin/product')}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetail;