import { Router } from 'express';
import productRoutes from './products.routes.js';

const router = Router();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check
 *     description: Check if the API is running
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: 2026-01-27T10:00:00.000Z
 */
router.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

/**
 * @swagger
 * /:
 *   get:
 *     summary: API information
 *     description: Get basic information about the API
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Totem API - JSE02 Javascript Expert Hands-on
 *                 version:
 *                   type: string
 *                   example: 1.0.0
 *                 endpoints:
 *                   type: object
 *                   properties:
 *                     health:
 *                       type: string
 *                       example: /health
 *                     products:
 *                       type: string
 *                       example: /products
 *                     docs:
 *                       type: string
 *                       example: /api-docs
 */
router.get('/', (_req, res) => {
  res.json({
    message: 'Totem API - JSE02 Javascript Expert Hands-on',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      products: '/products',
      docs: '/api-docs',
    },
  });
});

// Product routes
router.use('/products', productRoutes);

export default router;
