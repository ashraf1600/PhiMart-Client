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
  const [form, setForm] = useState({
    address: user?.address || '',
    phone: user?.phone_number || '',
    city: '',
    zip: '',
    country: 'United States',
    state: '',
  });

  if (cartItems.length === 0) { navigate('/cart'); return null; }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const cartId = localStorage.getItem('cart_id');
      if (!cartId) { toast.error('Cart not found'); return; }
      await orderService.create({ cart_id: cartId });
      await clearCart();
      toast.success('Order placed!');
      navigate('/orders');
    } catch { toast.error('Failed'); } finally { setLoading(false); }
  };

  const subtotal = cartTotal;
  const shipping = subtotal > 50 ? 0 : 5;
  const tax = subtotal * 0.2;
  const total = subtotal + shipping + tax;

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-3xl font-heading mb-8">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-heading mb-4">Contact information</h2>
            <div className="mb-4"><label className="block text-sm font-medium">Email address</label><input type="email" value={user?.email || ''} className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50" readOnly /></div>
            <h2 className="text-xl font-heading mt-6 mb-4">Shipping information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium">First name</label><input type="text" value={user?.first_name || ''} className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50" readOnly /></div>
              <div><label className="block text-sm font-medium">Last name</label><input type="text" value={user?.last_name || ''} className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50" readOnly /></div>
            </div>
            <div className="mt-4"><label className="block text-sm font-medium">Address</label><input type="text" name="address" value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-3" required /></div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div><label className="block text-sm font-medium">City</label><input type="text" name="city" value={form.city} onChange={e => setForm({...form, city: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-3" /></div>
              <div><label className="block text-sm font-medium">Postal code</label><input type="text" name="zip" value={form.zip} onChange={e => setForm({...form, zip: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-3" /></div>
            </div>
            <div className="mt-4"><label className="block text-sm font-medium">Phone</label><input type="tel" name="phone" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-3" required /></div>
            <h2 className="text-xl font-heading mt-6 mb-4">Payment</h2>
            <div className="space-y-2">
              <label className="block"><input type="radio" name="payment" defaultChecked /> Credit card</label>
              <label className="block"><input type="radio" name="payment" /> PayPal</label>
              <label className="block"><input type="radio" name="payment" /> eTransfer</label>
            </div>
            <div className="mt-4"><label className="block text-sm font-medium">Card number</label><input type="text" placeholder="1234 5678 9012 3456" className="w-full border border-gray-300 rounded-lg px-4 py-3" /></div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div><label className="block text-sm font-medium">Name on card</label><input type="text" className="w-full border border-gray-300 rounded-lg px-4 py-3" /></div>
              <div><label className="block text-sm font-medium">Expiration (MM/YY)</label><input type="text" className="w-full border border-gray-300 rounded-lg px-4 py-3" /></div>
            </div>
            <button type="submit" disabled={loading} className="mt-8 w-full bg-[#1a1a1a] text-white py-3 rounded-full hover:bg-[#b8a28c] transition">Confirm Order</button>
          </form>
        </div>
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-sm sticky top-20">
            <h2 className="text-xl font-heading mb-4">Order summary</h2>
            {cartItems.map(item => (
              <div key={item.id} className="flex justify-between text-sm py-2 border-b">
                <span>{item.product?.name} <span className="text-gray-400">x{item.quantity}</span></span>
                <span>${(item.product?.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="mt-4 space-y-1 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>${shipping.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Taxes</span><span>${tax.toFixed(2)}</span></div>
              <div className="border-t pt-2 mt-2 font-bold text-lg flex justify-between"><span>Total</span><span>${total.toFixed(2)}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;