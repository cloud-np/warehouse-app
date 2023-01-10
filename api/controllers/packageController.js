const asyncHandler = require('express-async-handler')

const Cluster = require('../models/clusterModel')
const Package = require('../models/packageModel')
const Driver = require('../models/driverModel')


// @desc    Get all packages
// @route   GET /api/packages
// @access  Private
const getPackages = asyncHandler(async (req, res) => {
    let pageNum = req.params.pageNum;
    console.log(pageNum);

    if (req.params.pageNum < 0) pageNum = 0;

    const packages = await Package.getPackagesOrdered(5, 5 * pageNum);
    return res.status(200).json(packages.rows);
});

// @desc    Get packages by cluster
// @route   GET /api/packages/:cluster_id
// @access  Private
const getPackagesByCluster = asyncHandler(async (req, res) => {
    const cluster = await Cluster.findById(req.params.cluster_id);
    if (!cluster) {
        return res.status(400).json({ message: 'Cluster not found.' });
    }
    const packages = await Package.getPackagesByCluster(req.params.cluster_id);
    return res.status(200).json(packages.rows);
});

// // @desc    Get packages by cluster
// // @route   GET /api/packages
// // @access  Private
// const getPackagesPickedByDrivers = asyncHandler(async (req, res) => {
//     const drivers = await Driver.findAll();
//     res.status(200).json(drivers);
// });

// @desc    Create a package
// @route   POST /api/pacakges/
// @access  Private
const createPackage = asyncHandler(async (req, res) => {
    const packages = await Package.findByColumn("voucher", req.body.voucher);

    if (packages.length > 0){
        return res.status(400).json({ message: 'Voucher already exist for package.' });
    }

    // If we the postcode does not corrispond to an 
    // existing cluster, then do not create the package. 
    const ccode = req.body.postcode.substring(0, 2);
    const cluster = await Cluster.findByColumn("ccode", ccode);
    if (cluster.length === 0){
        return res.status(400).json({ message: `There is no Cluster with code: ${ccode}` });
    }

    const package = await new Package({ ...req.body }).saveToDB();
    if (!package) {
        return res.status(400).json({ message: 'Package could not be created.' });
    }
    return res.status(200).json(package.toJson());
});

// @desc    Package got picked up by driver
// @route   PUT /api/packages/package-picked-by-driver
// @access  Private
const packagePickedByDriver = asyncHandler(async (req, res) => {
    const package = await Package.findById(req.body.package_id)
    let driver = null;

    // If driver_id is not provided, then we will pick the driver based on the cluster_id
    // Since there is only one driver in each cluster. Later on if we have more than one drivers
    // this should be reworked. But the assignment assumes one driver per cluster for now.
    if (!req.body.driver_id){
        driver = await Driver.findByColumn("cluster_id", package.cluster_id);
        driver = driver[0];
    }else{
        driver = await Driver.findById(req.body.driver_id);
    }

    if (!driver)                                  return res.status(400).json({ message: 'Driver not found' });
    if (!package)                                 return res.status(400).json({ message: 'Package not found' });
    if (driver.cluster_id !== package.cluster_id) return res.status(400).json({ message: 'Driver and package are not in the same cluster' });

    if (await Package.packagePickedByDriver(driver.id, package.id)){
        return res.status(200).json({ message: 'Package picked up by driver' });
    }
    return res.status(400).json({ message: 'Something went wrong.'})
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
    createPackage,
    getPackages,
    getPackagesByCluster
}