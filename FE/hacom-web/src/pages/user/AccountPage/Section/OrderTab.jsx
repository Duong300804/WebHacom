import React, { useState, useEffect } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';
import { getMyOrders, getOrderById, cancelOrder } from '../../../../api/APIs/orderApi'; 
import { getProductById } from '../../../../api/APIs/productApi'; 
import OrderDetailModal from './OrderDetailModal';
import CancelOrderModal from './CancelOrderModal';

const OrderTab = ({ user }) => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [activeFilter, setActiveFilter] = useState('Tất cả');
  const [expandedOrders, setExpandedOrders] = useState({}); 
  const [productDetails, setProductDetails] = useState({}); 
  const [loading, setLoading] = useState(true);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);

  const statusMap = {
    PENDING: { label: 'Đang chờ', color: 'bg-yellow-500' },
    CONFIRMED: { label: 'Đã xác nhận', color: 'bg-orange-500' },
    SHIPPED: { label: 'Đang giao', color: 'bg-blue-500' },
    DELIVERED: { label: 'Đã giao', color: 'bg-green-500' },
    CANCELLED: { label: 'Đã hủy', color: 'bg-red-500' },
  };

  const filters = ['Tất cả', 'Đang chờ', 'Đã xác nhận', 'Đang giao', 'Đã giao', 'Đã hủy'];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await getMyOrders();
      if (response.status === 200) {
        // const sortedOrders = response.data.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
        const sortedOrders = response.data.sort((a, b) => b.id - a.id);
        setOrders(sortedOrders);
        setFilteredOrders(sortedOrders);
        // Fetch chi tiết sản phẩm cho tất cả orderItems
        const allProductIds = new Set();
        sortedOrders.forEach(order => {
          order.orderItems.forEach(item => allProductIds.add(item.productId));
        });
        const productPromises = Array.from(allProductIds).map(id => getProductById(id));
        const products = await Promise.all(productPromises);
        const productMap = {};
        products.forEach(res => {
          if (res.status === 200) {
            productMap[res.data.id] = res.data;
          }
        });
        setProductDetails(productMap);
      } else {
        toast.error('Không thể tải danh sách đơn hàng');
      }
    } catch (error) {
      toast.error('Lỗi hệ thống. Vui lòng thử lại.');
      console.error('Fetch orders error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
    if (filter === 'Tất cả') {
      setFilteredOrders(orders);
    } else {
      const statusKey = Object.keys(statusMap).find(key => statusMap[key].label === filter);
      setFilteredOrders(orders.filter(order => order.status.toUpperCase() === statusKey));
    }
  };

  const toggleExpand = (orderId) => {
    setExpandedOrders(prev => ({ ...prev, [orderId]: !prev[orderId] }));
  };

  const handleDetailClick = async (orderId) => {
    try {
      const response = await getOrderById(orderId);
      if (response.status === 200) {
        setSelectedOrder(response.data);
        setIsDetailModalOpen(true);
      } else {
        toast.error('Không thể tải chi tiết đơn hàng');
      }
    } catch (error) {
      toast.error('Lỗi hệ thống. Vui lòng thử lại.');
      console.error('Fetch order detail error:', error);
    }
  };

  const handleCancelClick = (orderId) => {
    setOrderToCancel(orderId);
    setIsCancelModalOpen(true);
  };

  const handleCancelConfirm = async () => {
    if (!orderToCancel) return;
    try {
      const response = await cancelOrder(orderToCancel);
      if (response.status === 200) {
        toast.success('Hủy đơn hàng thành công');
        fetchOrders(); // Refresh danh sách đơn hàng
      } else {
        toast.error('Hủy đơn hàng thất bại');
      }
    } catch (error) {
      toast.error('Lỗi hệ thống. Vui lòng thử lại.');
      console.error('Cancel order error:', error);
    } finally {
      setIsCancelModalOpen(false);
      setOrderToCancel(null);
    }
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedOrder(null);
  };

  const closeCancelModal = () => {
    setIsCancelModalOpen(false);
    setOrderToCancel(null);
  };

  if (loading) {
    return <div className="text-center p-6 text-gray-700">Đang tải danh sách đơn hàng...</div>;
  }

  return (
    <div className="p-6">
      <Toaster position="top-center" reverseOrder={false} />
      <h2 className="text-2xl font-bold text-black mb-4">Danh sách đơn hàng</h2>
      <hr className="border-gray-300 mb-4" />
      
      {/* Bộ lọc trạng thái */}
      <div className="flex flex-wrap gap-2 mb-6">
        {filters.map(filter => (
          <button
            key={filter}
            onClick={() => handleFilterClick(filter)}
            className={`px-4 py-2 rounded-md transition ${
              activeFilter === filter
                ? 'bg-blue-100 text-blue-700 border-blue-700'
                : 'bg-white text-black border-gray-300 hover:bg-blue-50'
            } border`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* List đơn hàng */}
      <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 sidebar-scrollbar">
        {filteredOrders.length > 0 ? (
          filteredOrders.map(order => {
            const isExpanded = expandedOrders[order.id];
            const displayItems = isExpanded ? order.orderItems : order.orderItems.slice(0, 2);
            const status = statusMap[order.status.toUpperCase()] || { label: order.status, color: 'bg-gray-500' };
            const canCancel = ['PENDING', 'CONFIRMED'].includes(order.status.toUpperCase());

            return (
              <div key={order.id} className="bg-white border border-gray-300 rounded-lg shadow-md p-4">
                {/* Header card */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="font-semibold">Mã đơn hàng: <span className="font-bold">#{order.id}</span></p>
                    <p className="text-gray-600">{order.orderDateFormatted || new Date(order.orderDate).toLocaleDateString('vi-VN')}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-white font-bold ${status.color}`}>
                    {status.label}
                  </span>
                </div>

                {/* Sản phẩm */}
                <div className="space-y-4 mb-4">
                  {displayItems.map((item, index) => {
                    const product = productDetails[item.productId];
                    if (!product) return null;
                    const mainImage = product.images?.find(img => img.main) || product.images?.[0];

                    return (
                      <div key={index} className="flex gap-4">
                        <img
                          src={`${import.meta.env.VITE_IMAGE_BASE_URL}${mainImage?.imageUrl}`}
                          alt={product.name}
                          className="w-20 h-20 object-cover rounded-md"
                        />
                        <div className="flex-1">
                          <p className="font-medium line-clamp-2">{product.name}</p>
                          <p className="text-gray-600">Số lượng: x{item.quantity}</p>
                          <p className="text-gray-600">
                            Giá: <span className="line-through">{product.priceFormatted} VNĐ</span>{' '}
                            <span className="text-red-500">{item.priceAtPurchaseFormatted} VNĐ</span>
                          </p>
                        </div>
                      </div>
                    );
                  })}

                  {order.orderItems.length > 2 && (
                    <button
                      onClick={() => toggleExpand(order.id)}
                      className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mx-auto"
                    >
                      {isExpanded ? (
                        <>
                          <FaArrowUp /> Thu gọn
                        </>
                      ) : (
                        <>
                          <FaArrowDown /> Xem thêm
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Footer card */}
                <div className="flex justify-between items-center">
                  <p className="font-medium">
                    Tổng tiền: <span className="text-red-500">{order.totalAmountFormatted} VNĐ</span>
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDetailClick(order.id)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600"
                    >
                      Chi tiết
                    </button>
                    <button
                      onClick={() => handleCancelClick(order.id)}
                      disabled={!canCancel}
                      className={`px-4 py-2 rounded-full text-white ${
                        canCancel ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-400 cursor-not-allowed'
                      }`}
                    >
                      Hủy đơn
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center text-gray-600">Không có đơn hàng nào</div>
        )}
      </div>

      {/* Modal chi tiết đơn hàng */}
      {isDetailModalOpen && selectedOrder && (
        <OrderDetailModal order={selectedOrder} onClose={closeDetailModal} productDetails={productDetails} user={user} />
      )}

      {/* Modal xác nhận hủy đơn */}
      {isCancelModalOpen && (
        <CancelOrderModal
          isOpen={isCancelModalOpen}
          onClose={closeCancelModal}
          onConfirm={handleCancelConfirm}
          orderId={orderToCancel}
        />
      )}
    </div>
  );
};

export default OrderTab;