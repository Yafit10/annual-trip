const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const adminAndTeacherOnly = require("../middleware/adminAndTeacherOnly");
const adminOnly = require("../middleware/adminOnly");

const {
  getAllPeople,
  getPeopleByClass,
  createPerson
} = require("../controllers/Person");

router.get("/", auth, adminOnly, getAllPeople);
router.get("/:classId", auth, adminAndTeacherOnly, getPeopleByClass);
router.post("/", auth, adminAndTeacherOnly, createPerson);

module.exports = router;