const asyncHandler = require('express-async-handler')

const Driver = require('../models/driverModel')

// @desc    Get drivers
// @route   GET /api/drivers
// @access  Private
const getDrivers = asyncHandler(async (req, res) => {
    const drivers = await Driver.findAll();
    res.status(200).json(drivers);
});

// @desc    Set driver
// @route   POST /api/drivers
// @access  Private
const createDriver = asyncHandler(async (req, res) => {
    const driver = await new Driver({ ...req.body, is_ready: true }).saveToDB();
    if (!driver) {
        res.status(400).json({ message: 'Driver could not be created.' });
    }
    res.status(200).json(driver.toJson());
});


// @desc    Update driver
// @route   PUT /api/drivers/:id
// @access  Private
const updateDriver = asyncHandler(async (req, res) => {
    const driver = await Driver.findById(req.params.id)

    if (!driver) {
        res.status(400)
        throw new Error('driver not found')
    }

    const updatedDriver = await Driver.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    })

    res.status(200).json(updatedDriver)
});

module.exports = {
    getDrivers,
    createDriver
}