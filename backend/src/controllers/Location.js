const Location = require("../models/Location");
const Person = require("../models/Person");

const createLocation = async (req, res) => {
  try {
    const person = await Person.findByPk(req.body.personId);

    if (!person) {
      return res.status(404).json({ message: "Person not found" });
    }
    const location = await Location.create(req.body);
    res.status(201).json(location);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getLocationById = async (req, res) => {
  try {
    const location = await Location.findOne({
      where: { personId: req.params.personId },
      include: {
        model: Person,
        attributes: ["firstName", "lastName"]
      },
      order: [["timestamp", "DESC"]],
    });

    if (!location) {
      return res.status(404).json({ message: "Location not found" });
    }

    res.json(location);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllLocations = async (req, res) => {
  try {
    const persons = await Person.findAll();

    const locations = [];

    for (const person of persons) {
      const location = await Location.findOne({
        where: { personId: person.personId },
        include: {
          model: Person,
          attributes: ["firstName", "lastName"]
        },
        order: [["timestamp", "DESC"]]
      });

      if (location) {
        locations.push(location);
      }
    }

    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getLocationByClass = async (req, res) => {
  try {
    const persons = await Person.findAll({
      where: { classId: req.params.classId }
    });

    const locations = [];

    for (const person of persons) {
      const location = await Location.findOne({
        where: { personId: person.personId },
        include: {
          model: Person,
          attributes: ["firstName", "lastName"]
        },
        order: [["timestamp", "DESC"]]
      });

      if (location) {
        locations.push(location);
      }
    }

    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = {
  createLocation,
  getLocationById,
  getAllLocations,
  getLocationByClass
};