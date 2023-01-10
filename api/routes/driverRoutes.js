const express = require("express");
const router = express.Router();
const { validateDriverCreate } = require("../middleware/validators/driverValidator");
const { getDrivers, getDriversByCluster, createDriver } = require("../controllers/driverController");

router.get("/", getDrivers);
router.get("/:cluster_id", getDriversByCluster);
router.post("/", validateDriverCreate, createDriver);

module.exports = router;