import {
  getCategoriesService,
  getProductsService,
  createCategoryService,
  createProductService,
  searchProductService,
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
    const {
      category,
      page,
      limit,
      minPrice,
      maxPrice,
      hasDiscount,
      minViews,
      sortBy,
      sortOrder,
    } = req.query;

    console.log(req.query);

    const data = await getProductsService({
      category,
      page,
      limit,
      minPrice,
      maxPrice,
      hasDiscount,
      minViews,
      sortBy,
      sortOrder,
    });

    return res.status(200).json(data);
  } catch (error) {
    console.error('Get products error:', error);
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

const searchProduct = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim() === '') {
      // Return full product list (no pagination) when query is empty
      const all = await getProductsService({
        page: 1,
        limit: 1000,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });
      return res.status(200).json({ data: all.items });
    }
    const products = await searchProductService(q);
    return res.status(200).json({ data: products });
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};

export { createCategory, createProduct, searchProduct };
