const { validateBodyVars, validatePostcode, isVarWithValue } = require("../../utils/dataCheck");

const validatePackageCreate = (req, res, next) => {
    if (!validateBodyVars({voucher: req.body['voucher'], postcode: req.body['postcode']})){
        return res.status(400).send({ message: 'Please provide correct information to create a Package.' });
    }
    if (!validatePostcode(req.body['postcode'])) {
        return res.status(400).send({ message: 'The provided Postcode Code is not correct.' });
    }
    next();
}

const validatePackagePickedByDriver = (req, res, next) => {
    console.log(req.body)
    if (!validateBodyVars({package_id: req.body['package_id']})){
        return res.status(400).send({ message: 'Please provide correct information to for a Driver to pick up the Package.' });
    }
    next();
}
module.exports = {
    validatePackageCreate,
    validatePackagePickedByDriver,

};