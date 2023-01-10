const asyncHandler = require('express-async-handler')
const { QueryFailureError } = require('../errors/databaseRelatedErrors');

const Cluster = require('../models/clusterModel')

// @desc    Get clusters
// @route   GET /api/clusters
// @access  Private
const getClusters = asyncHandler(async (req, res, next) => {
  try {
    const clusters = await Cluster.findAll();
    res.status(200).json(clusters);
  } catch (err) {
    next(err);
  }
});

// @desc    Set cluster
// @route   POST /api/clusters
// @access  Private
const createCluster = asyncHandler(async (req, res, next) => {
  try {
    const cluster = await new Cluster({ ...req.body }).saveToDB();
    if (!cluster) {
      throw new QueryFailureError("Cluster could not be created.");
    }
    res.status(200).json(cluster.toJson());
  } catch (err) {
    next(err);
  }
});

module.exports = {
  getClusters,
  createCluster,
}