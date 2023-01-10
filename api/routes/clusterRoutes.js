const express = require("express");
const router = express.Router();
const { validateClusterCreate } = require("../middleware/validators/clusterValidator");
const {
    getClusters, 
    createCluster, 
} = require("../controllers/clusterController");


router.get("/", getClusters);
router.post("/", validateClusterCreate, createCluster);


module.exports = router;
