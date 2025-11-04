import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { FaSearch, FaChevronDown, FaEdit, FaTrash, FaInfoCircle, FaHome, FaTimes } from 'react-icons/fa';
import { filterProducts, getAllProducts } from '../../../api/APIs/productApi';
import { getAllBrands } from '../../../api/APIs/brandApi';
import { getAllCategories, filterCategories } from '../../../api/APIs/categoryApi';
import { getAllTags } from '../../../api/APIs/tagApi';
import Header from '../Components/Header';
import Sidebar from '../Components/Sidebar';
import Footer from '../Components/Footer';

const ProductFilter = () => {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [filter, setFilter] = useState({
    brandId: '',
    categoryId: '',
    subCategoryId: '',
    tagId: '',
    minPrice: '',
    maxPrice: '',
    inStock: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (filter.categoryId) {
      fetchSubCategories(filter.categoryId);
    } else {
      setSubCategories([]);
      setFilter((prev) => ({ ...prev, subCategoryId: '' }));
    }
  }, [filter.categoryId]);

  const fetchInitialData = async () => {
    try {
      const [productRes, brandRes, categoryRes, tagRes] = await Promise.all([
        getAllProducts(),
        getAllBrands(),
        getAllCategories(),
        getAllTags(),
      ]);
      if (productRes.status === 200) setProducts(productRes.data);
      if (brandRes.status === 200) setBrands(brandRes.data);
      if (categoryRes.status === 200) setCategories(categoryRes.data);
      if (tagRes.status === 200) setTags(tagRes.data);
    } catch (error) {
      toast.error('Lỗi hệ thống. Vui lòng thử lại.');
      console.error('Error fetching initial data:', error);
    }
  };

  const fetchSubCategories = async (parentId) => {
    try {
      const response = await filterCategories({ parentId, deleteFlag: 'NON_DELETE' });
      if (response.status === 200) {
        setSubCategories(response.data);
      } else {
        setSubCategories([]);
        toast.error('Không tìm thấy danh mục con.');
      }
    } catch (error) {
      setSubCategories([]);
      toast.error('Lỗi khi lấy danh mục con.');
      console.error('Error fetching subcategories:', error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilterSubmit = async (e) => {
    e.preventDefault();
    try {
      const filterRequest = {
        brandId: filter.brandId || null,
        categoryId: filter.subCategoryId || filter.categoryId || null,
        tagId: filter.tagId || null,
        minPrice: filter.minPrice ? parseFloat(filter.minPrice) : null,
        maxPrice: filter.maxPrice ? parseFloat(filter.maxPrice) : null,
        inStock: filter.inStock === 'inStock' ? 1 : filter.inStock === 'outOfStock' ? 0 : null,
        includeSubCategories: !filter.subCategoryId && filter.categoryId ? true : false,
      };
      const response = await filterProducts(filterRequest);
      if (response.status === 200) {
        setProducts(response.data);
        if (response.data.length === 0) {
          toast.error('Không tìm thấy sản phẩm phù hợp');
        }
      } else {
        toast.error('Lọc sản phẩm thất bại');
      }
    } catch (error) {
      toast.error('Lỗi hệ thống. Vui lòng thử lại.');
      console.error('Filter error:', error);
    }
  };

  const handleResetFilter = () => {
    setFilter({
      brandId: '',
      categoryId: '',
      subCategoryId: '',
      tagId: '',
      minPrice: '',
      maxPrice: '',
      inStock: '',
    });
    setSubCategories([]);
    fetchInitialData();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-center" reverseOrder={false} />
      <Header username={sessionStorage.getItem('username')} />
      <Sidebar username={sessionStorage.getItem('username')} />
      <div className="p-4 sm:ml-64 pt-20">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-4 border-b-2 border-blue-700 pb-2">
            <h2 className="text-2xl font-bold text-blue-700">LỌC SẢN PHẨM</h2>
            <div className="flex items-center gap-4">
              <nav className="text-sm text-gray-600 flex items-center flex-nowrap">
                <span className="flex items-center gap-1">
                  <FaHome className="text-gray-600" />
                  <span>Trang chủ</span>
                </span>
                <span className="mx-2">{'>'}</span>
                <Link to="/admin/product" className="hover:underline">Quản lý sản phẩm</Link>
                <span className="mx-2">{'>'}</span>
                <span className="font-medium text-gray-800">Lọc</span>
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
            <form onSubmit={handleFilterSubmit} className="flex flex-col gap-4 mb-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex flex-col w-full sm:w-1/4">
                  <label className="font-medium text-gray-700">Danh mục:</label>
                  <div className="relative">
                    <select
                      name="categoryId"
                      value={filter.categoryId}
                      onChange={handleFilterChange}
                      className="appearance-none w-full px-2 py-1 border rounded-md focus:outline-none focus:border-blue-500"
                    >
                      <option value="">Tất cả</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" />
                  </div>
                </div>
                <div className="flex flex-col w-full sm:w-1/4">
                  <label className="font-medium text-gray-700">Danh mục con:</label>
                  <div className="relative">
                    <select
                      name="subCategoryId"
                      value={filter.subCategoryId}
                      onChange={handleFilterChange}
                      className="appearance-none w-full px-2 py-1 border rounded-md focus:outline-none focus:border-blue-500"
                      disabled={!filter.categoryId}
                    >
                      <option value="">Tất cả</option>
                      {subCategories.map((subCategory) => (
                        <option key={subCategory.id} value={subCategory.id}>
                          {subCategory.name}
                        </option>
                      ))}
                    </select>
                    <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" />
                  </div>
                </div>
                <div className="flex flex-col w-full sm:w-1/4">
                  <label className="font-medium text-gray-700">Hãng:</label>
                  <div className="relative">
                    <select
                      name="brandId"
                      value={filter.brandId}
                      onChange={handleFilterChange}
                      className="appearance-none w-full px-2 py-1 border rounded-md focus:outline-none focus:border-blue-500"
                    >
                      <option value="">Tất cả</option>
                      {brands.map((brand) => (
                        <option key={brand.id} value={brand.id}>
                          {brand.name}
                        </option>
                      ))}
                    </select>
                    <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" />
                  </div>
                </div>
                <div className="flex flex-col w-full sm:w-1/4">
                  <label className="font-medium text-gray-700">Thẻ:</label>
                  <div className="relative">
                    <select
                      name="tagId"
                      value={filter.tagId}
                      onChange={handleFilterChange}
                      className="appearance-none w-full px-2 py-1 border rounded-md focus:outline-none focus:border-blue-500"
                    >
                      <option value="">Tất cả</option>
                      {tags.map((tag) => (
                        <option key={tag.id} value={tag.id}>
                          {tag.name}
                        </option>
                      ))}
                    </select>
                    <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" />
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex flex-col w-full sm:w-1/4">
                  <label className="font-medium text-gray-700">Giá từ:</label>
                  <input
                    type="text"
                    name="minPrice"
                    value={filter.minPrice ? Number(filter.minPrice).toLocaleString('vi-VN') : ''}
                    onChange={(e) => {
                      const rawValue = e.target.value.replace(/\D/g, '');
                      handleFilterChange({ target: { name: 'minPrice', value: rawValue } });
                    }}
                    placeholder="Nhập giá tối thiểu"
                    className="border rounded-md px-2 py-1 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="flex flex-col w-full sm:w-1/4">
                  <label className="font-medium text-gray-700">Giá đến:</label>
                  <input
                    type="text"
                    name="maxPrice"
                    value={filter.maxPrice ? Number(filter.maxPrice).toLocaleString('vi-VN') : ''}
                    onChange={(e) => {
                      const rawValue = e.target.value.replace(/\D/g, '');
                      handleFilterChange({ target: { name: 'maxPrice', value: rawValue } });
                    }}
                    placeholder="Nhập giá tối đa"
                    className="border rounded-md px-2 py-1 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="flex flex-col w-full sm:w-1/4">
                  <label className="font-medium text-gray-700">Tình trạng:</label>
                  <div className="relative">
                    <select
                      name="inStock"
                      value={filter.inStock}
                      onChange={handleFilterChange}
                      className="appearance-none w-full px-2 py-1 border rounded-md focus:outline-none focus:border-blue-500"
                    >
                      <option value="">Tất cả</option>
                      <option value="inStock">Còn hàng</option>
                      <option value="outOfStock">Hết hàng</option>
                    </select>
                    <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" />
                  </div>
                </div>
                <div className="flex gap-2 items-end">
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center gap-2"
                  >
                    <FaSearch /> Lọc
                  </button>
                  {(filter.brandId || filter.categoryId || filter.subCategoryId || filter.tagId || filter.minPrice || filter.maxPrice || filter.inStock) && (
                    <button
                      type="button"
                      onClick={handleResetFilter}
                      className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                    >
                      Đặt lại
                    </button>
                  )}
                </div>
              </div>
            </form>
            {products.length > 0 ? (
              <div className="overflow-x-auto overflow-y-auto max-h-[48vh] border rounded-md">
                <table className="w-full border-collapse">
                  <thead className="sticky top-0">
                    <tr className="bg-blue-700 text-white">
                      <th className="p-2 text-center border-r border-gray-300">STT</th>
                      <th className="p-2 text-center border-r border-gray-300">Tên sản phẩm</th>
                      <th className="p-2 text-center border-r border-gray-300">Mã sản phẩm</th>
                      <th className="p-2 text-center border-r border-gray-300">Giá</th>
                      <th className="p-2 text-center border-r border-gray-300">Số lượng</th>
                      <th className="p-2 text-center border-r border-gray-300">Hãng</th>
                      <th className="p-2 text-center border-r border-gray-300">Danh mục</th>
                      <th className="p-2 text-center border-r border-gray-300">Thẻ</th>
                      <th className="p-2 text-center">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product, index) => (
                      <tr key={product.id} className="hover:bg-gray-100 even:bg-gray-50">
                        <td className="p-2 text-center border-r border-gray-300">{index + 1}</td>
                        <td className="p-2 text-center border-r border-gray-300 truncate max-w-[180px]">{product.name}</td>
                        <td className="p-2 text-center border-r border-gray-300">{product.code}</td>
                        <td className="p-2 text-center border-r border-gray-300">
                          {product.discountPriceFormatted || product.priceFormatted} VNĐ
                        </td>
                        <td className="p-2 text-center border-r border-gray-300">{product.inStock}</td>
                        <td className="p-2 text-center border-r border-gray-300">{brands.find(b => b.id === product.brandId)?.name || 'Không xác định'}</td>
                        <td className="p-2 text-center border-r border-gray-300 max-w-[130px]">{categories.find(c => c.id === product.categoryId)?.name || 'Không xác định'}</td>
                        <td className="p-2 text-center border-r border-gray-300 max-w-[120px]">{tags.find(t => t.id === product.tagId)?.name || 'Không có thẻ'}</td>
                        <td className="p-2 text-center">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => navigate(`/admin/product/detail/${product.id}`)}
                              className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 flex items-center gap-1"
                              title="Chi tiết"
                            >
                              <FaInfoCircle /> Chi tiết
                            </button>
                            <button
                              onClick={() => navigate(`/admin/product/edit/${product.id}`)}
                              className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 flex items-center gap-1"
                              title="Sửa"
                            >
                              <FaEdit /> Sửa
                            </button>
                            <button
                              onClick={() => navigate(`/admin/product`)}
                              className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 flex items-center gap-1"
                              title="Xóa"
                            >
                              <FaTrash /> Xóa
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center text-gray-600">Không có dữ liệu</div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductFilter;