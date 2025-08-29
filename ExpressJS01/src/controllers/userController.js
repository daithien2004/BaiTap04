const {
  createUserService,
  loginService,
  getUserService,
  requestPasswordResetService,
  resetPasswordService,
} = require('../services/userService');

const createUser = async (req, res) => {
  const { name, email, password } = req.body;
  const data = await createUserService(name, email, password);
  return res.status(200).json(data);
};

const handleLogin = async (req, res) => {
  const { email, password } = req.body;
  const data = await loginService(email, password);
  console.log(data);
  return res.status(200).json(data);
};

const getUser = async (req, res) => {
  const data = await getUserService();
  return res.status(200).json(data);
};

const getAccount = async (req, res) => {
  return res.status(200).json(req.user);
};

module.exports = {
  createUser,
  handleLogin,
  getUser,
  getAccount,
};

// Forgot/Reset Password Controllers
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const data = await requestPasswordResetService(email);
  return res.status(200).json(data);
};

const resetPassword = async (req, res) => {
  const { token, password } = req.body;
  const data = await resetPasswordService(token, password);
  return res.status(200).json(data);
};

module.exports.forgotPassword = forgotPassword;
module.exports.resetPassword = resetPassword;
