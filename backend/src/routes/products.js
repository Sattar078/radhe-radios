import express from 'express';
import Product from '../models/Product.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// ─────────────────────────────────────────
// GET /api/products (Public)
// Query params: ?search=&category=
// ─────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const { search = '', category = '' } = req.query;

    const query = {};

    if (category && category !== 'All Audio Systems') {
      query.category = category;
    }

    if (search && search.trim()) {
      const term = search.trim();
      const regex = new RegExp(term, 'i');
      query.$or = [{ title: regex }, { description: regex }, { tags: regex }, { category: regex }];
    }

    const products = await Product.find(query).sort({ createdAt: -1 });
    const distinctCategories = await Product.distinct('category');
    const categories = ['All Audio Systems', ...distinctCategories];

    return res.json({
      products: products.map((p) => p.toSafeObject()),
      categories,
      total: products.length,
    });
  } catch (err) {
    console.error('Products list error:', err);
    return res.status(500).json({ error: 'Failed to fetch products.' });
  }
});

// ─────────────────────────────────────────
// GET /api/products/:id (Public)
// ─────────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ id: req.params.id });
    if (!product) return res.status(404).json({ error: 'Product not found.' });
    return res.json(product.toSafeObject());
  } catch (err) {
    console.error('Product detail error:', err);
    return res.status(500).json({ error: 'Failed to fetch product.' });
  }
});

// ─────────────────────────────────────────
// POST /api/products (Admin Only) — Create product
// ─────────────────────────────────────────
router.post('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { title, category, badge, description, image, tags, specs, price, inStock, featured } = req.body;

    if (!title || !category) {
      return res.status(400).json({ error: 'Title and category are required.' });
    }

    const id = req.body.id || (title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now().toString().slice(-4));

    const newProduct = await Product.create({
      id,
      title: title.trim(),
      category: category.trim(),
      badge: badge || 'KOTA HANDCRAFTED',
      description: description || '',
      image: image || '/frames/frame_0180.jpg',
      price: Number(price) || 35000,
      inStock: inStock !== undefined ? Boolean(inStock) : true,
      featured: featured !== undefined ? Boolean(featured) : true,
      tags: Array.isArray(tags) ? tags : [],
      specs: specs || {},
    });

    return res.status(201).json(newProduct.toSafeObject());
  } catch (err) {
    console.error('Admin create product error:', err);
    return res.status(500).json({ error: 'Failed to create product: ' + err.message });
  }
});

// ─────────────────────────────────────────
// PUT /api/products/:id (Admin Only) — Update product
// ─────────────────────────────────────────
router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { title, category, badge, description, image, tags, specs, price, inStock, featured } = req.body;

    const product = await Product.findOne({ id: req.params.id });
    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    if (title) product.title = title.trim();
    if (category) product.category = category.trim();
    if (badge !== undefined) product.badge = badge;
    if (description !== undefined) product.description = description;
    if (image !== undefined) product.image = image;
    if (price !== undefined) product.price = Number(price);
    if (inStock !== undefined) product.inStock = Boolean(inStock);
    if (featured !== undefined) product.featured = Boolean(featured);
    if (tags !== undefined) product.tags = Array.isArray(tags) ? tags : [];
    if (specs !== undefined) product.specs = specs;

    await product.save();
    return res.json(product.toSafeObject());
  } catch (err) {
    console.error('Admin update product error:', err);
    return res.status(500).json({ error: 'Failed to update product.' });
  }
});

// ─────────────────────────────────────────
// DELETE /api/products/:id (Admin Only) — Delete product
// ─────────────────────────────────────────
router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const deleted = await Product.findOneAndDelete({ id: req.params.id });
    if (!deleted) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    return res.json({ success: true, message: 'Product removed from catalog.' });
  } catch (err) {
    console.error('Admin delete product error:', err);
    return res.status(500).json({ error: 'Failed to delete product.' });
  }
});

export default router;
