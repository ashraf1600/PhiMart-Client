import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { productService } from '../services/product';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [allImages, setAllImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5);
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    setLoading(true);
    try {
      const productData = await productService.getById(id);
      setProduct(productData);
      
      // Collect all images
      let images = [];
      
      // 1. Check images array from ProductImage model
      if (productData.images && productData.images.length > 0) {
        productData.images.forEach(img => {
          if (typeof img === 'string') {
            images.push(img);
          } else if (img.image) {
            images.push(img.image);
          }
        });
      }
      
      // 2. If no images, check main_image
      if (images.length === 0 && productData.main_image) {
        images = [productData.main_image];
      }
      
      // 3. If still no images, check image_url or image field
      if (images.length === 0 && productData.image_url) {
        images = [productData.image_url];
      }
      
      if (images.length === 0 && productData.image) {
        const img = typeof productData.image === 'string' ? productData.image : null;
        if (img) images = [img];
      }
      
      setAllImages(images);
      setSelectedImage(images.length > 0 ? images[0] : null);
      
      // Get reviews
      try {
        const reviewsData = await productService.getReviews(id);
        setReviews(reviewsData.results || reviewsData || []);
      } catch (e) {
        console.log('No reviews yet');
      }
      
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Product not found');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    try {
      await addToCart(product.id, quantity);
      toast.success(`Added ${quantity} item(s) to cart!`);
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to leave a review');
      navigate('/login');
      return;
    }

    if (!reviewText.trim()) {
      toast.error('Please write a comment');
      return;
    }

    try {
      await productService.addReview(product.id, rating, reviewText);
      toast.success('Review submitted!');
      setReviewText('');
      setRating(5);
      fetchProductDetails();
    } catch (error) {
      console.error('Review error:', error);
      let errorMsg = 'Failed to submit review';
      
      if (error && typeof error === 'object') {
        // Handle Django validation errors
        if (error.detail) {
          errorMsg = error.detail;
        } else {
          const messages = [];
          for (const [key, value] of Object.entries(error)) {
            if (Array.isArray(value)) {
              messages.push(`${key}: ${value.join(', ')}`);
            } else {
              messages.push(`${key}: ${value}`);
            }
          }
          if (messages.length > 0) {
            errorMsg = messages.join('; ');
          }
        }
      }
      toast.error(errorMsg);
    }
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64 text-lg">Loading product details...</div>;
  }

  if (!product) {
    return <div className="text-center py-12">Product not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="text-blue-600 hover:underline mb-4 inline-block">
        ← Back
      </button>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div>
          {/* Main Image */}
          <div className="bg-gray-100 rounded-lg p-4 mb-4 flex items-center justify-center min-h-[400px]">
            {selectedImage ? (
              <img 
                src={selectedImage} 
                alt={product.name} 
                className="max-w-full max-h-[400px] object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="%23999999"%3E%3Crect x="2" y="2" width="20" height="20" rx="2"%3E%3C/rect%3E%3Cpath d="M7 2v20M17 2v20M2 12h20"%3E%3C/path%3E%3C/svg%3E';
                }}
              />
            ) : (
              <div className="text-9xl">📦</div>
            )}
          </div>
          
          {/* Thumbnails */}
          {allImages.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {allImages.map((img, idx) => (
                <div 
                  key={idx} 
                  className={`bg-gray-100 rounded-lg p-2 cursor-pointer hover:opacity-75 transition ${
                    selectedImage === img ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => handleImageClick(img)}
                >
                  <img 
                    src={img} 
                    alt={`${product.name} ${idx + 1}`} 
                    className="w-full h-20 object-cover rounded"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="%23999999"%3E%3Crect x="2" y="2" width="20" height="20" rx="2"%3E%3C/rect%3E%3Cpath d="M7 2v20M17 2v20M2 12h20"%3E%3C/path%3E%3C/svg%3E';
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-gray-600 mb-4 leading-relaxed">{product.description || 'No description available'}</p>
          <div className="text-3xl font-bold text-blue-600 mb-4">${product.price}</div>
          
          <div className="mb-6">
            <label className="block text-gray-700 mb-2 font-semibold">Quantity:</label>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 transition text-lg font-semibold"
              >
                -
              </button>
              <span className="text-xl w-12 text-center font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 transition text-lg font-semibold"
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition text-lg font-semibold"
          >
            Add to Cart
          </button>
          
          {/* Stock info */}
          {product.stock > 0 ? (
            <p className="mt-4 text-green-600">✓ In Stock ({product.stock} available)</p>
          ) : (
            <p className="mt-4 text-red-600">✗ Out of Stock</p>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
        
        {user ? (
          <form onSubmit={handleSubmitReview} className="bg-gray-50 p-6 rounded-lg mb-6">
            <h3 className="text-lg font-semibold mb-3">Write a Review</h3>
            <div className="mb-3">
              <label className="block text-gray-700 mb-1 font-medium">Rating:</label>
              <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="5">5 - Excellent</option>
                <option value="4">4 - Very Good</option>
                <option value="3">3 - Good</option>
                <option value="2">2 - Fair</option>
                <option value="1">1 - Poor</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="block text-gray-700 mb-1 font-medium">Comment:</label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                required
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Share your experience with this product..."
              />
            </div>
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
              Submit Review
            </button>
          </form>
        ) : (
          <p className="text-gray-500 mb-6">
            <Link to="/login" className="text-blue-600 hover:underline">Login</Link> to leave a review
          </p>
        )}

        <div className="space-y-4">
          {reviews.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review!</p>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="border-b pb-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="font-semibold">{review.user?.email?.split('@')[0] || 'Anonymous'}</span>
                    <div className="text-yellow-500 text-sm">{"⭐".repeat(review.ratings)}</div>
                  </div>
                  <span className="text-sm text-gray-500">
                    {review.created_at ? new Date(review.created_at).toLocaleDateString() : 'Recent'}
                  </span>
                </div>
                <p className="text-gray-700 mt-2">{review.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;