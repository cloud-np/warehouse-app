const asyncHandler = require('express-async-handler');
const Cluster = require('../models/clusterModel');

const Driver = require('../models/driverModel')

// @desc    Get drivers
// @route   GET /api/drivers
// @access  Private
const getDrivers = asyncHandler(async (req, res) => {
    const drivers = await Driver.findAll();
    res.status(200).json(drivers);
});

// @desc    Get drivers by Cluster
// @route   GET /api/drivers
// @access  Private
const getDriversByCluster = asyncHandler(async (req, res) => {
    const drivers = await Driver.findByColumn("cluster_id", req.params.cluster_id);
    if (!drivers) {
        return res.status(400).json({ message: 'Cluster or drivers not found.' });
    }
    return res.status(200).json(drivers);
});

// @desc    Create driver
// @route   POST /api/drivers
// @access  Private
const createDriver = asyncHandler(async (req, res) => {
    // For now each cluster can have only one driver based on the requirements/assignment.
    const drivers = await Driver.findByColumn("cluster_id", req.body.cluster_id);
    if (drivers.length > 0){
        return res.status(400).json({ message: 'Cluster already has a driver.' });
    }

    const driver = await new Driver({ ...req.body, is_ready: false }).saveToDB();
    if (!driver) {
        return res.status(400).json({ message: 'Driver could not be created.' });
    }
    return res.status(200).json(driver.toJson());
});


// @desc    Get the driver's status
// @route   PUT /api/drivers/driver-status/:id
// @access  Private
const getDriverStatus = asyncHandler(async (req, res) => {
    const driver = await Driver.findById(req.params.id)

    if (!driver) {
        return res.status(400).json({ message: 'Driver could not be found.' });
    }

    return res.status(200).json({ is_ready: driver.is_ready })
});

module.exports = {
    getDrivers,
    createDriver,
    getDriverStatus,
    getDriversByCluster 
}