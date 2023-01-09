const express = require("express");
const router = express.Router();
const { validateDriverCreate } = require("../middleware/validators/driverValidator");
const { getDrivers, getDriverStatus, getDriversByCluster, createDriver } = require("../controllers/driverController");

router.get("/", getDrivers);
router.get("/:cluster_id", getDriversByCluster);
router.post("/", validateDriverCreate, createDriver);
router.get("/driver-status/:id", getDriverStatus);

module.exports = router;