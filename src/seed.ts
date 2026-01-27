import sequelize from './config/database.js';
import Product from './models/Product.js';

const seedDatabase = async () => {
  try {
    console.log('🌱 Seeding database...');

    // Conectar ao banco de dados
    await sequelize.authenticate();
    console.log('✓ Database connected');

    // Sincronizar modelos (cria as tabelas se não existirem)
    await sequelize.sync({ force: true }); // force: true recria as tabelas
    console.log('✓ Database synchronized');

    // Criar produtos iniciais
    const products = [
      { sku: 'BEB-0001', name: 'Coca-Cola 350ml', price: 5.5, stock: 25, category: 'refrigerante' },
      {
        sku: 'BEB-0002',
        name: 'Guaraná Antarctica 350ml',
        price: 4.5,
        stock: 30,
        category: 'refrigerante',
      },
      { sku: 'BEB-0003', name: 'Água Mineral 500ml', price: 3.0, stock: 50, category: 'agua' },
      { sku: 'BEB-0004', name: 'Suco de Laranja 300ml', price: 6.0, stock: 0, category: 'suco' },
      {
        sku: 'BEB-0005',
        name: 'Cerveja Heineken 350ml',
        price: 8.0,
        stock: 40,
        category: 'cerveja',
      },
      {
        sku: 'BEB-0006',
        name: 'Energético Red Bull 250ml',
        price: 12.0,
        stock: 15,
        category: 'energetico',
      },
      { sku: 'BEB-0007', name: 'Pepsi 350ml', price: 5.0, stock: 20, category: 'refrigerante' },
      { sku: 'BEB-0008', name: 'Água de Coco 330ml', price: 4.0, stock: 35, category: 'agua' },
      {
        sku: 'BEB-0009',
        name: 'Suco de Uva Integral 1L',
        price: 12.0,
        stock: 10,
        category: 'suco',
      },
      {
        sku: 'BEB-0010',
        name: 'Cerveja Budweiser 350ml',
        price: 7.5,
        stock: 30,
        category: 'cerveja',
      },
    ];

    await Product.bulkCreate(products);
    console.log(`✓ Created ${products.length} products`);

    console.log('✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
