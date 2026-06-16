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
      'Not Paid': 'bg-yellow-100 text-yellow-800',
      'Ready to Ship': 'bg-blue-100 text-blue-800',
      'Shipped': 'bg-purple-100 text-purple-800',
      'Delivered': 'bg-green-100 text-green-800',
      'Canceled': 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusBadge = (status) => {
    const icons = {
      'Not Paid': '⏳',
      'Ready to Ship': '📦',
      'Shipped': '🚚',
      'Delivered': '✅',
      'Canceled': '❌',
    };
    return icons[status] || '📋';
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (!order) {
    return <div className="text-center py-12">Order not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button onClick={() => navigate('/orders')} className="text-blue-600 hover:underline mb-4 inline-block">
        ← Back to Orders
      </button>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Order #{order.id}</h1>
            <p className="text-gray-600">Placed on {new Date(order.created_at).toLocaleDateString()}</p>
            <p className="text-gray-600">At {new Date(order.created_at).toLocaleTimeString()}</p>
          </div>
          <div className="mt-2 md:mt-0 text-right">
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
              {getStatusBadge(order.status)} {order.status || 'Not Paid'}
            </span>
            {order.status === 'Not Paid' && (
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
                  <p className="text-sm text-gray-600">Unit Price: ${item.price}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-blue-600">${item.total_price || (item.price * item.quantity)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="border-t pt-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Subtotal:</span>
            <span>${order.total_price}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Shipping:</span>
            <span>{order.total_price > 50 ? 'Free' : '$5.00'}</span>
          </div>
          <div className="flex justify-between items-center text-xl font-bold pt-4 border-t mt-4">
            <span>Total:</span>
            <span className="text-blue-600">${order.total_price}</span>
          </div>
        </div>
        
        <div className="border-t mt-6 pt-6">
          <h3 className="font-semibold mb-2">Shipping Address</h3>
          <p className="text-gray-600">{order.address || order.shipping_address || 'No address provided'}</p>
          {order.phone_number && (
            <p className="text-gray-600 mt-1">📞 {order.phone_number}</p>
          )}
          {order.notes && (
            <div className="mt-4">
              <h4 className="font-semibold mb-1">Order Notes</h4>
              <p className="text-gray-600">{order.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;