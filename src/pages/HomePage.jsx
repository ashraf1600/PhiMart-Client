import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../services/product';
import { categoryService } from '../services/category';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const HomePage = () => {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [slideImages, setSlideImages] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [products, cats] = await Promise.all([
          productService.getAll(),
          categoryService.getAll()
        ]);
        const items = products.results || products;
        items.forEach(p => {
          p.display_image = p.main_image || p.images?.[0]?.image || null;
          p.in_stock = p.stock > 0;
        });
        setFeatured(items.slice(0, 6));
        setCategories((cats.results || cats).slice(0, 4));

        const images = items
          .map(p => p.display_image)
          .filter(url => url)
          .slice(0, 10);
        if (images.length === 0) {
          setSlideImages([
            'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=1200&h=600&fit=crop',
            'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&h=600&fit=crop',
            'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=1200&h=600&fit=crop',
            'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&h=600&fit=crop',
          ]);
        } else {
          setSlideImages(images);
        }
      } catch (e) {
        console.error(e);
        setSlideImages([
          'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=1200&h=600&fit=crop',
          'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&h=600&fit=crop',
          'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=1200&h=600&fit=crop',
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Slide every 4 seconds
  useEffect(() => {
    if (slideImages.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [slideImages]);

  const add = async (id) => {
    try {
      await addToCart(id, 1);
      toast.success('Added to cart');
    } catch {
      toast.error('Failed');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div>
      {/* Hero Section with Full Background Slideshow - Smaller height */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center overflow-hidden">
        {/* Background slideshow */}
        <div className="absolute inset-0 w-full h-full">
          {slideImages.map((url, index) => (
            <div
              key={index}
              className="absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out bg-cover bg-center"
              style={{
                backgroundImage: `url(${url})`,
                opacity: index === currentSlide ? 1 : 0,
              }}
            />
          ))}
          {/* Dark overlay for readability */}
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-6 text-center md:text-left">
          <div className="max-w-3xl mx-auto md:mx-0 text-white">
            <span className="inline-block bg-[#b8a28c] text-white text-xs uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
              New Collection
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold leading-tight">
              Discover the Best Fashion Collection
            </h1>
            <p className="text-base md:text-lg opacity-90 mt-2">The High-Quality Collection</p>
            <div className="mt-6 flex flex-wrap gap-4 justify-center md:justify-start">
              <Link to="/products" className="btn-primary bg-white text-[#1a1a1a] hover:bg-[#b8a28c] hover:text-white border-0 transition">
                Shop Now
              </Link>
              <Link to="/products" className="btn-secondary border-white text-white hover:bg-white hover:text-[#1a1a1a] transition">
                See Collection
              </Link>
            </div>
          </div>
        </div>

        {/* Slide indicators */}
        {slideImages.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
            {slideImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  idx === currentSlide ? 'bg-white w-6' : 'bg-white/50'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </section>

      {/* Categories */}
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-heading text-center mb-12">Our Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.id}`}
              className="category-card group"
            >
              <img
                src={`https://picsum.photos/seed/${cat.id}/400/400`}
                alt={cat.name}
              />
              <div className="overlay">
                <span>{cat.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-6 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-heading">Our Collection</h2>
          <Link to="/products" className="text-sm text-[#b8a28c] hover:underline">
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featured.map((product) => (
            <div key={product.id} className="product-card group">
              <Link to={`/products/${product.id}`}>
                <div className="relative overflow-hidden">
                  {product.display_image ? (
                    <img src={product.display_image} alt={product.name} />
                  ) : (
                    <div className="w-full h-64 bg-gray-200 flex items-center justify-center text-4xl">
                      👕
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-heading text-lg font-semibold truncate">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500">{product.category_name}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xl font-bold">${product.price}</span>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        add(product.id);
                      }}
                      className="bg-[#1a1a1a] text-white px-4 py-1.5 rounded-full text-sm hover:bg-[#b8a28c] transition"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;