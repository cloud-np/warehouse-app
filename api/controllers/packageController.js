const asyncHandler = require('express-async-handler')
const { RowFoundException, MissingRowError, QueryFailureError } = require('../errors/databaseRelatedErrors');

const Cluster = require('../models/clusterModel')
const Package = require('../models/packageModel')
const Driver = require('../models/driverModel')


// @desc    Get all packages
// @route   GET /api/packages
// @access  Private
const getPackages = asyncHandler(async (req, res, next) => {
    try {
        let pageNum = req.params.pageNum;

        // In case of bad input from front-end
        if (req.params.pageNum < 0) {
            pageNum = 0;
        }

        const packages = await Package.getPackagesOrdered(5, 5 * pageNum);
        res.status(200).json(packages.rows);
    } catch (err) {
        next(err);
    }
});

// @desc    Get packages by cluster
// @route   GET /api/packages/:cluster_id
// @access  Private
const getPackagesByCluster = asyncHandler(async (req, res, next) => {
    try {
        const cluster = await Cluster.findById(req.params.cluster_id);
        if (!cluster) {
            throw new MissingRowError("Cluster not found.");
        }

        const packages = await Package.getPackagesByCluster(req.params.cluster_id);
        res.status(200).json(packages.rows);
    } catch (err) {
        next(err);
    }
});

// @desc    Create a package
// @route   POST /api/pacakges/
// @access  Private
const createPackage = asyncHandler(async (req, res, next) => {
    try {
        const packages = await Package.findByColumn("voucher", req.body.voucher);

        if (packages.length > 0) {
            throw new RowFoundException("Voucher already exist for package.");
        }

        // If the postcode does not corrispond to an 
        // existing cluster, then do not create the package. 
        const ccode = req.body.postcode.substring(0, 2);
        const cluster = await Cluster.findByColumn("ccode", ccode);
        if (cluster.length === 0) {
            throw new MissingRowError(`There is no Cluster with code: ${ccode}`);
        }

        const package = await new Package({ ...req.body }).saveToDB();
        if (!package) {
            throw new QueryFailureError("Package could not be created.");
        }
        res.status(200).json(package.toJson());
    } catch (err) {
        next(err);
    }
});

// @desc    Package got picked up by driver
// @route   PUT /api/packages/package-picked-by-driver
// @access  Private
const packagePickedByDriver = asyncHandler(async (req, res, next) => {
    try {
        const package = await Package.findById(req.body.package_id)
        let driver = null;

        // If driver_id is not provided, then we will pick the driver based on the cluster_id
        // Since there is only one driver in each cluster. Later on if we have more than one drivers
        // this should be reworked. But the assignment assumes one driver per cluster for now.
        if (!req.body.driver_id) {
            driver = await Driver.findByColumn("cluster_id", package.cluster_id);
            driver = driver[0];
        } else {
            driver = await Driver.findById(req.body.driver_id);
        }

        if (!driver) {
            throw new MissingRowError("Driver not found.");
        }

        if (!package) {
            throw new MissingRowError("Package not found.")
        }

        if (driver.cluster_id !== package.cluster_id){
            throw new MissingRowError("Driver and package are not in the same cluster");
        }

        if (await Package.packagePickedByDriver(driver.id, package.id)) {
            res.status(200).json({ message: 'Package picked up by driver' });
        }else{
            throw new QueryFailureError("Package could not be picked up by driver.");
        }
    } catch (err) {
        next(err);
    }
});

module.exports = {
    packagePickedByDriver,
    createPackage,
    getPackages,
    getPackagesByCluster
}