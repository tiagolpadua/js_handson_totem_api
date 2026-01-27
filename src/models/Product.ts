import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database.js';
import type { Product as IProduct } from '../types/index.js';

type ProductCreationAttributes = Optional<IProduct, 'id' | 'createdAt' | 'updatedAt'>;

class Product extends Model<IProduct, ProductCreationAttributes> implements IProduct {
  declare id: number;
  declare sku: string;
  declare name: string;
  declare price: number;
  declare stock: number;
  declare category: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    sku: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
      },
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [3, 255],
      },
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  },
  {
    sequelize,
    tableName: 'products',
    timestamps: true,
  }
);

export default Product;
