const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
    index: true
  },
  userId: {
    type: String,
    required: true,
    index: true
  },
  userName: {
    type: String,
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  title: {
    type: String,
    required: true,
    maxlength: 200
  },
  comment: {
    type: String,
    required: true,
    maxlength: 2000
  },
  images: [{
    url: String,
    alt: String
  }],
  verified: {
    type: Boolean,
    default: false // True if user actually purchased the product
  },
  helpful: {
    type: Number,
    default: 0
  },
  helpfulVotes: [{
    userId: String,
    vote: {
      type: String,
      enum: ['helpful', 'not_helpful']
    }
  }],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  moderationNotes: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for better performance
reviewSchema.index({ productId: 1, createdAt: -1 });
reviewSchema.index({ userId: 1, createdAt: -1 });
reviewSchema.index({ rating: 1 });
reviewSchema.index({ status: 1 });

// Compound index for product reviews with status
reviewSchema.index({ productId: 1, status: 1, createdAt: -1 });

// Update the updatedAt field before saving
reviewSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Virtual for review age
reviewSchema.virtual('age').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24)); // days
});

// Method to calculate helpfulness ratio
reviewSchema.methods.getHelpfulnessRatio = function() {
  const totalVotes = this.helpfulVotes.length;
  if (totalVotes === 0) return 0;
  
  const helpfulVotes = this.helpfulVotes.filter(vote => vote.vote === 'helpful').length;
  return (helpfulVotes / totalVotes) * 100;
};

// Static method to get product rating summary
reviewSchema.statics.getProductRatingSummary = async function(productId) {
  const pipeline = [
    { $match: { productId, status: 'approved' } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
        ratingDistribution: {
          $push: '$rating'
        }
      }
    }
  ];

  const result = await this.aggregate(pipeline);
  
  if (result.length === 0) {
    return {
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    };
  }

  const summary = result[0];
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  
  summary.ratingDistribution.forEach(rating => {
    distribution[rating]++;
  });

  return {
    averageRating: Math.round(summary.averageRating * 10) / 10,
    totalReviews: summary.totalReviews,
    ratingDistribution: distribution
  };
};

module.exports = mongoose.model('Review', reviewSchema);
