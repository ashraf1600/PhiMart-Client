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

  // Robust image URL extraction
  const getProductImage = (product) => {
    if (!product) return null;

    // Debug log to see what we have (remove after debugging)
    console.log('Product object:', product);

    // 1. Check main_image
    if (product.main_image) {
      return product.main_image;
    }

    // 2. Check images array
    if (product.images && product.images.length > 0) {
      const first = product.images[0];
      if (typeof first === 'string') return first;
      if (first.image) return first.image;
      if (first.url) return first.url;
    }

    // 3. Check image field
    if (product.image) {
      if (typeof product.image === 'string') return product.image;
      if (product.image.url) return product.image.url;
    }

    // 4. Check if product has a nested image_url (from some serializers)
    if (product.image_url) return product.image_url;

    return null;
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
          {cartItems.map(item => {
            const product = item.product;
            const imageUrl = getProductImage(product);
            return (
              <div key={item.id} className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl shadow-sm mb-4">
                <div className="w-24 h-24 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                  {imageUrl ? (
                    <img 
                      src={imageUrl} 
                      alt={product?.name || 'Product'} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="%23999999"%3E%3Crect x="2" y="2" width="20" height="20" rx="2"%3E%3C/rect%3E%3Cpath d="M7 2v20M17 2v20M2 12h20"%3E%3C/path%3E%3C/svg%3E';
                      }}
                    />
                  ) : (
                    <span className="text-3xl">👕</span>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{product?.name || 'Product'}</h3>
                  <p className="text-sm text-gray-500">${product?.price}</p>
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
                  <span className="font-bold">${(product?.price * item.quantity).toFixed(2)}</span>
                  <div className="text-sm text-green-500">{product?.stock > 0 ? 'In stock' : 'Out of stock'}</div>
                </div>
              </div>
            );
          })}
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