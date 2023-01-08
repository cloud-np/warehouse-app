const express = require("express");
const router = express.Router();
const { validateDriverCreate } = require("../middleware/validators/driverValidator");
const { getDrivers, createDriver } = require("../controllers/driverController");

router.get("/", getDrivers);
router.post("/", validateDriverCreate, createDriver);

module.exports = router;