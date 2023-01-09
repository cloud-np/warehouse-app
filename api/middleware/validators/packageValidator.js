const { validateBodyVars, validatePostcode } = require("../../utils/dataCheck");

const validatePackageCreate = (req, res, next) => {
    if (!validateBodyVars({voucher: req.body['voucher'], postcode: req.body['postcode']})){
        res.status(400).send({ message: 'Please provide correct information to create a Package.' });
        return;
    }
    if (!validatePostcode(req.body['postcode'])) {
        res.status(400).send({ message: 'The provided Postcode Code is not correct.' });
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