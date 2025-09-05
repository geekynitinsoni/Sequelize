const { DataTypes } = require("sequelize");

const sequelize = require("../db");
const User = sequelize.define(
  "User",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    modifiedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = User;
