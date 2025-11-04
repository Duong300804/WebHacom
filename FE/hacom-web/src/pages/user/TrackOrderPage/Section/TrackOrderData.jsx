import React, { useState } from 'react';
import TrackOrderBreadcrumb from './TrackOrderBreadcrumb';
import TrackOrderTab from './TrackOrderTab';
import TrackOrderContent from './TrackOrderContent';
import LoadingTrackOrderModal from '../Modals/LoadingTrackOrderModal';
import OrderDetailModal from '../Modals/OrderDetailModal';
import TrackOrderNotFoundModal from '../Modals/TrackOrderNotFoundModal';
import { trackOrder } from '../../../../api/APIs/orderApi';
import { toast } from 'react-hot-toast';

const TrackOrderData = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [phone, setPhone] = useState('');
  const [orderId, setOrderId] = useState('');
  const [isLoadingModalOpen, setIsLoadingModalOpen] = useState(false);
  const [isOrderDetailModalOpen, setIsOrderDetailModalOpen] = useState(false);
  const [isNotFoundModalOpen, setIsNotFoundModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [productDetails, setProductDetails] = useState({}); 
  const [user, setUser] = useState({}); 
  const handleSearch = async () => {
    if (!phone.trim() || !orderId.trim()) {
      toast.error('Vui lòng nhập đủ thông tin');
      return;
    }

    setIsLoadingModalOpen(true);
    try {
      const response = await trackOrder({ orderId: parseInt(orderId), phone });
      if (response.status === 200 && response.data) {
        setSelectedOrder(response.data);
        setIsOrderDetailModalOpen(true);
      } else {
        setIsNotFoundModalOpen(true);
      }
    } catch (error) {
      console.error('Lỗi tra cứu đơn hàng:', error);
      setIsNotFoundModalOpen(true);
    }
    setIsLoadingModalOpen(false);
  };

  return (
    <div className="bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4">
        <TrackOrderBreadcrumb />
        <TrackOrderTab
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          phone={phone}
          setPhone={setPhone}
          orderId={orderId}
          setOrderId={setOrderId}
          onSearch={handleSearch}
        />
        <TrackOrderContent />
      </div>

      {/* Modals */}
      <LoadingTrackOrderModal
        isOpen={isLoadingModalOpen}
        onClose={() => setIsLoadingModalOpen(false)}
      />
      <OrderDetailModal
        isOpen={isOrderDetailModalOpen}
        onClose={() => setIsOrderDetailModalOpen(false)}
        order={selectedOrder}
        productDetails={productDetails}
        user={user}
      />
      <TrackOrderNotFoundModal
        isOpen={isNotFoundModalOpen}
        onClose={() => setIsNotFoundModalOpen(false)}
      />
    </div>
  );
};

export default TrackOrderData;