import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const WishlistPage = () => {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = async (product) => {
    try {
      await addToCart(product.id, 1);
      toast.success('Added to cart');
    } catch {
      toast.error('Failed to add');
    }
  };

  if (wishlist.length === 0) {
    return (
      <div className="container mx-auto px-6 py-16 text-center">
        <h2 className="text-3xl font-heading mb-4">Your Wishlist is Empty</h2>
        <p className="text-gray-500 mb-6">Start adding your favorite items!</p>
        <Link to="/products" className="btn-primary">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-heading">My Wishlist</h1>
        <button onClick={clearWishlist} className="text-sm text-red-500 hover:underline">
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlist.map((product) => (
          <div key={product.id} className="product-card group">
            <Link to={`/products/${product.id}`}>
              <div className="relative overflow-hidden">
                {product.display_image ? (
                  <img src={product.display_image} alt={product.name} />
                ) : (
                  <div className="w-full h-64 bg-gray-200 flex items-center justify-center text-4xl">👕</div>
                )}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    removeFromWishlist(product.id);
                  }}
                  className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:scale-110 transition"
                >
                  ❤️
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-heading text-lg font-semibold truncate">{product.name}</h3>
                <p className="text-sm text-gray-500">{product.category_name}</p>
                <p className="text-xl font-bold mt-2">${product.price}</p>
              </div>
            </Link>
            <div className="px-4 pb-4">
              <button
                onClick={() => handleAddToCart(product)}
                className="w-full bg-[#1a1a1a] text-white py-2 rounded-full text-sm hover:bg-[#b8a28c] transition"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;