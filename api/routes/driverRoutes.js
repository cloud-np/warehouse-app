const express = require("express");
const router = express.Router();
// const { validateDriverCreate } = require("../middleware/validators/driverValidator");
const { getDrivers, getDriverStatus } = require("../controllers/driverController");

router.get("/", getDrivers);
// router.post("/", validateDriverCreate, createDriver);
router.get("/driver-status/:id", getDriverStatus);

module.exports = router;