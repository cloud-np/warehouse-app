const { validateBodyVars, validateCcode } = require("../../utils/dataCheck");

const validateClusterCreate = (req, res, next) => {
    if (!validateBodyVars({ccode: req.body['ccode'], cname: req.body['cname']})){
        res.status(400).send({ message: 'Please provide the needed information to create a Cluster.' });
        return;
    }

    // Validate if the provided Cluster Code is correct (only 2 digits)
    if (!validateCcode(req.body['ccode'])) {
        res.status(400).send({ message: 'The provided Cluster Code is not correct.' });
        return;
    }
    next();
}

module.exports = {
    validateClusterCreate,
};
