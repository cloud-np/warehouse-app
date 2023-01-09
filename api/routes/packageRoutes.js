const express = require("express");
const router = express.Router();
const { getPackagesByCluster, packagePickedByDriver, createPackage, getPackages } = require("../controllers/packageController");
const { validatePackageCreate, validatePackagePickedByDriver } = require("../middleware/validators/packageValidator");

router.get("/:pageNum", getPackages);
router.post("/", validatePackageCreate, createPackage);
router.get("/:cluster_id", getPackagesByCluster);
router.put("/package-picked-by-driver", validatePackagePickedByDriver, packagePickedByDriver);

module.exports = router;