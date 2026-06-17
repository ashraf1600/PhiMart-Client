import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { productService } from '../services/product';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import toast from 'react-hot-toast';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const p = await productService.getById(id);
        p.in_stock = p.stock > 0;
        setProduct(p);
        const imgs = p.images || [];
        const urls = imgs.map(img => typeof img === 'string' ? img : img.image).filter(Boolean);
        if (urls.length === 0 && p.main_image) urls.push(p.main_image);
        setImages(urls);
        setSelectedImage(urls[0] || null);
        const revs = await productService.getReviews(id);
        setReviews(revs.results || revs || []);
      } catch (e) {
        toast.error('Product not found');
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleAdd = async () => {
    if (!product.in_stock) {
      toast.error('This product is out of stock');
      return;
    }
    try {
      await addToCart(product.id, quantity);
      toast.success(`Added ${quantity} item(s)`);
    } catch {
      toast.error('Failed to add to cart');
    }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login');
      navigate('/login');
      return;
    }
    if (!reviewText.trim()) {
      toast.error('Write a comment');
      return;
    }
    try {
      await productService.addReview(product.id, rating, reviewText);
      toast.success('Review submitted');
      setReviewText('');
      setRating(5);
      const revs = await productService.getReviews(id);
      setReviews(revs.results || revs || []);
    } catch (err) {
      toast.error('Failed to submit review');
    }
  };

  const handleWishlistToggle = () => {
    if (!user) {
      toast.error('Please login to add to wishlist');
      navigate('/login');
      return;
    }
    toggleWishlist(product);
  };

  /**
   * Get the display name for a review author.
   * Handles both nested user objects and plain user IDs.
   */
  const getReviewAuthor = (review) => {
    // If there's no user field at all
    if (!review.user) return 'Anonymous';

    // If user is an object with name or email
    if (typeof review.user === 'object') {
      if (review.user.name) return review.user.name;
      if (review.user.email) return review.user.email.split('@')[0];
      return 'User';
    }

    // If user is a number (ID) – fallback to show ID
    if (typeof review.user === 'number') {
      return `User #${review.user}`;
    }

    // Fallback
    return 'Anonymous';
  };

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;
  if (!product) return <div className="text-center py-12">Not found</div>;

  return (
    <div className="container mx-auto px-6 py-12">
      <button onClick={() => navigate(-1)} className="text-sm text-[#b8a28c] hover:underline mb-6">← Back</button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Images */}
        <div>
          <div className="bg-white rounded-xl overflow-hidden shadow-sm">
            {selectedImage ? (
              <img src={selectedImage} alt={product.name} className="w-full h-auto object-contain max-h-[500px]" />
            ) : (
              <div className="w-full h-96 flex items-center justify-center text-6xl">👕</div>
            )}
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2 mt-4">
              {images.map((img, i) => (
                <div
                  key={i}
                  className={`bg-white rounded-xl overflow-hidden shadow-sm cursor-pointer ${selectedImage === img ? 'ring-2 ring-[#b8a28c]' : ''}`}
                  onClick={() => setSelectedImage(img)}
                >
                  <img src={img} alt={`${product.name} ${i + 1}`} className="w-full h-20 object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product info */}
        <div>
          <h1 className="text-4xl font-heading">{product.name}</h1>
          <p className="text-[#b8a28c] text-sm uppercase tracking-wider mt-1">{product.category_name}</p>
          <p className="text-3xl font-bold mt-4">${product.price}</p>

          {/* Stock status */}
          <div className="flex items-center gap-2 mt-2">
            {product.in_stock ? (
              <span className="text-green-600 text-sm font-semibold">✓ In Stock</span>
            ) : (
              <span className="text-red-600 text-sm font-semibold">✗ Out of Stock</span>
            )}
            {product.stock > 0 && <span className="text-gray-500 text-sm">({product.stock} available)</span>}
          </div>

          <p className="text-gray-600 mt-4">{product.description}</p>

          {/* Wishlist heart */}
          <button
            onClick={handleWishlistToggle}
            className="flex items-center gap-2 text-lg mt-4 hover:scale-110 transition"
          >
            {isInWishlist(product.id) ? '❤️' : '🤍'}
            {isInWishlist(product.id) ? ' In Wishlist' : ' Add to Wishlist'}
          </button>

          <div className="mt-6 flex items-center gap-4">
            <label className="font-semibold">Quantity:</label>
            <div className="flex items-center border border-gray-300 rounded-full overflow-hidden">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-1 hover:bg-gray-100">-</button>
              <span className="px-4 py-1 w-12 text-center">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-1 hover:bg-gray-100">+</button>
            </div>
          </div>

          <button
            onClick={handleAdd}
            disabled={!product.in_stock}
            className={`mt-6 w-full py-3 rounded-full transition ${product.in_stock ? 'bg-[#1a1a1a] text-white hover:bg-[#b8a28c]' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
          >
            {product.in_stock ? 'Add to Cart' : 'Out of Stock'}
          </button>

          <div className="mt-4 text-sm text-gray-500">Delivery estimated on Friday, July 26</div>

          {/* Tabs */}
          <div className="mt-8 border-t border-gray-200 pt-6">
            <div className="flex space-x-6 text-sm font-semibold">
              <span className="border-b-2 border-[#b8a28c] pb-1">Description</span>
              <span className="text-gray-400">Product Details</span>
              <span className="text-gray-400">Delivery Details</span>
            </div>
            <p className="mt-4 text-gray-600">{product.description || 'No description'}</p>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-16">
        <h2 className="text-2xl font-heading mb-4">Reviews</h2>
        {user ? (
          <form onSubmit={handleReview} className="bg-white p-6 rounded-xl shadow-sm mb-6">
            <div className="flex flex-wrap gap-4">
              <select value={rating} onChange={e => setRating(Number(e.target.value))} className="border rounded px-3 py-2">
                {[5, 4, 3, 2, 1].map(r => (
                  <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>
                ))}
              </select>
              <input
                type="text"
                value={reviewText}
                onChange={e => setReviewText(e.target.value)}
                placeholder="Write your review..."
                className="flex-1 border rounded px-4 py-2 min-w-[200px]"
              />
              <button type="submit" className="bg-[#1a1a1a] text-white px-6 py-2 rounded-full text-sm hover:bg-[#b8a28c]">
                Submit
              </button>
            </div>
          </form>
        ) : (
          <p><Link to="/login" className="text-[#b8a28c]">Login</Link> to leave a review</p>
        )}
        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet.</p>
        ) : (
          reviews.map(r => (
            <div key={r.id} className="border-b py-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold">
                  {getReviewAuthor(r)}
                </span>
                <span className="text-yellow-500">{"⭐".repeat(r.ratings)}</span>
                <span className="text-sm text-gray-500 ml-auto">
                  {r.created_at ? new Date(r.created_at).toLocaleString() : 'Recent'}
                </span>
              </div>
              <p className="text-gray-700 mt-1">{r.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;