const asyncHandler = require('express-async-handler');
const { RowFoundException, MissingRowError, QueryFailureError } = require('../errors/databaseRelatedErrors');
const Driver = require('../models/driverModel')

// @desc    Get drivers
// @route   GET /api/drivers
// @access  Private
const getDrivers = asyncHandler(async (req, res, next) => {
    try {
        const drivers = await Driver.findAllWithPackagesLeft();
        res.status(200).json(drivers.rows);
    } catch (err) {
        next(err);
    }
});

// @desc    Get drivers by Cluster
// @route   GET /api/drivers
// @access  Private
const getDriversByCluster = asyncHandler(async (req, res, next) => {
    try {
        let drivers = await Driver.findByColumn("cluster_id", req.params.cluster_id);

        if (drivers.length === 0) {
            return res.status(200).json(drivers);
        }

        drivers = await Driver.findClusterDriverWithPackagesLeft(req.params.cluster_id);

        return res.status(200).json(drivers.rows);
    } catch (err) {
        next(err);
    }
});


// @desc    Create driver
// @route   POST /api/drivers
// @access  Private
const createDriver = asyncHandler(async (req, res, next) => {
    try {
        // For now each cluster can have only one driver based on the requirements/assignment.
        const drivers = await Driver.findByColumn("cluster_id", req.body.cluster_id);
        if (drivers.length > 0) {
            throw new RowFoundException("Cluster already has a driver.")
        }

        const driver = await new Driver({ ...req.body, is_ready: false }).saveToDB();
        if (!driver) {
            throw new QueryFailureError("Driver could not be created.");
        }
        return res.status(200).json(driver.toJson());
    } catch (err) {
        next(err);
    }
});


// Used for debugging purposes
// @desc    Get the driver's status
// @route   PUT /api/drivers/driver-status/:id
// @access  Private
const getDriverStatus = asyncHandler(async (req, res, next) => {
    try {
        const driver = await Driver.findById(req.params.id)

        if (!driver) {
            throw new MissingRowError("Driver could not be found.");
        }

        return res.status(200).json({ is_ready: driver.is_ready })
    } catch (err) {
        next(err);
    }
});

module.exports = {
    getDrivers,
    createDriver,
    // getDriverStatus,
    getDriversByCluster
}