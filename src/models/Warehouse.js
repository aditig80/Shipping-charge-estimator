const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Warehouse = sequelize.define('Warehouse', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  lat: { type: DataTypes.FLOAT, allowNull: false },
  lng: { type: DataTypes.FLOAT, allowNull: false },
  city: { type: DataTypes.STRING },
  capacity: { type: DataTypes.INTEGER },    // max stock units
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
});

module.exports = Warehouse;