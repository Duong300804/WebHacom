import { FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; 

export default function ProductList({ cartItems, products, onSelectAll, onSelectItem, onQuantityChange, onRemoveItem, onRemoveAll, selectedCount, totalItems }) {
  const allSelected = selectedCount === totalItems && totalItems > 0;
  const navigate = useNavigate(); 

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-4 mb-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <input 
            type="checkbox" 
            checked={allSelected}
            onChange={(e) => onSelectAll(e.target.checked)}
            className="w-5 h-5 accent-red-600 cursor-pointer"
          />
          <span className="font-semibold">Tất cả ({selectedCount}/{totalItems}) sản phẩm</span>
        </div>
        <button 
          onClick={onRemoveAll}
          className="bg-white border border-red-500 text-red-500 px-3 py-1 rounded hover:bg-red-500 hover:text-white flex items-center gap-2"
        >
          <FaTrash /> Xóa tất cả
        </button>
      </div>
      {cartItems.map((item) => {
        const product = products.find(p => p.id === item.productId);
        if (!product) return null;
        const mainImage = product.images.find(img => img.main) || product.images[0];
        const price = product.discountPrice || product.price;
        const formattedPrice = price.toLocaleString('vi-VN');
        const formattedOriginal = product.price.toLocaleString('vi-VN');
        const subtotal = (price * item.quantity).toLocaleString('vi-VN');

        const handleProductClick = () => {
          navigate(`/product/${product.id}`);
        };

        return (
          <div key={item.productId} className="flex items-center gap-4 mb-4 border-b pb-4">
            <input 
              type="checkbox" 
              checked={item.selected}
              onChange={(e) => onSelectItem(item.productId, e.target.checked)}
              className="w-5 h-5 accent-red-600 cursor-pointer"
            />
            <div 
              className="flex items-center gap-4 flex-1 cursor-pointer" 
              onClick={handleProductClick}
            >
              <img 
                src={`${import.meta.env.VITE_IMAGE_BASE_URL}${mainImage?.imageUrl}`} 
                alt={product.name} 
                className="w-20 h-20 object-cover rounded-lg border border-gray-200"
              />
              <div className="flex-1">
                <p className="font-semibold line-clamp-2 hover:text-red-600">{product.name}</p>
                <p className="text-sm text-gray-600">Mã: {product.code}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-red-600 font-bold">{formattedPrice} VNĐ</p>
              <p className="text-sm line-through text-gray-600">{formattedOriginal} VNĐ</p>
            </div>
            <div className="flex items-center border border-gray-300 rounded">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onQuantityChange(item.productId, item.quantity - 1);
                }} 
                className="px-2"
              >
                -
              </button>
              <input 
                type="number" 
                value={item.quantity} 
                onChange={(e) => {
                  e.stopPropagation(); 
                  onQuantityChange(item.productId, parseInt(e.target.value) || 1);
                }}
                className="w-12 text-center border-x border-gray-300"
              />
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onQuantityChange(item.productId, item.quantity + 1);
                }} 
                className="px-2"
              >
                +
              </button>
            </div>
            <p className="text-red-600 font-bold">{subtotal} VNĐ</p>
            <button 
              onClick={(e) => {
                e.stopPropagation(); 
                onRemoveItem(item.productId);
              }} 
              className="text-red-500 hover:text-red-700"
            >
              <FaTrash />
            </button>
          </div>
        );
      })}
    </div>
  );
}