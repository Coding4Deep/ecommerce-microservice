import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './Reviews.css';

const Reviews = () => {
  const { productId } = useParams();
  const { user, getAuthToken } = useAuth();
  const navigate = useNavigate();
  
  const [reviews, setReviews] = useState([]);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: '',
    comment: ''
  });
  const [ratingStats, setRatingStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  });

  useEffect(() => {
    fetchProductAndReviews();
  }, [productId]);

  const fetchProductAndReviews = async () => {
    try {
      setLoading(true);
      
      // Fetch product details
      const productResponse = await axios.get(`http://localhost:8009/api/v1/products/${productId}`);
      if (productResponse.data?.success) {
        setProduct(productResponse.data.data);
      }

      // Fetch reviews
      const reviewsResponse = await axios.get(`http://localhost:8006/api/reviews/product/${productId}`);
      if (reviewsResponse.data?.success) {
        setReviews(reviewsResponse.data.data || []);
      }

      // Fetch rating statistics
      const statsResponse = await axios.get(`http://localhost:8006/api/reviews/product/${productId}/stats`);
      if (statsResponse.data?.success) {
        setRatingStats(statsResponse.data.data);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const token = getAuthToken();
      const response = await axios.post(`http://localhost:8006/api/reviews`, {
        productId,
        rating: newReview.rating,
        title: newReview.title,
        comment: newReview.comment
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data?.success) {
        setNewReview({ rating: 5, title: '', comment: '' });
        setShowReviewForm(false);
        fetchProductAndReviews();
        alert('Review submitted successfully!');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    }
  };

  const handleHelpfulVote = async (reviewId, vote) => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const token = getAuthToken();
      await axios.post(`http://localhost:8006/api/reviews/${reviewId}/helpful`, {
        vote
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      fetchProductAndReviews();
    } catch (error) {
      console.error('Error voting on review:', error);
    }
  };

  const renderStars = (rating, interactive = false, onRatingChange = null) => {
    return (
      <div className={`stars ${interactive ? 'interactive' : ''}`}>
        {[1, 2, 3, 4, 5].map(star => (
          <span
            key={star}
            className={`star ${star <= rating ? 'filled' : ''}`}
            onClick={interactive ? () => onRatingChange(star) : undefined}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const renderRatingDistribution = () => {
    const total = ratingStats.totalReviews;
    if (total === 0) return null;

    return (
      <div className="rating-distribution">
        <h3>Rating Breakdown</h3>
        {[5, 4, 3, 2, 1].map(rating => {
          const count = ratingStats.ratingDistribution[rating] || 0;
          const percentage = (count / total) * 100;
          
          return (
            <div key={rating} className="rating-bar">
              <span className="rating-label">{rating} ★</span>
              <div className="bar-container">
                <div 
                  className="bar-fill" 
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <span className="rating-count">({count})</span>
            </div>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="reviews-loading">
        <div className="loading-spinner"></div>
        <p>Loading reviews...</p>
      </div>
    );
  }

  return (
    <div className="reviews-container">
      {product && (
        <div className="product-header">
          <div className="product-info">
            <img src={product.image} alt={product.name} className="product-image" />
            <div className="product-details">
              <h1>{product.name}</h1>
              <p className="product-description">{product.description}</p>
              <div className="product-rating">
                {renderStars(ratingStats.averageRating)}
                <span className="rating-text">
                  {ratingStats.averageRating.toFixed(1)} out of 5 ({ratingStats.totalReviews} reviews)
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="reviews-content">
        <div className="reviews-summary">
          <div className="summary-stats">
            <div className="average-rating">
              <div className="rating-number">{ratingStats.averageRating.toFixed(1)}</div>
              {renderStars(ratingStats.averageRating)}
              <div className="total-reviews">{ratingStats.totalReviews} reviews</div>
            </div>
            {renderRatingDistribution()}
          </div>
          
          <div className="review-actions">
            {user ? (
              <button 
                className="write-review-btn"
                onClick={() => setShowReviewForm(!showReviewForm)}
              >
                {showReviewForm ? 'Cancel Review' : 'Write a Review'}
              </button>
            ) : (
              <button 
                className="login-to-review-btn"
                onClick={() => navigate('/login')}
              >
                Login to Write a Review
              </button>
            )}
          </div>
        </div>

        {showReviewForm && (
          <div className="review-form-container">
            <h3>Write Your Review</h3>
            <form onSubmit={handleSubmitReview} className="review-form">
              <div className="form-group">
                <label>Rating</label>
                {renderStars(newReview.rating, true, (rating) => 
                  setNewReview({...newReview, rating})
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="title">Review Title</label>
                <input
                  type="text"
                  id="title"
                  value={newReview.title}
                  onChange={(e) => setNewReview({...newReview, title: e.target.value})}
                  placeholder="Summarize your review"
                  required
                  maxLength="200"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="comment">Your Review</label>
                <textarea
                  id="comment"
                  value={newReview.comment}
                  onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                  placeholder="Share your experience with this product"
                  required
                  maxLength="2000"
                  rows="5"
                />
              </div>
              
              <div className="form-actions">
                <button type="submit" className="submit-review-btn">
                  Submit Review
                </button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => setShowReviewForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="reviews-list">
          <h3>Customer Reviews</h3>
          {reviews.length === 0 ? (
            <div className="no-reviews">
              <p>No reviews yet. Be the first to review this product!</p>
            </div>
          ) : (
            reviews.map(review => (
              <div key={review._id} className="review-item">
                <div className="review-header">
                  <div className="reviewer-info">
                    <div className="reviewer-avatar">
                      {review.userName.charAt(0).toUpperCase()}
                    </div>
                    <div className="reviewer-details">
                      <div className="reviewer-name">{review.userName}</div>
                      <div className="review-date">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="review-rating">
                    {renderStars(review.rating)}
                    {review.verified && (
                      <span className="verified-badge">✓ Verified Purchase</span>
                    )}
                  </div>
                </div>
                
                <div className="review-content">
                  <h4 className="review-title">{review.title}</h4>
                  <p className="review-comment">{review.comment}</p>
                  
                  {review.images && review.images.length > 0 && (
                    <div className="review-images">
                      {review.images.map((image, index) => (
                        <img 
                          key={index}
                          src={image.url} 
                          alt={image.alt || 'Review image'}
                          className="review-image"
                        />
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="review-actions">
                  <button 
                    className="helpful-btn"
                    onClick={() => handleHelpfulVote(review._id, 'helpful')}
                  >
                    👍 Helpful ({review.helpful || 0})
                  </button>
                  <button 
                    className="not-helpful-btn"
                    onClick={() => handleHelpfulVote(review._id, 'not_helpful')}
                  >
                    👎 Not Helpful
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Reviews;
