import sequelize from '../config/testDatabase.js';
import Product from './Product.js';

describe('Product Model', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  beforeEach(async () => {
    await Product.destroy({ where: {} });
  });

  describe('Product Creation', () => {
    it('should create a product with valid data', async () => {
      const product = await Product.create({
        sku: 'TEST-001',
        name: 'Test Product',
        price: 10.5,
        stock: 100,
        category: 'test',
      });

      expect(product.id).toBeDefined();
      expect(product.sku).toBe('TEST-001');
      expect(product.name).toBe('Test Product');
      expect(product.price).toBe(10.5);
      expect(product.stock).toBe(100);
      expect(product.category).toBe('test');
      expect(product.createdAt).toBeDefined();
      expect(product.updatedAt).toBeDefined();
    });

    it('should fail to create product without required fields', async () => {
      await expect(
        Product.create({
          sku: 'TEST-002',
          name: 'Test Product',
          // missing price
          stock: 100,
          category: 'test',
        } as any)
      ).rejects.toThrow();
    });

    it('should fail to create product with duplicate SKU', async () => {
      await Product.create({
        sku: 'TEST-003',
        name: 'Product 1',
        price: 10,
        stock: 10,
        category: 'test',
      });

      await expect(
        Product.create({
          sku: 'TEST-003',
          name: 'Product 2',
          price: 20,
          stock: 20,
          category: 'test',
        })
      ).rejects.toThrow();
    });

    it('should fail to create product with empty name', async () => {
      await expect(
        Product.create({
          sku: 'TEST-004',
          name: '',
          price: 10,
          stock: 10,
          category: 'test',
        })
      ).rejects.toThrow();
    });

    it('should fail to create product with negative price', async () => {
      await expect(
        Product.create({
          sku: 'TEST-005',
          name: 'Test Product',
          price: -10,
          stock: 10,
          category: 'test',
        })
      ).rejects.toThrow();
    });

    it('should fail to create product with negative stock', async () => {
      await expect(
        Product.create({
          sku: 'TEST-006',
          name: 'Test Product',
          price: 10,
          stock: -5,
          category: 'test',
        })
      ).rejects.toThrow();
    });
  });

  describe('Product Updates', () => {
    it('should update product successfully', async () => {
      const product = await Product.create({
        sku: 'TEST-007',
        name: 'Original Name',
        price: 10,
        stock: 10,
        category: 'test',
      });

      await product.update({
        name: 'Updated Name',
        price: 20,
      });

      expect(product.name).toBe('Updated Name');
      expect(product.price).toBe(20);
    });
  });

  describe('Product Queries', () => {
    beforeEach(async () => {
      await Product.bulkCreate([
        { sku: 'TEST-008', name: 'Product A', price: 10, stock: 10, category: 'cat1' },
        { sku: 'TEST-009', name: 'Product B', price: 20, stock: 0, category: 'cat2' },
        { sku: 'TEST-010', name: 'Product C', price: 30, stock: 30, category: 'cat1' },
      ]);
    });

    it('should find product by primary key', async () => {
      const products = await Product.findAll();
      const firstProduct = products[0];

      const found = await Product.findByPk(firstProduct.id);

      expect(found).toBeDefined();
      expect(found?.id).toBe(firstProduct.id);
    });

    it('should find product by SKU', async () => {
      const found = await Product.findOne({ where: { sku: 'TEST-008' } });

      expect(found).toBeDefined();
      expect(found?.sku).toBe('TEST-008');
    });

    it('should find all products', async () => {
      const products = await Product.findAll();

      expect(products).toHaveLength(3);
    });

    it('should delete product successfully', async () => {
      const product = await Product.findOne({ where: { sku: 'TEST-008' } });

      await product?.destroy();

      const found = await Product.findOne({ where: { sku: 'TEST-008' } });
      expect(found).toBeNull();
    });
  });
});
