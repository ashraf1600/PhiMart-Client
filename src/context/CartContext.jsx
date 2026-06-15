import React, { createContext, useState, useContext, useEffect } from 'react';
import { cartService } from '../services/cart';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadOrCreateCart();
    } else {
      resetCart();
    }
  }, [user]);

  const loadOrCreateCart = async () => {
    try {
      // GET /carts/ - returns list of user's carts
      const carts = await cartService.getUserCarts();
      
      if (carts && carts.length > 0) {
        // Use existing cart
        const existingCart = carts[0];
        setCart(existingCart);
        await loadCartItems(existingCart.id);
      } else {
        // Create new cart - POST /carts/
        const newCart = await cartService.createCart();
        setCart(newCart);
        setCartItems([]);
        setCartTotal(0);
        setCartItemsCount(0);
      }
    } catch (error) {
      console.error('Failed to load/create cart:', error);
    }
  };

  const loadCartItems = async (cartId) => {
    try {
      // GET /carts/{cartId}/items/
      const items = await cartService.getCartItems(cartId);
      const itemsArray = items.results || items || [];
      setCartItems(itemsArray);
      
      const total = itemsArray.reduce((sum, item) => sum + (item.product?.price * item.quantity || 0), 0);
      setCartTotal(total);
      
      const count = itemsArray.reduce((sum, item) => sum + item.quantity, 0);
      setCartItemsCount(count);
    } catch (error) {
      console.error('Failed to load cart items:', error);
    }
  };

  const resetCart = () => {
    setCart(null);
    setCartItems([]);
    setCartTotal(0);
    setCartItemsCount(0);
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      let currentCart = cart;
      
      if (!currentCart) {
        // Try to get existing cart
        const carts = await cartService.getUserCarts();
        if (carts && carts.length > 0) {
          currentCart = carts[0];
          setCart(currentCart);
        } else {
          // Create new cart
          currentCart = await cartService.createCart();
          setCart(currentCart);
        }
      }
      
      // POST /carts/{cartId}/items/
      await cartService.addItem(currentCart.id, productId, quantity);
      await loadCartItems(currentCart.id);
      toast.success('Added to cart!');
    } catch (error) {
      console.error('Failed to add to cart:', error);
      toast.error('Failed to add to cart');
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    try {
      // PATCH /carts/{cartId}/items/{itemId}/
      await cartService.updateItem(cart.id, itemId, quantity);
      await loadCartItems(cart.id);
      toast.success('Cart updated');
    } catch (error) {
      console.error('Failed to update cart:', error);
      toast.error('Failed to update cart');
    }
  };

  const removeCartItem = async (itemId) => {
    try {
      // DELETE /carts/{cartId}/items/{itemId}/
      await cartService.removeItem(cart.id, itemId);
      await loadCartItems(cart.id);
      toast.success('Item removed');
    } catch (error) {
      console.error('Failed to remove item:', error);
      toast.error('Failed to remove item');
    }
  };

  const clearCart = async () => {
    try {
      for (const item of cartItems) {
        await cartService.removeItem(cart.id, item.id);
      }
      await loadCartItems(cart.id);
      toast.success('Cart cleared');
    } catch (error) {
      console.error('Failed to clear cart:', error);
      toast.error('Failed to clear cart');
    }
  };

  return (
    <CartContext.Provider value={{
      cart,
      cartItems,
      cartTotal,
      cartItemsCount,
      addToCart,
      updateCartItem,
      removeCartItem,
      clearCart,
    }}>
      {children}
    </CartContext.Provider>
  );
};