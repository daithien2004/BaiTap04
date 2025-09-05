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
import { getCategories, getProducts, createCategory, createProduct } from '../controllers/productController.js';

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

export default routerAPI;

