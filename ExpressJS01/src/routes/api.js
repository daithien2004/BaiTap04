const express = require('express');
const {
  createUser,
  handleLogin,
  getUser,
  getAccount,
  forgotPassword,
  resetPassword,
} = require('../controllers/userController');
const auth = require('../middleware/auth');
const delay = require('../middleware/delay');

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

module.exports = routerAPI;

