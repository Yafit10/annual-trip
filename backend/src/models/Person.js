const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Class = require("./Class");

const Person = sequelize.define("Person", {
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [["student", "teacher", "admin"]]
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  personId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  classId: {
    type: DataTypes.INTEGER,
    allowNull: false,

    
  }
});

Person.belongsTo(Class, { foreignKey: "classId" });

module.exports = Person;