const Class = require("../models/Class");

const getAllClasses = async (req, res) => {
  try {
    const classes = await Class.findAll();
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createClass = async (req, res) => {
  try {
    const classe = await Class.create(req.body);
    res.status(201).json(classe);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
module.exports = {
  getAllClasses,
  createClass
};