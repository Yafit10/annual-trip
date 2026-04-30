const Person = require("../models/Person");
const Class = require("../models/Class");

const getAllPeople = async (req, res) => {
  try {
const people = await Person.findAll({
  include: Class
});    res.json(people);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getPeopleByClass = async (req, res) => {
  try {
    const people = await Person.findAll({ 
 where: { classId: req.params.classId },
      include: Class
    });
        res.json(people);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const createPerson = async (req, res) => {
  try {
    const person = await Person.create(req.body);
    res.status(201).json(person);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
module.exports = {
  getAllPeople,
  createPerson,
  getPeopleByClass
};