import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { FaSearch, FaPlus, FaEdit, FaTrash, FaInfoCircle, FaHome, FaFilter } from 'react-icons/fa';
import { getAllProducts, searchProducts, deleteProduct } from '../../../api/APIs/productApi';
import Header from '../Components/Header';
import Sidebar from '../Components/Sidebar';
import Footer from '../Components/Footer';
import ModalDelete from '../Components/Modal/ModalDelete';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await getAllProducts();
      if (response.status === 200) {
        setProducts(response.data);
      } else {
        toast.error('Không thể tải danh sách sản phẩm');
      }
    } catch (error) {
      toast.error('Lỗi hệ thống. Vui lòng thử lại.');
      console.error('Error fetching products:', error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchKeyword.trim()) {
      toast.error('Vui lòng nhập từ khóa tìm kiếm');
      return;
    }
    try {
      const response = await searchProducts(searchKeyword);
      if (response.status === 200) {
        setProducts(response.data);
        if (response.data.length === 0) {
          toast.error('Không tìm thấy sản phẩm');
        }
      } else {
        toast.error('Tìm kiếm thất bại');
      }
    } catch (error) {
      toast.error('Lỗi hệ thống. Vui lòng thử lại.');
      console.error('Search error:', error);
    }
  };

  const handleResetSearch = () => {
    setSearchKeyword('');
    fetchProducts();
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setIsModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;
    try {
      const response = await deleteProduct(productToDelete.id);
      if (response.status === 200) {
        toast.success('Xóa sản phẩm thành công');
        fetchProducts();
      } else {
        toast.error('Xóa sản phẩm thất bại');
      }
    } catch (error) {
      toast.error('Lỗi hệ thống. Vui lòng thử lại.');
      console.error('Delete error:', error);
    } finally {
      setIsModalOpen(false);
      setProductToDelete(null);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setProductToDelete(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-center" reverseOrder={false} />
      <Header username={sessionStorage.getItem('username')} />
      <Sidebar username={sessionStorage.getItem('username')} />
      <div className="p-4 sm:ml-64 pt-20">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-4 border-b-2 border-blue-700 pb-2">
            <h2 className="text-2xl font-bold text-blue-700">DANH SÁCH SẢN PHẨM</h2>
            <nav className="text-sm text-gray-600 flex items-center flex-nowrap">
              <span className="flex items-center gap-1">
                <FaHome className="text-gray-600" />
                <span>Trang chủ</span>
              </span>
              <span className="mx-2">{'>'}</span>
              <Link to="/admin/product" className="hover:underline">Quản lý sản phẩm</Link>
              <span className="mx-2">{'>'}</span>
              <span className="font-medium text-gray-800">Danh sách</span>
            </nav>
          </div>
          <div className="bg-white shadow-md rounded-lg p-4">
            <div className="flex flex-col sm:flex-row justify-between mb-4">
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center gap-2"
                  >
                    <FaSearch /> Tìm kiếm
                  </button>
                  {searchKeyword && (
                    <button
                      type="button"
                      onClick={handleResetSearch}
                      className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                    >
                      Quay lại
                    </button>
                  )}
                </div>
              </form>
              <div className="flex gap-2 mt-2 sm:mt-0">
                <button
                  onClick={() => navigate('/admin/product/create')}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center gap-2"
                >
                  <FaPlus /> Thêm sản phẩm
                </button>
                <button
                  onClick={() => navigate('/admin/product/filter')}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 flex items-center gap-2"
                >
                  <FaFilter /> Lọc sản phẩm
                </button>
              </div>
            </div>
            {products.length > 0 ? (
              <div className="overflow-x-auto overflow-y-auto max-h-[60vh] border rounded-md">
                <table className="w-full border-collapse">
                  <thead className="sticky top-0">
                    <tr className="bg-blue-700 text-white">
                      <th className="p-2 text-center border-r border-gray-300">STT</th>
                      <th className="p-2 text-center border-r border-gray-300">Tên sản phẩm</th>
                      <th className="p-2 text-center border-r border-gray-300">Mã sản phẩm</th>
                      <th className="p-2 text-center border-r border-gray-300">Ảnh sản phẩm</th>
                      <th className="p-2 text-center border-r border-gray-300">Giá</th>
                      <th className="p-2 text-center border-r border-gray-300">Số lượng</th>
                      <th className="p-2 text-center">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product, index) => {
                      const mainImage = product.images.find(img => img.main) || product.images[0];
                      return (
                        <tr key={product.id} className="hover:bg-gray-100 even:bg-gray-50">
                          <td className="p-2 text-center border-r border-gray-300">{index + 1}</td>
                          <td className="p-2 text-center border-r border-gray-300 truncate max-w-xs">{product.name}</td>
                          <td className="p-2 text-center border-r border-gray-300">{product.code}</td>
                          <td className="p-2 text-center border-r border-gray-300">
                            {mainImage ? (
                              <img src={`${import.meta.env.VITE_IMAGE_BASE_URL}${mainImage.imageUrl}`} alt={product.name} className="w-16 h-16 object-cover mx-auto" />
                            ) : (
                              'Không có ảnh'
                            )}
                          </td>
                          <td className="p-2 text-center border-r border-gray-300">
                            {product.discountPriceFormatted || product.priceFormatted} VNĐ
                          </td>
                          <td className="p-2 text-center border-r border-gray-300">{product.inStock}</td>
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
                                onClick={() => handleDeleteClick(product)}
                                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 flex items-center gap-1"
                                title="Xóa"
                              >
                                <FaTrash /> Xóa
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center text-gray-600">Không có dữ liệu</div>
            )}
          </div>
        </div>
      </div>
      <ModalDelete
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleDeleteConfirm}
        title="Xác nhận xóa sản phẩm"
        message={`Bạn có chắc chắn muốn xóa sản phẩm ${productToDelete?.name} ? Hành động này không thể hoàn tác.`}
      />
      <Footer />
    </div>
  );
};

export default ProductList;