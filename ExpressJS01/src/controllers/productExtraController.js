import {
  addFavoriteService,
  removeFavoriteService,
  listFavoritesService,
  addRecentViewService,
  listRecentViewsService,
  getSimilarProductsService,
  getProductStatsService,
} from '../services/productExtraService.js';

const addFavorite = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;
    const r = await addFavoriteService(userId, productId);
    return res.status(200).json(r);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ EC: -1, EM: 'Server error' });
  }
};

const removeFavorite = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;
    const r = await removeFavoriteService(userId, productId);
    return res.status(200).json(r);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ EC: -1, EM: 'Server error' });
  }
};

const listFavorites = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page, limit } = req.query;
    const r = await listFavoritesService(userId, { page, limit });
    return res.status(200).json(r);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ EC: -1, EM: 'Server error' });
  }
};

// Recent views
const addRecentView = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { productId } = req.params;
    const r = await addRecentViewService(userId, productId);
    return res.status(200).json(r);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ EC: -1, EM: 'Server error' });
  }
};

const listRecentViews = async (req, res) => {
  try {
    const userId = req.user._id;
    const { limit } = req.query;
    const r = await listRecentViewsService(userId, { limit });
    return res.status(200).json(r);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ EC: -1, EM: 'Server error' });
  }
};

// Similar
const getSimilarProducts = async (req, res) => {
  try {
    const { id } = req.params;
    const r = await getSimilarProductsService(id, { limit: 6 });
    return res.status(200).json(r);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ EC: -1, EM: 'Server error' });
  }
};

// Stats
const getProductStats = async (req, res) => {
  try {
    const { id } = req.params;
    const r = await getProductStatsService(id);
    return res.status(200).json(r);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ EC: -1, EM: 'Server error' });
  }
};

export {
  addFavorite,
  removeFavorite,
  listFavorites,
  addRecentView,
  listRecentViews,
  getSimilarProducts,
  getProductStats,
};
