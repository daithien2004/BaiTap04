import express from 'express';
import {
  createUser,
  handleLogin,
  getUser,
  getAccount,
  forgotPassword,
  resetPassword,
} from '../controllers/userController.js';
import auth from '../middleware/auth.js';
import delay from '../middleware/delay.js';
import {
  getCategories,
  getProducts,
  createCategory,
  createProduct,
  searchProducts,
  getProductDetails,
} from '../controllers/productController.js';
import {
  addFavorite,
  removeFavorite,
  listFavorites,
  addRecentView,
  listRecentViews,
  getSimilarProducts,
  getProductStats,
} from '../controllers/productExtraController.js';

const routerAPI = express.Router();

// Apply auth middleware to specific routes instead of using wildcard
routerAPI.get('/', auth, (req, res) => {
  return res.status(200).json('Hello world api');
});
routerAPI.post('/register', createUser);
routerAPI.post('/login', handleLogin);
routerAPI.post('/forgot-password', forgotPassword);
routerAPI.post('/reset-password', resetPassword);
routerAPI.get('/user', auth, getUser);
routerAPI.get('/account', auth, delay, getAccount);

// category & products
routerAPI.get('/categories', getCategories);
routerAPI.get('/products', getProducts);
routerAPI.post('/categories', createCategory);
routerAPI.post('/products', createProduct);
routerAPI.post('/products/:productId', getProductDetails);
routerAPI.get('/products/search', searchProducts);

// favorite
routerAPI.post('/favorites/:productId', auth, addFavorite);
routerAPI.delete('/favorites/:productId', auth, removeFavorite);
routerAPI.get('/favorites', auth, listFavorites);

// recent views
routerAPI.post('/products/:productId/view', auth, addRecentView);
routerAPI.get('/recent-views', auth, listRecentViews);

// similar
routerAPI.get('/products/:id/similar', getSimilarProducts);

// stats
routerAPI.get('/products/:id/stats', getProductStats);

export default routerAPI;
