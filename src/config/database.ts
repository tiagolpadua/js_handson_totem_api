import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const DATABASE_PATH = process.env.DATABASE_PATH || './database.sqlite';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: DATABASE_PATH,
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
});

export const connectDatabase = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('✓ Database connected successfully');
    await sequelize.sync({ alter: true });
    console.log('✓ Database synchronized');
  } catch (error) {
    console.error('✗ Unable to connect to database:', error);
    throw error;
  }
};

export default sequelize;
