const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Person = require("./Person");

const Location = sequelize.define("Location", {
  personId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  longitude: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  latitude: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false
  }
});

Location.belongsTo(Person, {
  foreignKey: "personId",
  targetKey: "personId"
});

module.exports = Location;