const asyncHandler = require('express-async-handler')

const Cluster = require('../models/clusterModel')

// @desc    Get clusters
// @route   GET /api/clusters
// @access  Private
const getClusters = asyncHandler(async (req, res) => {
  const clusters = await Cluster.findAll();
  res.status(200).json(clusters);
});

// @desc    Set cluster
// @route   POST /api/clusters
// @access  Private
const createCluster = asyncHandler(async (req, res) => {
  const cluster = await new Cluster({ ...req.body }).saveToDB();
  if (!cluster) {
    res.status(400).json({ message: 'Cluster could not be created.' });
  }
  res.status(200).json(cluster.toJson());
});

module.exports = {
  getClusters,
  createCluster,
}