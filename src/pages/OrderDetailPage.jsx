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
    const fetch = async () => {
      try {
        const data = await orderService.getById(id);
        setOrder(data);
      } catch { toast.error('Order not found'); navigate('/orders'); } finally { setLoading(false); }
    };
    fetch();
  }, [id]);

  const cancel = async () => {
    if (!window.confirm('Cancel order?')) return;
    try {
      await orderService.cancel(id);
      toast.success('Cancelled');
      const data = await orderService.getById(id);
      setOrder(data);
    } catch { toast.error('Failed'); }
  };

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;
  if (!order) return <div className="text-center py-12">Not found</div>;

  return (
    <div className="container mx-auto px-6 py-12">
      <button onClick={() => navigate('/orders')} className="text-[#b8a28c] hover:underline mb-4">← Back</button>
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="flex flex-wrap justify-between items-center mb-6">
          <h1 className="text-2xl font-heading">Order #{order.id}</h1>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${order.status === 'Canceled' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>{order.status}</span>
        </div>
        <div className="border-t py-4">
          {order.items?.map(item => (
            <div key={item.id} className="flex justify-between items-center py-2 border-b">
              <div><span className="font-medium">{item.product?.name}</span> <span className="text-gray-500">x{item.quantity}</span></div>
              <span>${item.total_price}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-end text-lg font-bold mt-4">Total: ${order.total_price}</div>
        {order.status === 'Not Paid' && <button onClick={cancel} className="mt-4 text-red-500 hover:underline">Cancel Order</button>}
      </div>
    </div>
  );
};

export default OrderDetailPage;