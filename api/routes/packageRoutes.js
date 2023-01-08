const express = require("express");
const router = express.Router();
const { getPackagesByCluster, packagePickedByDriver, scanPackage } = require("../controllers/packageController");
const { validatePackagePickedByDriver } = require("../middleware/validators/packageValidator");

router.post("/", scanPackage);
router.get("/:cluster_id", getPackagesByCluster);
router.put("/package-picked-by-driver", validatePackagePickedByDriver, packagePickedByDriver);

module.exports = router;