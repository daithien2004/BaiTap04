import {
  getCategoriesService,
  getProductsService,
  createCategoryService,
  createProductService,
} from '../services/productService.js';

const getCategories = async (req, res) => {
  try {
    const data = await getCategoriesService();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};

const getProducts = async (req, res) => {
  try {
    const { category, page, limit } = req.query;
    const data = await getProductsService({ category, page, limit });
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};

export { getCategories, getProducts };

const createCategory = async (req, res) => {
  try {
    const data = await createCategoryService(req.body);
    const status = data.EC === 0 ? 201 : 400;
    return res.status(status).json(data);
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};

const createProduct = async (req, res) => {
  try {
    const data = await createProductService(req.body);
    const status = data.EC === 0 ? 201 : 400;
    return res.status(status).json(data);
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};

export { createCategory, createProduct };
