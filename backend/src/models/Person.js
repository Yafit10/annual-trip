const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Class = require("./Class");
const isValidPersonId = (id) => {
  if (!/^\d{9}$/.test(id)) {
    return false;
  }

  let sum = 0;

  for (let i = 0; i < 9; i++) {
    let num = Number(id[i]) * ((i % 2) + 1);

    if (num > 9) {
      num -= 9;
    }

    sum += num;
  }

  return sum % 10 === 0;
};
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
    validate: {
      isValidId(value) {
        if (!isValidPersonId(value)) {
          throw new Error("Invalid person ID");
        }
      }
    }
  },
  classId: {
    type: DataTypes.INTEGER,
    allowNull: false,


  }
});

Person.belongsTo(Class, { foreignKey: "classId" });

module.exports = Person;