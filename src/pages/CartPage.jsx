import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const CartPage = () => {
  const { cartItems, cartTotal, updateCartItem, removeCartItem, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleUpdateQuantity = async (itemId, currentQuantity, newQuantity) => {
    if (newQuantity < 1) {
      await handleRemoveItem(itemId);
    } else {
      await updateCartItem(itemId, newQuantity);
      toast.success('Cart updated');
    }
  };

  const handleRemoveItem = async (itemId) => {
    await removeCartItem(itemId);
    toast.success('Item removed from cart');
  };

  const handleCheckout = () => {
    if (!user) {
      toast.error('Please login to checkout');
      navigate('/login');
    } else {
      navigate('/checkout');
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your entire cart?')) {
      await clearCart();
      toast.success('Cart cleared');
    }
  };

  // Calculate shipping
  const shippingCost = cartTotal > 50 ? 0 : 5;
  const finalTotal = cartTotal + shippingCost;

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <p className="text-gray-600 mb-8">Looks like you haven't added any items yet.</p>
        <Link to="/products" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition inline-block">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="hidden md:grid md:grid-cols-12 gap-4 bg-gray-50 px-6 py-3 font-semibold text-gray-700">
              <div className="md:col-span-6">Product</div>
              <div className="md:col-span-2 text-center">Price</div>
              <div className="md:col-span-2 text-center">Quantity</div>
              <div className="md:col-span-2 text-right">Total</div>
            </div>
            
            {cartItems.map((item) => (
              <div key={item.id} className="border-t md:border-t-0 first:border-t-0 px-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  {/* Product Info */}
                  <div className="md:col-span-6">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                        {item.product?.images && item.product.images[0] ? (
                          <img src={item.product.images[0].image} alt={item.product.name} className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          <span className="text-3xl">📦</span>
                        )}
                      </div>
                      <div>
                        <Link to={`/products/${item.product.id}`} className="font-semibold text-gray-800 hover:text-blue-600">
                          {item.product.name}
                        </Link>
                        {item.product.description && (
                          <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                            {item.product.description.substring(0, 60)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Price */}
                  <div className="md:col-span-2 text-left md:text-center">
                    <span className="md:hidden font-semibold text-gray-600 mr-2">Price:</span>
                    <span className="text-gray-800">${item.product?.price?.toFixed(2)}</span>
                  </div>
                  
                  {/* Quantity */}
                  <div className="md:col-span-2">
                    <div className="flex items-center justify-start md:justify-center gap-2">
                      <span className="md:hidden font-semibold text-gray-600 mr-2">Qty:</span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity, item.quantity - 1)}
                        className="w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300 transition flex items-center justify-center font-bold"
                      >
                        -
                      </button>
                      <span className="w-12 text-center font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity, item.quantity + 1)}
                        className="w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300 transition flex items-center justify-center font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  {/* Total */}
                  <div className="md:col-span-2 text-left md:text-right">
                    <div className="flex justify-between md:block">
                      <span className="md:hidden font-semibold text-gray-600">Total:</span>
                      <span className="font-bold text-blue-600">
                        ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-red-600 text-sm hover:text-red-700 mt-1 md:mt-2"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 flex justify-between items-center">
            <Link to="/products" className="text-blue-600 hover:underline">
              ← Continue Shopping
            </Link>
            <button onClick={handleClearCart} className="text-red-600 hover:text-red-700">
              Clear Cart
            </button>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-semibold">${cartTotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping:</span>
                <span className="font-semibold">
                  {shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}
                </span>
              </div>
              
              {shippingCost > 0 && cartTotal < 50 && (
                <div className="text-sm text-gray-500">
                  Add ${(50 - cartTotal).toFixed(2)} more for free shipping!
                </div>
              )}
              
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between">
                  <span className="text-lg font-bold">Total:</span>
                  <span className="text-xl font-bold text-blue-600">
                    ${finalTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
            
            <button
              onClick={handleCheckout}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              Proceed to Checkout
            </button>
            
            <div className="mt-4 text-center text-sm text-gray-500">
              <p>✓ Secure checkout</p>
              <p>✓ Free returns within 30 days</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;