const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Customer = sequelize.define('Customer', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING },
  address: { type: DataTypes.STRING },        // street address
  city: { type: DataTypes.STRING },
  pincode: { type: DataTypes.STRING },
  lat: { type: DataTypes.FLOAT, allowNull: false },
  lng: { type: DataTypes.FLOAT, allowNull: false },
  gstNumber: { type: DataTypes.STRING },      // B2B specific
  businessType: { type: DataTypes.STRING },   // e.g., Kirana, Wholesale
});

module.exports = Customer;