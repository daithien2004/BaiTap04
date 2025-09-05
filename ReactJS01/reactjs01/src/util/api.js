import axios from './axios.customize';

const createUserApi = (name, email, password) => {
  const URL_API = '/v1/api/register';
  const data = {
    name,
    email,
    password,
  };
  return axios.post(URL_API, data);
};

const loginApi = (email, password) => {
  const URL_API = '/v1/api/login';
  const data = {
    email,
    password,
  };
  return axios.post(URL_API, data);
};

const getUserApi = () => {
  const URL_API = '/v1/api/user';
  return axios.get(URL_API);
};

export { createUserApi, loginApi, getUserApi };

const forgotPasswordApi = (email) => {
  const URL_API = '/v1/api/forgot-password';
  return axios.post(URL_API, { email });
};

const resetPasswordApi = (token, password) => {
  const URL_API = '/v1/api/reset-password';
  return axios.post(URL_API, { token, password });
};

export { forgotPasswordApi, resetPasswordApi };

const getCategoriesApi = () => {
  const URL_API = '/v1/api/categories';
  return axios.get(URL_API);
};

const getProductsApi = ({ category, page, limit }) => {
  const URL_API = '/v1/api/products';
  const params = {};
  if (category) params.category = category;
  if (page) params.page = page;
  if (limit) params.limit = limit;
  return axios.get(URL_API, { params });
};

export { getCategoriesApi, getProductsApi };

const createCategoryApi = ({ name, slug, description }) => {
  const URL_API = '/v1/api/categories';
  return axios.post(URL_API, { name, slug, description });
};

const createProductApi = ({ name, slug, price, thumbnail, category }) => {
  const URL_API = '/v1/api/products';
  return axios.post(URL_API, { name, slug, price, thumbnail, category });
};

export { createCategoryApi, createProductApi };
