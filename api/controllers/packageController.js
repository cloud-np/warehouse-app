const asyncHandler = require('express-async-handler')

const Cluster = require('../models/clusterModel')
const Package = require('../models/packageModel')
const Driver = require('../models/driverModel')

// @desc    Get packages by cluster
// @route   GET /api/packages/:cluster_id
// @access  Private
const getPackagesByCluster = asyncHandler(async (req, res) => {
    const cluster = await Cluster.findById(req.params.cluster_id);
    if (!cluster) {
        return res.status(400).json({ message: 'Cluster not found.' });
    }

    const packages = await Package.findByColumn("cluster_id", req.params.cluster_id);
    res.status(200).json(packages);
});

// // @desc    Get packages by cluster
// // @route   GET /api/packages
// // @access  Private
// const getPackagesPickedByDrivers = asyncHandler(async (req, res) => {
//     const drivers = await Driver.findAll();
//     res.status(200).json(drivers);
// });

// @desc    Scan a package
// @route   POST /api/pacakges/
// @access  Private
const scanPackage = asyncHandler(async (req, res) => {
    const package = await new Package({ ...req.body, scanned_at: new Date().toISOString()}).saveToDB();
    if (!package) {
        res.status(400).json({ message: 'Package could not be created.' });
    }
    res.status(200).json(package.toJson());
});

// @desc    Package got picked up by driver
// @route   PUT /api/packages/package-picked-by-driver
// @access  Private
const packagePickedByDriver = asyncHandler(async (req, res) => {
    const driver = await Driver.findById(req.body.driver_id)
    const package = await Package.findById(req.body.package_id)

    if (!driver)  return res.status(400).json({ message: 'Driver not found' });
    if (!package) return res.status(400).json({ message: 'Package not found' });

    if (await Package.packagePickedByDriver(driver.id, package.id)){
        return res.status(200).json({ message: 'Package picked up by driver' });
    }
});

// @desc    Update package
// @route   PUT /api/drivers/:id
// @access  Private
const updatePackage = asyncHandler(async (req, res) => {
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
    packagePickedByDriver,
    scanPackage,
    getPackagesByCluster
}