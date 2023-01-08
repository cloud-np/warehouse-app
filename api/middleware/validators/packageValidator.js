const { validateBodyVars } = require("../../utils/dataCheck");

const validatePackageCreate = (req, res, next) => {
    if (!validateBodyVars({voucher: req.body['voucher'], postcode: req.body['postcode'], cluster_id: req.body['cluster_id']})){
        res.status(400).send({ message: 'Please provide correct information to create scan a Package.' });
        return;
    }
    next();
}

const validatePackagePickedByDriver = (req, res, next) => {
    if (!validateBodyVars({package_id: req.body['package_id'], driver_id: req.body['driver_id']})){
        res.status(400).send({ message: 'Please provide correct information to for a Driver to pick up the Package.' });
        return;
    }
    next();
}
module.exports = {
    validatePackageCreate,
    validatePackagePickedByDriver,
};