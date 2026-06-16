import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '../services/order';
import toast from 'react-hot-toast';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await orderService.getAll();
        setOrders(data.results || data || []);
      } catch { toast.error('Failed to load orders'); } finally { setLoading(false); }
    };
    fetch();
  }, []);

  const statusColor = (s) => {
    const map = {
      'Not Paid': 'bg-yellow-100 text-yellow-800',
      'Ready to Ship': 'bg-blue-100 text-blue-800',
      'Shipped': 'bg-purple-100 text-purple-800',
      'Delivered': 'bg-green-100 text-green-800',
      'Canceled': 'bg-red-100 text-red-800',
    };
    return map[s] || 'bg-gray-100';
  };

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-3xl font-heading mb-8">Order History</h1>
      {orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No orders yet.</p>
          <Link to="/products" className="btn-primary mt-4 inline-block">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(o => (
            <div key={o.id} className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex flex-wrap justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Order #{o.id.slice(0,8)}</p>
                  <p className="text-sm text-gray-500">{new Date(o.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor(o.status)}`}>{o.status}</span>
                  <span className="font-bold">${o.total_price}</span>
                  <Link to={`/orders/${o.id}`} className="text-[#b8a28c] hover:underline text-sm">View</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;