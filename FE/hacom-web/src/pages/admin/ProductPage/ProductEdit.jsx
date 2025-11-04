import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { FaTimes, FaPlus, FaTrash, FaChevronDown, FaHome  } from 'react-icons/fa';
import { getProductById, updateProduct } from '../../../api/APIs/productApi';
import { getAllBrands } from '../../../api/APIs/brandApi';
import { getAllCategories } from '../../../api/APIs/categoryApi';
import { getAllTags } from '../../../api/APIs/tagApi';
import Header from '../Components/Header';
import Sidebar from '../Components/Sidebar';
import Footer from '../Components/Footer';

const ProductEdit = () => {
  const { id } = useParams();
  const [currentTab, setCurrentTab] = useState('general');
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    categoryId: '',
    brandId: '',
    tagId: '',
    price: '',
    discountPrice: '',
    inStock: '',
    videoUrl: '',
    configurations: [],
    specifications: [],
    contents: [],
    images: [],
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [productRes, brandRes, categoryRes, tagRes] = await Promise.all([
        getProductById(id),
        getAllBrands(),
        getAllCategories(),
        getAllTags(),
      ]);
      if (productRes.status === 200) {
        setFormData({
          name: productRes.data.name || '',
          code: productRes.data.code || '',
          categoryId: productRes.data.categoryId?.toString() || '',
          brandId: productRes.data.brandId?.toString() || '',
          tagId: productRes.data.tagId?.toString() || '',
          price: productRes.data.price?.toString() || '',
          discountPrice: productRes.data.discountPrice?.toString() || '',
          inStock: productRes.data.inStock?.toString() || '',
          videoUrl: productRes.data.videoUrl || '',
          configurations: productRes.data.configurations.map(c => ({
            name: c.name,
            description: c.description,
          })),
          specifications: productRes.data.specifications.map(s => ({
            name: s.name,
            description: s.description,
          })),
          contents: productRes.data.contents.map(c => ({
            title: c.title,
            description: c.description,
            imageUrl: c.imageUrl || ''
          })),
          images: productRes.data.images.map(i => ({
            imageUrl: i.imageUrl,
            main: i.main,
          })),
        });
      }
      if (brandRes.status === 200) setBrands(brandRes.data);
      if (categoryRes.status === 200) setCategories(categoryRes.data);
      if (tagRes.status === 200) setTags(tagRes.data);
    } catch (error) {
      toast.error('Lỗi hệ thống. Vui lòng thử lại.');
      console.error('Error fetching initial data:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChildInputChange = (index, type, field, value) => {
    setFormData((prev) => {
      const newItems = [...prev[type]];
      newItems[index][field] = value;
      return { ...prev, [type]: newItems };
    });
  };

  const addChildItem = (type) => {
    setFormData((prev) => {
      const newItems = [...prev[type]];
      if (type === 'images') {
        newItems.push({ imageUrl: '', main: false });
      } else if (type === 'contents') {
        newItems.push({ title: '', description: '', imageUrl: '' });
      } else {
        newItems.push({ name: '', description: '' });
      }
      return { ...prev, [type]: newItems };
    });
  };

  const removeChildItem = (index, type) => {
    setFormData((prev) => {
      const newItems = prev[type].filter((_, i) => i !== index);
      return { ...prev, [type]: newItems };
    });
  };

  const handleImageMainChange = (index) => {
    setFormData((prev) => {
      const newImages = prev.images.map((img, i) => ({
        ...img,
        main: i === index,
      }));
      return { ...prev, images: newImages };
    });
  };

  const handleImageUpload = async (index, file, type = 'images') => { 
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/upload-image`, {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();

      if (result.status === 200) {
        setFormData((prev) => {
          const newItems = [...prev[type]];
          newItems[index].imageUrl = result.data; 
          return { ...prev, [type]: newItems };
        });
        toast.success('Upload ảnh thành công');
      } else {
        toast.error(result.message || 'Lỗi khi upload ảnh');
      }
    } catch (error) {
      toast.error('Lỗi hệ thống khi upload ảnh');
      console.error('Upload image error:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const productData = {
      name: formData.name,
      code: formData.code,
      categoryId: parseInt(formData.categoryId) || null,
      brandId: parseInt(formData.brandId) || null,
      tagId: formData.tagId ? parseInt(formData.tagId) : null,
      price: parseFloat(formData.price) || null,
      discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : null,
      inStock: parseInt(formData.inStock) || null,
      videoUrl: formData.videoUrl || null,
      configurations: formData.configurations.filter(c => c.name && c.description),
      specifications: formData.specifications.filter(s => s.name && s.description),
      contents: formData.contents.filter(c => c.title && c.description),
      images: formData.images.filter(i => i.imageUrl),
    };
    try {
      const response = await updateProduct(id, productData);
      if (response.status === 200) {
        toast.success('Cập nhật sản phẩm thành công');
        navigate('/admin/product');
      } else {
        switch (response.status) {
          case 409:
            toast.error('Mã sản phẩm đã tồn tại');
            break;
          case 422:
            toast.error('Dữ liệu không hợp lệ');
            break;
          case 404:
            toast.error('Không tìm thấy sản phẩm, danh mục, hãng hoặc thẻ');
            break;
          default:
            toast.error('Cập nhật sản phẩm thất bại');
        }
      }
    } catch (error) {
      toast.error('Lỗi hệ thống. Vui lòng thử lại.');
      console.error('Update product error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-center" reverseOrder={false} />
      <Header username={sessionStorage.getItem('username')} />
      <Sidebar username={sessionStorage.getItem('username')} />
      <div className="p-4 sm:ml-64 pt-20">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-4 border-b-2 border-blue-700 pb-2">
            <h2 className="text-2xl font-bold text-blue-700">CẬP NHẬT SẢN PHẨM</h2>
            <div className="flex items-center gap-4">
              <nav className="text-sm text-gray-600 flex items-center flex-nowrap">
                <span className="flex items-center gap-1">
                  <FaHome className="text-gray-600" />
                  <span>Trang chủ</span>
                </span>
                <span className="mx-2">{'>'}</span>
                <Link to="/admin/product" className="hover:underline">Quản lý sản phẩm</Link>
                <span className="mx-2">{'>'}</span>
                <span className="font-medium text-gray-800">Cập nhật</span>
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
            <div className="flex mb-4 border-b">
              {['general', 'configurations', 'specifications', 'contents', 'images'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setCurrentTab(tab)}
                  className={`px-4 py-2 ${currentTab === tab ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600'}`}
                >
                  {tab === 'general' && 'Thông tin chung'}
                  {tab === 'configurations' && 'Cấu hình'}
                  {tab === 'specifications' && 'Thông số kỹ thuật'}
                  {tab === 'contents' && 'Nội dung'}
                  {tab === 'images' && 'Ảnh'}
                </button>
              ))}
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {currentTab === 'general' && (
                <div className="space-y-4 overflow-x-auto overflow-y-auto max-h-[53vh] border rounded-md">
                  <div className="flex flex-col">
                    <label className="font-medium text-gray-700">Tên sản phẩm:</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="border rounded-md px-2 py-1 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="font-medium text-gray-700">Mã sản phẩm:</label>
                    <input
                      type="text"
                      name="code"
                      value={formData.code}
                      onChange={handleInputChange}
                      required
                      className="border rounded-md px-2 py-1 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="font-medium text-gray-700">Danh mục:</label>
                    <div className="relative">
                      <select
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={handleInputChange}
                        required
                        className="appearance-none w-full px-2 py-1 border rounded-md focus:outline-none focus:border-blue-500"
                      >
                        <option value="">Chọn danh mục</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                      <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <label className="font-medium text-gray-700">Hãng:</label>
                    <div className="relative">
                      <select
                        name="brandId"
                        value={formData.brandId}
                        onChange={handleInputChange}
                        required
                        className="appearance-none w-full px-2 py-1 border rounded-md focus:outline-none focus:border-blue-500"
                      >
                        <option value="">Chọn hãng</option>
                        {brands.map((brand) => (
                          <option key={brand.id} value={brand.id}>
                            {brand.name}
                          </option>
                        ))}
                      </select>
                      <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <label className="font-medium text-gray-700">Thẻ:</label>
                    <div className="relative">
                      <select
                        name="tagId"
                        value={formData.tagId}
                        onChange={handleInputChange}
                        className="appearance-none w-full px-2 py-1 border rounded-md focus:outline-none focus:border-blue-500"
                      >
                        <option value="">Không chọn thẻ</option>
                        {tags.map((tag) => (
                          <option key={tag.id} value={tag.id}>
                            {tag.name}
                          </option>
                        ))}
                      </select>
                      <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <label className="font-medium text-gray-700">Giá:</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      className="border rounded-md px-2 py-1 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="font-medium text-gray-700">Giá giảm:</label>
                    <input
                      type="number"
                      name="discountPrice"
                      value={formData.discountPrice}
                      onChange={handleInputChange}
                      className="border rounded-md px-2 py-1 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="font-medium text-gray-700">Số lượng:</label>
                    <input
                      type="number"
                      name="inStock"
                      value={formData.inStock}
                      onChange={handleInputChange}
                      required
                      className="border rounded-md px-2 py-1 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="font-medium text-gray-700">Video URL (tùy chọn):</label>
                    <input
                      type="text"
                      name="videoUrl"
                      value={formData.videoUrl}
                      onChange={handleInputChange}
                      className="border rounded-md px-2 py-1 focus:outline-none focus:border-blue-500"
                      placeholder="Nhập URL video YouTube (nếu có)"
                    />
                  </div>
                </div>
              )}
              {currentTab === 'configurations' && (
                <div className="space-y-4 overflow-x-auto overflow-y-auto max-h-[53vh] border rounded-md">
                  {formData.configurations.map((config, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <div className="flex flex-col w-1/3">
                        <label className="font-medium text-gray-700">Cấu hình:</label>
                        <input
                          type="text"
                          value={config.name}
                          onChange={(e) => handleChildInputChange(index, 'configurations', 'name', e.target.value)}
                          className="border rounded-md px-2 py-1 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div className="flex flex-col w-2/3">
                        <label className="font-medium text-gray-700">Mô tả:</label>
                        <input
                          type="text"
                          value={config.description}
                          onChange={(e) => handleChildInputChange(index, 'configurations', 'description', e.target.value)}
                          className="border rounded-md px-2 py-1 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeChildItem(index, 'configurations')}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addChildItem('configurations')}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center gap-2"
                  >
                    <FaPlus /> Thêm cấu hình
                  </button>
                </div>
              )}
              {currentTab === 'specifications' && (
                <div className="space-y-4 overflow-x-auto overflow-y-auto max-h-[53vh] border rounded-md">
                  {formData.specifications.map((spec, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <div className="flex flex-col w-1/3">
                        <label className="font-medium text-gray-700">Thông số:</label>
                        <input
                          type="text"
                          value={spec.name}
                          onChange={(e) => handleChildInputChange(index, 'specifications', 'name', e.target.value)}
                          className="border rounded-md px-2 py-1 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div className="flex flex-col w-2/3">
                        <label className="font-medium text-gray-700">Mô tả:</label>
                        <input
                          type="text"
                          value={spec.description}
                          onChange={(e) => handleChildInputChange(index, 'specifications', 'description', e.target.value)}
                          className="border rounded-md px-2 py-1 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeChildItem(index, 'specifications')}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addChildItem('specifications')}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center gap-2"
                  >
                    <FaPlus /> Thêm thông số
                  </button>
                </div>
              )}
              {currentTab === 'contents' && (
                <div className="space-y-4 overflow-x-auto overflow-y-auto max-h-[53vh] border rounded-md">
                  {formData.contents.map((content, index) => (
                    <div key={index} className="flex gap-2 items-start">
                      <div className="flex flex-col w-1/3 gap-4">
                        <div className="flex flex-col">
                          <label className="font-medium text-gray-700">Tiêu đề:</label>
                          <input
                            type="text"
                            value={content.title}
                            onChange={(e) => handleChildInputChange(index, 'contents', 'title', e.target.value)}
                            className="border rounded-md px-2 py-1 focus:outline-none focus:border-blue-500"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="font-medium text-gray-700">Ảnh (tùy chọn):</label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(index, e.target.files[0], 'contents')}
                            className="border rounded-md px-2 py-1 focus:outline-none focus:border-blue-500"
                          />
                          {content.imageUrl && (
                            <div className="mt-2">
                              <img
                                src={`${import.meta.env.VITE_IMAGE_BASE_URL}${content.imageUrl}`}
                                alt="Preview"
                                className="w-96 h-24 object-cover"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col w-2/3">
                        <label className="font-medium text-gray-700">Mô tả:</label>
                        <textarea
                          value={content.description}
                          onChange={(e) => handleChildInputChange(index, 'contents', 'description', e.target.value)}
                          className="border rounded-md px-2 py-1 focus:outline-none focus:border-blue-500 h-32 resize-y"
                          placeholder="Nhập mô tả nội dung"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeChildItem(index, 'contents')}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 mt-8"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addChildItem('contents')}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center gap-2"
                  >
                    <FaPlus /> Thêm nội dung
                  </button>
                </div>
              )}
                {currentTab === 'images' && (
                    <div className="space-y-4 overflow-x-auto overflow-y-auto max-h-[53vh] border rounded-md">
                    {formData.images.map((image, index) => (
                        <div key={index} className="flex gap-2 items-center">
                        <div className="flex flex-col w-3/4">
                            <label className="font-medium text-gray-700">Chọn ảnh:</label>
                            <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(index, e.target.files[0])}
                            className="border rounded-md px-2 py-1 focus:outline-none focus:border-blue-500"
                            />
                            {image.imageUrl && (
                            <div className="mt-2">
                                <img src={`${import.meta.env.VITE_IMAGE_BASE_URL}${image.imageUrl}`} alt="Preview" className="w-24 h-24 object-cover"/>
                            </div>
                            )}
                        </div>
                        <div className="flex flex-col items-center">
                            <label className="font-medium text-gray-700">Ảnh chính:</label>
                            <input
                            type="checkbox"
                            checked={image.main}
                            onChange={() => handleImageMainChange(index)}
                            className="mt-2"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => removeChildItem(index, 'images')}
                            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                        >
                            <FaTrash />
                        </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => addChildItem('images')}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center gap-2"
                    >
                        <FaPlus /> Thêm ảnh
                    </button>
                    </div>
                )}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => navigate('/admin/product')}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                >
                  Cập nhật
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductEdit;