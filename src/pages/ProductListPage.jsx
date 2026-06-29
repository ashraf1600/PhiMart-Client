import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { productService } from '../services/product';
import { categoryService } from '../services/category';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import toast from 'react-hot-toast';

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  // Filter states
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [searchTerm, setSearchTerm] = useState('');

  // Get filter params from URL
  const categoryId = searchParams.get('category');
  const search = searchParams.get('search');

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [categoryId, search]);

  useEffect(() => {
    // Apply client‑side filters and sorting whenever filters change
    applyFilters();
  }, [allProducts, categoryId, search, priceMin, priceMax, sortBy, searchTerm]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (categoryId) params.category = categoryId;
      if (search) params.search = search;

      const data = await productService.getAll(params);
      let items = data.results || data;

      // Normalize images and stock
      items.forEach(p => {
        p.display_image = p.main_image || p.images?.[0]?.image || null;
        p.in_stock = p.stock > 0;
      });

      setAllProducts(items);
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

  const applyFilters = () => {
    let filtered = [...allProducts];

    // Category filter (client‑side fallback)
    if (categoryId) {
      filtered = filtered.filter(p => p.category == categoryId);
    }

    // Search filter
    if (search) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Price range filter
    const min = parseFloat(priceMin);
    const max = parseFloat(priceMax);
    if (!isNaN(min)) {
      filtered = filtered.filter(p => p.price >= min);
    }
    if (!isNaN(max)) {
      filtered = filtered.filter(p => p.price <= max);
    }

    // Search term (additional local search)
    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // default: newest first (by id or created_at)
        break;
    }

    setProducts(filtered);
  };

  const handleAddToCart = async (productId) => {
    try {
      await addToCart(productId, 1);
      toast.success('Added to cart!');
    } catch {
      toast.error('Failed to add to cart');
    }
  };

  const clearFilters = () => {
    setPriceMin('');
    setPriceMax('');
    setSearchTerm('');
    setSortBy('default');
    setSearchParams({});
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-6 py-12">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center mb-8">
        <h1 className="text-3xl font-heading">Shop</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{products.length} products</span>
          <button
            onClick={clearFilters}
            className="text-sm text-[#b8a28c] hover:underline"
          >
            Clear Filters
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar with filters */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-sm sticky top-20 space-y-6">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search products..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-1 focus:ring-[#b8a28c] focus:outline-none"
              />
            </div>

            {/* Categories */}
            <div>
              <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-600 mb-2">Categories</h3>
              <div className="space-y-1">
                <Link
                  to="/products"
                  className={`block hover:text-[#b8a28c] ${!categoryId ? 'text-[#b8a28c] font-medium' : 'text-gray-600'}`}
                >
                  All
                </Link>
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/products?category=${cat.id}`}
                    className={`block hover:text-[#b8a28c] ${
                      categoryId == cat.id ? 'text-[#b8a28c] font-medium' : 'text-gray-600'
                    }`}
                  >
                    {cat.name} <span className="text-xs text-gray-400">({cat.product_count || 0})</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-600 mb-2">Price Range</h3>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={priceMin}
                  onChange={e => setPriceMin(e.target.value)}
                  placeholder="Min"
                  className="w-1/2 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-[#b8a28c] focus:outline-none"
                />
                <input
                  type="number"
                  value={priceMax}
                  onChange={e => setPriceMax(e.target.value)}
                  placeholder="Max"
                  className="w-1/2 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-[#b8a28c] focus:outline-none"
                />
              </div>
            </div>

            {/* Sort By */}
            <div>
              <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-600 mb-2">Sort By</h3>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-1 focus:ring-[#b8a28c] focus:outline-none"
              >
                <option value="default">Default</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name A-Z</option>
              </select>
            </div>

            {/* Gender filter (optional) – could be added if you have a gender field on products */}
            {/* You can add checkboxes for Men, Women, Kids if your API supports it */}
          </div>
        </div>

        {/* Products grid */}
        <div className="lg:col-span-3">
          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No products found matching your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product.id} className="product-card group">
                  <Link to={`/products/${product.id}`}>
                    <div className="relative overflow-hidden">
                      {product.display_image ? (
                        <img src={product.display_image} alt={product.name} />
                      ) : (
                        <div className="w-full h-64 bg-gray-200 flex items-center justify-center text-4xl">👕</div>
                      )}
                      {/* Stock badge */}
                      {product.in_stock ? (
                        <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                          In Stock
                        </span>
                      ) : (
                        <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                          Out of Stock
                        </span>
                      )}
                      {/* Wishlist heart */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleWishlist(product);
                        }}
                        className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:scale-110 transition"
                      >
                        {isInWishlist(product.id) ? '❤️' : '🤍'}
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
                      onClick={() => handleAddToCart(product.id)}
                      disabled={!product.in_stock}
                      className={`w-full py-2 rounded-full text-sm transition ${
                        product.in_stock
                          ? 'bg-[#1a1a1a] text-white hover:bg-[#b8a28c]'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {product.in_stock ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                  </div>
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