const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Seller = sequelize.define('Seller', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING },
  gstNumber: { type: DataTypes.STRING },
  address: { type: DataTypes.STRING },
  city: { type: DataTypes.STRING },
  lat: { type: DataTypes.FLOAT, allowNull: false },
  lng: { type: DataTypes.FLOAT, allowNull: false },
  rating: { type: DataTypes.FLOAT, defaultValue: 0 },
});

module.exports = Seller;