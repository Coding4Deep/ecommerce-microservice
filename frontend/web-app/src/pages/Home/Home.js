import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Box,
  Chip,
  Rating,
  Skeleton,
  Paper,
  IconButton,
} from '@mui/material';
import {
  ShoppingCart,
  Favorite,
  FavoriteBorder,
  Star,
  LocalOffer,
  TrendingUp,
  NewReleases,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';

import { fetchFeaturedProducts } from '../../store/slices/productSlice';
import { addToCart } from '../../store/slices/cartSlice';
import HeroSection from '../../components/HeroSection/HeroSection';
import CategoryGrid from '../../components/CategoryGrid/CategoryGrid';
import ProductCard from '../../components/ProductCard/ProductCard';

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { featuredProducts, loading } = useSelector((state) => state.products);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchFeaturedProducts());
  }, [dispatch]);

  const handleAddToCart = (product) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }
    
    dispatch(addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity: 1
    }));
    toast.success('Added to cart!');
  };

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  return (
    <Box>
      {/* Hero Section */}
      <HeroSection />

      {/* Categories Section */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h2" gutterBottom align="center">
          Shop by Category
        </Typography>
        <CategoryGrid />
      </Container>

      {/* Featured Products Section */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" alignItems="center" mb={3}>
          <Star sx={{ color: 'gold', mr: 1 }} />
          <Typography variant="h4" component="h2">
            Featured Products
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {loading ? (
            // Loading skeletons
            Array.from(new Array(8)).map((_, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <Card>
                  <Skeleton variant="rectangular" height={200} />
                  <CardContent>
                    <Skeleton variant="text" height={32} />
                    <Skeleton variant="text" height={24} />
                    <Skeleton variant="text" height={20} width="60%" />
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            featuredProducts.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                <ProductCard
                  product={product}
                  onAddToCart={() => handleAddToCart(product)}
                  onProductClick={() => handleProductClick(product.id)}
                />
              </Grid>
            ))
          )}
        </Grid>

        {!loading && featuredProducts.length === 0 && (
          <Box textAlign="center" py={4}>
            <Typography variant="h6" color="text.secondary">
              No featured products available
            </Typography>
          </Box>
        )}
      </Container>

      {/* Promotional Sections */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          {/* New Arrivals */}
          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                p: 3,
                textAlign: 'center',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                },
              }}
              onClick={() => navigate('/products?filter=new')}
            >
              <NewReleases sx={{ fontSize: 48, mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                New Arrivals
              </Typography>
              <Typography variant="body1">
                Discover the latest products just added to our collection
              </Typography>
            </Paper>
          </Grid>

          {/* Best Sellers */}
          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                p: 3,
                textAlign: 'center',
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                color: 'white',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                },
              }}
              onClick={() => navigate('/products?filter=bestsellers')}
            >
              <TrendingUp sx={{ fontSize: 48, mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Best Sellers
              </Typography>
              <Typography variant="body1">
                Most popular products loved by our customers
              </Typography>
            </Paper>
          </Grid>

          {/* Special Offers */}
          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                p: 3,
                textAlign: 'center',
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                color: 'white',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                },
              }}
              onClick={() => navigate('/products?filter=offers')}
            >
              <LocalOffer sx={{ fontSize: 48, mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Special Offers
              </Typography>
              <Typography variant="body1">
                Great deals and discounts on selected items
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Newsletter Section */}
      <Box sx={{ bgcolor: 'grey.100', py: 6 }}>
        <Container maxWidth="md">
          <Box textAlign="center">
            <Typography variant="h4" gutterBottom>
              Stay Updated
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Subscribe to our newsletter and be the first to know about new products,
              exclusive offers, and special promotions.
            </Typography>
            <Box
              component="form"
              sx={{
                display: 'flex',
                gap: 2,
                maxWidth: 400,
                mx: 'auto',
                mt: 3,
              }}
            >
              <input
                type="email"
                placeholder="Enter your email"
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '16px',
                }}
              />
              <Button
                variant="contained"
                size="large"
                sx={{ px: 3 }}
              >
                Subscribe
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
