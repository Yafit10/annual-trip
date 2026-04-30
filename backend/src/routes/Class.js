const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const adminOnly = require("../middleware/adminOnly");

const {
  getAllClasses,
  createClass
} = require("../controllers/Class");

router.get("/", auth,adminOnly, getAllClasses);
router.post("/", auth, adminOnly, createClass);

module.exports = router;