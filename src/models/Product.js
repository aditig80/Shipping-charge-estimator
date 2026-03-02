const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  sellingPrice: { type: DataTypes.FLOAT, allowNull: false },
  weightKg: { type: DataTypes.FLOAT, allowNull: false },    // in KG
  dimLength: { type: DataTypes.FLOAT },   // in cm
  dimWidth: { type: DataTypes.FLOAT },
  dimHeight: { type: DataTypes.FLOAT },
  category: { type: DataTypes.STRING },   // e.g., Grocery, Beverages
  sku: { type: DataTypes.STRING },
  stock: { type: DataTypes.INTEGER, defaultValue: 0 },
  sellerId: { type: DataTypes.INTEGER, allowNull: false },
});

module.exports = Product;