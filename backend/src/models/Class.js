const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Class = sequelize.define("Class", {
  gradeName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  number: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
}, 
);

module.exports = Class;