import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../services/product';
import { categoryService } from '../services/category';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      const [products, cats] = await Promise.all([
        productService.getAll(),
        categoryService.getAll()
      ]);
      
      const productsData = products.results || products;
      productsData.forEach(product => {
        product.display_image = product.main_image || (product.images?.[0]?.image) || product.images?.[0] || null;
        product.in_stock = product.stock > 0;
      });
      
      setFeaturedProducts(productsData.slice(0, 8));
      setCategories(cats.results || cats);
    } catch (error) {
      console.error('Error fetching home data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      await addToCart(productId, 1);
      toast.success('Added to cart!');
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">Welcome to PhiMart</h1>
            <p className="text-xl mb-8">Your Ultimate E-commerce Destination</p>
            <Link to="/products" className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition">
              Shop Now
            </Link>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-8">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.slice(0, 4).map((category) => (
            <Link 
              key={category.id} 
              to={`/products?category=${category.id}`} 
              className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition hover:scale-105"
            >
              <div className="text-4xl mb-2">📦</div>
              <h3 className="text-lg font-semibold">{category.name}</h3>
              <p className="text-sm text-gray-500">{category.product_count} products</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-8">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <div key={product.id} className="card group">
              <Link to={`/products/${product.id}`}>
                <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center overflow-hidden relative">
                  {product.display_image ? (
                    <img 
                      src={product.display_image} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="%23999999"%3E%3Crect x="2" y="2" width="20" height="20" rx="2"%3E%3C/rect%3E%3Cpath d="M7 2v20M17 2v20M2 12h20"%3E%3C/path%3E%3C/svg%3E';
                      }}
                    />
                  ) : (
                    <div className="text-6xl">📦</div>
                  )}
                  {product.in_stock === false && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs">
                      Out of Stock
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-semibold mb-1 group-hover:text-blue-600">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
                <p className="text-xl font-bold text-blue-600 mb-2">${product.price}</p>
              </Link>
              <button
                onClick={() => handleAddToCart(product.id)}
                disabled={!product.in_stock}
                className={`w-full btn-primary ${!product.in_stock ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {product.in_stock ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-2">🚚</div>
              <h3 className="text-xl font-bold mb-2">Free Shipping</h3>
              <p className="text-gray-600">On orders over $50</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">🔄</div>
              <h3 className="text-xl font-bold mb-2">30-Day Returns</h3>
              <p className="text-gray-600">Hassle-free returns</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">💳</div>
              <h3 className="text-xl font-bold mb-2">Secure Payment</h3>
              <p className="text-gray-600">100% secure transactions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;