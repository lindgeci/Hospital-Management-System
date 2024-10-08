// backend/models/Medicine.js
const { DataTypes } = require('sequelize'); // Import DataTypes for defining model fields
const sequelize = require('../config/database'); // Import the Sequelize instance
const Patient = require('./Patient');
const Medicine = sequelize.define('Medicine', {
  Medicine_ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  M_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  M_Quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  M_Cost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  Patient_ID: {
    type: DataTypes.INTEGER,
    references: {
      model: 'patient', // Refer to the patient table
      key: 'Patient_ID', // Refer to the correct field in the patient table
    },
  },
}, {
  tableName: 'medicine',
  timestamps: false,
});
Medicine.belongsTo(Patient, {foreignKey: 'Patient_ID'});
module.exports = Medicine;
