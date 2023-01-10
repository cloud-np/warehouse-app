const express = require("express");
const router = express.Router();
const { getPackagesByCluster, packagePickedByDriver, createPackage, getPackages } = require("../controllers/packageController");
const { validatePackageCreate, validatePackagePickedByDriver } = require("../middleware/validators/packageValidator");

router.get("/:pageNum", getPackages);
router.get("/by-cluster/:cluster_id", getPackagesByCluster);
router.post("/", validatePackageCreate, createPackage);
router.put("/package-picked-by-driver", validatePackagePickedByDriver, packagePickedByDriver);

module.exports = router;