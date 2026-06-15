import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderService } from '../services/order';
import toast from 'react-hot-toast';

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      const data = await orderService.getById(id);
      setOrder(data);
    } catch (error) {
      console.error('Error fetching order:', error);
      toast.error('Order not found');
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await orderService.cancel(id);
        toast.success('Order cancelled successfully');
        fetchOrderDetails();
      } catch (error) {
        toast.error('Failed to cancel order');
      }
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'processing': 'bg-blue-100 text-blue-800',
      'shipped': 'bg-purple-100 text-purple-800',
      'delivered': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800',
    };
    return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (!order) {
    return <div className="text-center py-12">Order not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <button onClick={() => navigate('/orders')} className="text-blue-600 hover:underline">
          ← Back to Orders
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">Order #{order.id}</h1>
            <p className="text-gray-600">Placed on {new Date(order.created_at).toLocaleDateString()}</p>
          </div>
          <div className="text-right">
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
              {order.status || 'Pending'}
            </span>
            {order.status?.toLowerCase() === 'pending' && (
              <button
                onClick={handleCancelOrder}
                className="block mt-2 text-red-600 text-sm hover:text-red-700"
              >
                Cancel Order
              </button>
            )}
          </div>
        </div>
        
        <div className="border-t pt-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Order Items</h2>
          <div className="space-y-4">
            {order.items?.map((item) => (
              <div key={item.id} className="flex justify-between items-center border-b pb-4">
                <div>
                  <p className="font-semibold">{item.product?.name}</p>
                  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                </div>
                <p className="font-semibold">${item.price}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="border-t pt-6">
          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold">Subtotal:</span>
            <span>${order.total_amount}</span>
          </div>
          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold">Shipping:</span>
            <span>{order.total_amount > 50 ? 'Free' : '$5.00'}</span>
          </div>
          <div className="flex justify-between items-center text-xl font-bold pt-4 border-t">
            <span>Total:</span>
            <span className="text-blue-600">${order.total_amount}</span>
          </div>
        </div>
        
        <div className="border-t mt-6 pt-6">
          <h3 className="font-semibold mb-2">Shipping Address</h3>
          <p className="text-gray-600">{order.shipping_address}</p>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;