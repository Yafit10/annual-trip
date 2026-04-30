const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const adminAndTeacherOnly = require("../middleware/adminAndTeacherOnly");
const adminOnly = require("../middleware/adminOnly");

const {


    createLocation,
  getLocationById,
  getAllLocations,
  getLocationByClass
} = require("../controllers/Location");

router.get("/", getAllLocations);

router.get("/class/:classId",auth, adminAndTeacherOnly, getLocationByClass);
router.get("/:personId", getLocationById);
router.post("/", createLocation);

module.exports = router;