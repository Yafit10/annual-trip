const jwt = require("jsonwebtoken");
const Person = require("../models/Person");

const login = async (req, res) => {
  try {
    const { personId, password } = req.body;

    if (!personId || !password) {
      return res.status(400).json({ message: "personId and password are required" });
    }

    const person = await Person.findOne({
      where: { personId }
    });

    if (!person) {
      return res.status(401).json({ message: "Invalid ID or password" });
    }

    if (person.password !== password) {
      return res.status(401).json({ message: "Invalid ID or password" });
    }

    const token = jwt.sign(
      {
        id: person.id,
        personId: person.personId,
        role: person.role,
        classId: person.classId
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  login
};