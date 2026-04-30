const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const sequelize = require("./config/db");
const classRoutes = require("./routes/Class");
const personRoutes = require("./routes/Person");
const locationRoutes = require("./routes/Location");
const loginRoutes = require("./routes/Login");
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/classes", classRoutes);
app.use("/api/persons", personRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/login", loginRoutes);
app.get("/", (req, res) => {
  res.send("API is running");
});

const PORT = process.env.PORT || 5000;

sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected");

    return sequelize.sync();
  })
  .then(() => {
    console.log("Models synced");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("DB connection error:", error);
  });