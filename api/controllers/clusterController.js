const asyncHandler = require('express-async-handler')

const Cluster = require('../models/clusterModel')

// @desc    Get clusters
// @route   GET /api/clusters
// @access  Private
const getClusters = asyncHandler(async (req, res) => {
  const clusters = await Cluster.find({ user: req.user.id })

  res.status(200).json(clusters)
})

// @desc    Set cluster
// @route   POST /api/clusters
// @access  Private
const setCluster = asyncHandler(async (req, res) => {
  if (!req.body.text) {
    res.status(400)
    throw new Error('Please add a text field')
  }

  const cluster = await Cluster.create({
    text: req.body.text,
    user: req.user.id,
  })

  res.status(200).json(cluster)
})

// @desc    Update cluster
// @route   PUT /api/clusters/:id
// @access  Private
const updateCluster = asyncHandler(async (req, res) => {
  const cluster = await Cluster.findById(req.params.id)

  if (!cluster) {
    res.status(400)
    throw new Error('Cluster not found')
  }

  const updatedCluster = await Cluster.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  })

  res.status(200).json(updatedCluster)
})

// @desc    Delete cluster
// @route   DELETE /api/clusters/:id
// @access  Private
const deleteCluster = asyncHandler(async (req, res) => {
  const cluster = await Cluster.findById(req.params.id)

  if (!cluster) {
    res.status(400)
    throw new Error('Cluster not found')
  }

  await cluster.remove()

  res.status(200).json({ id: req.params.id })
})

module.exports = {
  getClusters,
  setCluster,
  updateCluster,
  deleteCluster,
}