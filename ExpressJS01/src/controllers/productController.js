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

// Get products (normal listing with filter + pagination)
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

// Search products (Elasticsearch + pagination)
const searchProducts = async (req, res) => {
  try {
    const { q, page, limit } = req.query;

    if (!q || q.trim() === '') {
      // fallback về getProducts nếu không có query
      const data = await getProductsService({ page, limit });
      return res.status(200).json(data);
    }

    const data = await searchProductService(q, page, limit);
    return res.status(200).json(data);
  } catch (error) {
    console.error('Search products error:', error);
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

export { createCategory, createProduct, searchProducts };
