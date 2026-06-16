import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { productService } from '../services/product';
import { categoryService } from '../services/category';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const { addToCart } = useCart();
  
  const categoryId = searchParams.get('category');
  const search = searchParams.get('search');

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [categoryId, search]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (categoryId) params.category = categoryId;
      if (search) params.search = search;
      
      const data = await productService.getAll(params);
      const productsData = data.results || data;
      
      // Normalize products for display
      productsData.forEach(product => {
        product.display_image = product.main_image || (product.images?.[0]?.image) || product.images?.[0] || null;
        product.in_stock = product.stock > 0;
      });
      
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data.results || data);
    } catch (error) {
      console.error('Error fetching categories:', error);
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">All Products</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white p-4 rounded-lg shadow-md sticky top-20">
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <div className="space-y-2">
              <Link to="/products" className="block text-gray-600 hover:text-blue-600">
                All Products
              </Link>
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/products?category=${category.id}`}
                  className={`block text-gray-600 hover:text-blue-600 ${
                    categoryId == category.id ? 'text-blue-600 font-semibold' : ''
                  }`}
                >
                  {category.name} <span className="text-xs text-gray-400">({category.product_count})</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-3">
          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No products found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
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
                    <h3 className="text-lg font-semibold mb-1 group-hover:text-blue-600">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xl font-bold text-blue-600">${product.price}</p>
                        {product.price_with_tax && (
                          <p className="text-xs text-gray-500">With tax: ${product.price_with_tax}</p>
                        )}
                      </div>
                      {product.in_stock && (
                        <span className="text-xs text-green-500">In Stock</span>
                      )}
                    </div>
                  </Link>
                  <button
                    onClick={() => handleAddToCart(product.id)}
                    disabled={!product.in_stock}
                    className={`w-full mt-3 btn-primary ${!product.in_stock ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {product.in_stock ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductListPage;