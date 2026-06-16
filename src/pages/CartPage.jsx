import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const CartPage = () => {
  const { cartItems, cartTotal, updateCartItem, removeCartItem, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const updateQty = async (id, qty) => {
    if (qty < 1) return removeItem(id);
    await updateCartItem(id, qty);
    toast.success('Updated');
  };
  const removeItem = async (id) => {
    await removeCartItem(id);
    toast.success('Removed');
  };
  const checkout = () => {
    if (!user) { toast.error('Please login'); navigate('/login'); } else navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-6 py-16 text-center">
        <h2 className="text-3xl font-heading mb-4">Your cart is empty</h2>
        <Link to="/products" className="btn-primary">Continue Shopping</Link>
      </div>
    );
  }

  const subtotal = cartTotal;
  const shipping = subtotal > 50 ? 0 : 5;
  const tax = subtotal * 0.2;
  const total = subtotal + shipping + tax;

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-3xl font-heading mb-8">Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {cartItems.map(item => (
            <div key={item.id} className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl shadow-sm mb-4">
              <div className="w-24 h-24 bg-gray-100 rounded flex items-center justify-center">
                {item.product?.images?.[0] ? (
                  <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover rounded" />
                ) : <span className="text-3xl">👕</span>}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{item.product?.name}</h3>
                <p className="text-sm text-gray-500">${item.product?.price}</p>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center border border-gray-300 rounded-full overflow-hidden">
                    <button onClick={() => updateQty(item.id, item.quantity - 1)} className="px-3 py-1 hover:bg-gray-100">-</button>
                    <span className="px-4 py-1 w-12 text-center">{item.quantity}</span>
                    <button onClick={() => updateQty(item.id, item.quantity + 1)} className="px-3 py-1 hover:bg-gray-100">+</button>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="text-sm text-red-500 hover:underline">Remove</button>
                </div>
              </div>
              <div className="text-right">
                <span className="font-bold">${(item.product?.price * item.quantity).toFixed(2)}</span>
                <div className="text-sm text-green-500">{item.product?.stock > 0 ? 'In stock' : 'Out of stock'}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-sm sticky top-20">
            <h2 className="text-xl font-heading mb-4">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Shipping estimate</span><span>${shipping.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Tax estimate</span><span>${tax.toFixed(2)}</span></div>
              <div className="border-t pt-2 mt-2 font-bold text-lg flex justify-between"><span>Order total</span><span>${total.toFixed(2)}</span></div>
            </div>
            <button onClick={checkout} className="mt-6 w-full bg-[#1a1a1a] text-white py-3 rounded-full hover:bg-[#b8a28c] transition">Checkout</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;