import request from 'supertest';
import express from 'express';
import cors from 'cors';
import routes from '../routes/index.js';
import { errorHandler, notFoundHandler } from '../middleware/errorHandler.js';
import sequelize from '../config/testDatabase.js';
import Product from '../models/Product.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/', routes);
app.use(notFoundHandler);
app.use(errorHandler);

describe('Product Routes', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  beforeEach(async () => {
    await Product.destroy({ where: {} });
  });

  describe('POST /products', () => {
    it('should create a new product', async () => {
      const newProduct = {
        sku: 'TEST-001',
        name: 'Test Product',
        price: 10.5,
        stock: 100,
        category: 'test',
      };

      const response = await request(app).post('/products').send(newProduct).expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.sku).toBe(newProduct.sku);
      expect(response.body.name).toBe(newProduct.name);
      expect(response.body.price).toBe(newProduct.price);
    });

    it('should return 400 when required fields are missing', async () => {
      const response = await request(app)
        .post('/products')
        .send({ name: 'Incomplete Product' })
        .expect(400);

      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should return 409 when SKU already exists', async () => {
      const product = {
        sku: 'TEST-002',
        name: 'Test Product',
        price: 10.5,
        stock: 100,
        category: 'test',
      };

      await request(app).post('/products').send(product);
      const response = await request(app).post('/products').send(product).expect(409);

      expect(response.body.error.code).toBe('CONFLICT');
    });
  });

  describe('GET /products', () => {
    beforeEach(async () => {
      await Product.bulkCreate([
        { sku: 'TEST-001', name: 'Product 1', price: 10, stock: 50, category: 'cat1' },
        { sku: 'TEST-002', name: 'Product 2', price: 20, stock: 0, category: 'cat2' },
        { sku: 'TEST-003', name: 'Product 3', price: 30, stock: 30, category: 'cat1' },
      ]);
    });

    it('should list all products', async () => {
      const response = await request(app).get('/products').expect(200);

      expect(response.body).toHaveLength(3);
    });

    it('should filter products by category', async () => {
      const response = await request(app).get('/products?category=cat1').expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body.every((p: any) => p.category === 'cat1')).toBe(true);
    });

    it('should filter products in stock', async () => {
      const response = await request(app).get('/products?inStock=true').expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body.every((p: any) => p.stock > 0)).toBe(true);
    });

    it('should search products by name', async () => {
      const response = await request(app).get('/products?search=Product 1').expect(200);

      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /products/:id', () => {
    it('should return a product by id', async () => {
      const product = await Product.create({
        sku: 'TEST-004',
        name: 'Product 4',
        price: 40,
        stock: 40,
        category: 'cat1',
      });

      const response = await request(app).get(`/products/${product.id}`).expect(200);

      expect(response.body.id).toBe(product.id);
      expect(response.body.sku).toBe('TEST-004');
    });

    it('should return 404 when product not found', async () => {
      const response = await request(app).get('/products/99999').expect(404);

      expect(response.body.error.code).toBe('NOT_FOUND');
    });
  });

  describe('GET /products/sku/:sku', () => {
    it('should return a product by SKU', async () => {
      await Product.create({
        sku: 'TEST-005',
        name: 'Product 5',
        price: 50,
        stock: 50,
        category: 'cat1',
      });

      const response = await request(app).get('/products/sku/TEST-005').expect(200);

      expect(response.body.sku).toBe('TEST-005');
    });

    it('should return 404 when SKU not found', async () => {
      const response = await request(app).get('/products/sku/NONEXISTENT').expect(404);

      expect(response.body.error.code).toBe('NOT_FOUND');
    });
  });

  describe('PUT /products/:id', () => {
    it('should update a product', async () => {
      const product = await Product.create({
        sku: 'TEST-006',
        name: 'Product 6',
        price: 60,
        stock: 60,
        category: 'cat1',
      });

      const response = await request(app)
        .put(`/products/${product.id}`)
        .send({ name: 'Updated Product', price: 70 })
        .expect(200);

      expect(response.body.name).toBe('Updated Product');
      expect(response.body.price).toBe(70);
    });

    it('should return 404 when updating non-existent product', async () => {
      const response = await request(app)
        .put('/products/99999')
        .send({ name: 'Updated' })
        .expect(404);

      expect(response.body.error.code).toBe('NOT_FOUND');
    });

    it('should return 409 when updating to existing SKU', async () => {
      const product1 = await Product.create({
        sku: 'TEST-007',
        name: 'Product 7',
        price: 70,
        stock: 70,
        category: 'cat1',
      });

      await Product.create({
        sku: 'TEST-008',
        name: 'Product 8',
        price: 80,
        stock: 80,
        category: 'cat1',
      });

      const response = await request(app)
        .put(`/products/${product1.id}`)
        .send({ sku: 'TEST-008' })
        .expect(409);

      expect(response.body.error.code).toBe('CONFLICT');
    });
  });

  describe('DELETE /products/:id', () => {
    it('should delete a product', async () => {
      const product = await Product.create({
        sku: 'TEST-009',
        name: 'Product 9',
        price: 90,
        stock: 90,
        category: 'cat1',
      });

      await request(app).delete(`/products/${product.id}`).expect(204);

      const deletedProduct = await Product.findByPk(product.id);
      expect(deletedProduct).toBeNull();
    });

    it('should return 404 when deleting non-existent product', async () => {
      const response = await request(app).delete('/products/99999').expect(404);

      expect(response.body.error.code).toBe('NOT_FOUND');
    });
  });
});

describe('Health Check', () => {
  it('should return health status', async () => {
    const response = await request(app).get('/health').expect(200);

    expect(response.body).toHaveProperty('status', 'ok');
    expect(response.body).toHaveProperty('timestamp');
  });
});

describe('Home Route', () => {
  it('should return API information', async () => {
    const response = await request(app).get('/').expect(200);

    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('endpoints');
  });
});

describe('404 Handler', () => {
  it('should return 404 for non-existent routes', async () => {
    const response = await request(app).get('/non-existent-route').expect(404);

    expect(response.body.error.code).toBe('NOT_FOUND');
  });
});
