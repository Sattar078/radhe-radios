import express from 'express';
import Product from '../models/Product.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// High-Concurrency In-Memory Micro-Cache for Catalog Reads
let catalogCache = null;
let catalogCacheTime = 0;
const CACHE_TTL_MS = 30000; // 30 seconds TTL

export function invalidateCatalogCache() {
  catalogCache = null;
  catalogCacheTime = 0;
}

// ─────────────────────────────────────────
// GET /api/products (Public)
// Query params: ?search=&category=
// ─────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const { search = '', category = '' } = req.query;

    // Fast path: served from RAM for un-filtered catalog requests
    const isDefaultRequest = (!search || !search.trim()) && (!category || category === 'All Audio Systems');
    const now = Date.now();
    if (isDefaultRequest && catalogCache && now - catalogCacheTime < CACHE_TTL_MS) {
      res.setHeader('X-Cache', 'HIT');
      res.setHeader('Cache-Control', 'public, max-age=30, stale-while-revalidate=120');
      return res.json(catalogCache);
    }

    const query = {};

    if (category && category !== 'All Audio Systems') {
      query.category = category;
    }

    if (search && search.trim()) {
      const term = search.trim();
      const regex = new RegExp(term, 'i');
      query.$or = [{ title: regex }, { description: regex }, { tags: regex }, { category: regex }];
    }

    const [products, distinctCategories] = await Promise.all([
      Product.find(query).sort({ createdAt: -1 }).lean(),
      Product.distinct('category'),
    ]);

    const categories = ['All Audio Systems', ...distinctCategories];

    const result = {
      products: products.map((p) => {
        delete p.__v;
        return p;
      }),
      categories,
      total: products.length,
    };

    if (isDefaultRequest) {
      catalogCache = result;
      catalogCacheTime = now;
      res.setHeader('X-Cache', 'MISS');
      res.setHeader('Cache-Control', 'public, max-age=30, stale-while-revalidate=120');
    }

    return res.json(result);
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

    invalidateCatalogCache();
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
    invalidateCatalogCache();
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
    invalidateCatalogCache();
    return res.json({ success: true, message: 'Product removed from catalog.' });
  } catch (err) {
    console.error('Admin delete product error:', err);
    return res.status(500).json({ error: 'Failed to delete product.' });
  }
});

export default router;
