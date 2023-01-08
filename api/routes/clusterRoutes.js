const express = require("express");
const router = express.Router();
const { validateClusterCreate } = require("../middleware/validators/clusterValidator");
const {
    getClusters, 
    createCluster, 
} = require("../controllers/clusterController");


router.get("/", getClusters);
router.post("/", validateClusterCreate, createCluster);
// router.get("/:clusterId", (req, res) => res.send("Get one cluster"));
// router.put("/clusters", (req, res) => res.send("Update clusters"));
// router.delete("/", (req, res) => res.send("Delete clusters"));


module.exports = router;
