const asyncHandler = require('express-async-handler')

const Driver = require('../models/driverModel')

// @desc    Get drivers
// @route   GET /api/drivers
// @access  Private
const getDrivers = asyncHandler(async (req, res) => {
    const drivers = await Driver.findAll();
    res.status(200).json(drivers);
});

// @desc    Create driver
// @route   POST /api/drivers
// @access  Private
const createDriver = asyncHandler(async (req, res) => {
    const driver = await new Driver({ ...req.body, is_ready: true }).saveToDB();
    if (!driver) {
        res.status(400).json({ message: 'Driver could not be created.' });
    }
    res.status(200).json(driver.toJson());
});


// @desc    Get the driver's status
// @route   PUT /api/drivers/driver-status/:id
// @access  Private
const getDriverStatus = asyncHandler(async (req, res) => {
    const driver = await Driver.findById(req.params.id)

    if (!driver) {
        res.status(400).json({ message: 'Driver could not be found.' });
    }

    res.status(200).json({ is_ready: driver.is_ready })
});

module.exports = {
    getDrivers,
    // createDriver,
    getDriverStatus,
}