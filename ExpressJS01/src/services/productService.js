import esClient from '../config/elasticsearch.js';
import Category from '../models/category.js';
import Product from '../models/product.js';
import slugifyLib from 'slugify';

const getCategoriesService = async () => {
  const categories = await Category.find({}).sort({ name: 1 });
  return categories;
};

const getProductsService = async ({
  category,
  page = 1,
  limit = 12,
  minPrice,
  maxPrice,
  hasDiscount,
  minViews,
  sortBy = 'createdAt',
  sortOrder = 'desc',
}) => {
  const numericLimit = Math.min(Number(limit) || 12, 60);
  const numericPage = Math.max(Number(page) || 1, 1);
  const skip = (numericPage - 1) * numericLimit;

  const filter = {};

  // Lọc theo danh mục
  if (category) {
    const cat = await Category.findOne({
      $or: [{ name: category }, { slug: category }],
    });
    if (cat) filter.categoryId = cat._id;
    else filter.categoryId = null;
  }

  // Lọc theo giá
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  // Lọc theo khuyến mãi
  if (hasDiscount === 'true') {
    filter.discount = { $gt: 0 };
  }

  // Lọc theo lượt xem
  if (minViews) {
    filter.views = { $gte: Number(minViews) };
  }

  // Sắp xếp
  const sortOptions = {};
  if (sortBy === 'price') {
    sortOptions.price = sortOrder === 'asc' ? 1 : -1;
  } else if (sortBy === 'views') {
    sortOptions.views = sortOrder === 'asc' ? 1 : -1;
  } else if (sortBy === 'discount') {
    sortOptions.discount = sortOrder === 'asc' ? 1 : -1;
  } else {
    sortOptions.createdAt = sortOrder === 'asc' ? 1 : -1;
  }

  const [items, total] = await Promise.all([
    Product.find(filter).sort(sortOptions).skip(skip).limit(numericLimit),
    Product.countDocuments(filter),
  ]);

  return {
    items,
    total,
    page: numericPage,
    limit: numericLimit,
    hasMore: skip + items.length < total,
  };
};

export { getCategoriesService, getProductsService };

const createCategoryService = async ({ name, slug, description }) => {
  if (!name) return { EC: 1, EM: 'Thiếu tên danh mục' };
  const base = slug
    ? slug
    : slugifyLib(name, { lower: true, strict: true, locale: 'vi' });
  let finalSlug = base;
  let i = 1;
  while (await Category.findOne({ slug: finalSlug })) {
    finalSlug = `${base}-${i++}`;
  }
  const exists = await Category.findOne({ slug: finalSlug });
  if (exists) return { EC: 2, EM: 'Slug đã tồn tại' };
  const created = await Category.create({ name, slug: finalSlug, description });
  return { EC: 0, EM: 'OK', data: created };
};

const createProductService = async ({
  name,
  slug,
  price,
  thumbnail,
  category,
  discount = 0,
  description,
  stock = 0,
}) => {
  if (!name || price == null || !category)
    return { EC: 1, EM: 'Thiếu dữ liệu' };
  const base = slug
    ? slug
    : slugifyLib(name, { lower: true, strict: true, locale: 'vi' });
  let finalSlug = base;
  let i = 1;
  while (await Product.findOne({ slug: finalSlug })) {
    finalSlug = `${base}-${i++}`;
  }
  const pExists = await Product.findOne({ slug: finalSlug });
  if (pExists) return { EC: 2, EM: 'Slug sản phẩm đã tồn tại' };
  const cat = await Category.findOne({
    $or: [{ name: category }, { slug: category }],
  });
  if (!cat) return { EC: 3, EM: 'Danh mục không tồn tại' };

  const created = await Product.create({
    name,
    slug: finalSlug,
    price,
    thumbnail,
    categoryId: cat._id,
    discount: Number(discount) || 0,
    description,
    stock: Number(stock) || 0,
    views: 0,
  });

  // index vào Elasticsearch
  await esClient.index({
    index: 'products',
    id: created._id.toString(),
    document: {
      name: created.name,
      price: created.price,
      categoryId: created.categoryId,
    },
  });

  return { EC: 0, EM: 'OK', data: created };
};

// SEARCH (Elasticsearch)
const searchProductService = async (query) => {
  const result = await esClient.search({
    index: 'products',
    body: {
      query: {
        match: {
          name: {
            query,
            fuzziness: 'AUTO', // bật fuzzy search tự động
          },
        },
      },
    },
  });

  // Trả về danh sách product
  return result.hits.hits.map((hit) => ({ id: hit._id, ...hit._source }));
};

export { createCategoryService, createProductService, searchProductService };
