const express = require("express");
const router = express.Router();

// const { getCluster,
//     getClusters, 
//     createCluster, 
//     updateCluster, 
//     deleteCluster
// } = require("../controllers/clusterController");

router.get("/", (req, res) => res.send("Get all clusters"));
router.get("/:clusterId", (req, res) => res.send("Get one cluster"));
router.post("/", (req, res) => res.send("Create clusters"));
// router.put("/clusters", (req, res) => res.send("Update clusters"));
router.delete("/", (req, res) => res.send("Delete clusters"));


module.exports = router;
