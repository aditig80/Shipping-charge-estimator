const sequelize = require('../config/database');
const Customer = require('./Customer');
const Seller = require('./Seller');
const Product = require('./Product');
const Warehouse = require('./Warehouse');

// Seller has many Products
Seller.hasMany(Product, { foreignKey: 'sellerId' });
Product.belongsTo(Seller, { foreignKey: 'sellerId' });

const syncDB = async () => {
  await sequelize.sync({ alter: true });
  console.log('Database synced');
};

module.exports = { sequelize, Customer, Seller, Product, Warehouse, syncDB };