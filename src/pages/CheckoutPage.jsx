import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { orderService } from '../services/order';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const CheckoutPage = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    address: user?.address || '',
    phone_number: user?.phone_number || '',
    notes: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Get the cart ID from localStorage or context
      const cartId = localStorage.getItem('cart_id');
      if (!cartId) {
        toast.error('Cart not found');
        return;
      }
      
      // Create order
      const orderData = {
        cart_id: cartId,
        address: formData.address,
        phone_number: formData.phone_number,
        notes: formData.notes,
      };
      
      await orderService.create(orderData);
      await clearCart();
      toast.success('Order placed successfully!');
      navigate('/orders');
    } catch (error) {
      console.error('Checkout error:', error);
      if (error.response?.data) {
        const errData = error.response.data;
        if (typeof errData === 'object') {
          const msgs = Object.values(errData).flat().join(' ');
          toast.error(msgs || 'Failed to place order');
        } else {
          toast.error(errData);
        }
      } else {
        toast.error('Failed to place order');
      }
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  name="full_name"
                  required
                  value={`${user?.first_name || ''} ${user?.last_name || ''}`}
                  className="input-field bg-gray-50"
                  readOnly
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={user?.email || ''}
                  className="input-field bg-gray-50"
                  readOnly
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-1">Address *</label>
                <input
                  type="text"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="123 Main St, City, State, ZIP"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  name="phone_number"
                  required
                  value={formData.phone_number}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="+1234567890"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-1">Order Notes (Optional)</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="3"
                  className="input-field"
                  placeholder="Special instructions for delivery..."
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary mt-6 disabled:opacity-50"
            >
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </form>
        </div>
        
        <div>
          <div className="bg-gray-50 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between mb-2 pb-2 border-b">
                <div>
                  <span className="font-medium">{item.product?.name}</span>
                  <span className="text-sm text-gray-500 block">Qty: {item.quantity}</span>
                </div>
                <span className="font-semibold">
                  ${(item.product?.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span className="text-blue-600">${cartTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;