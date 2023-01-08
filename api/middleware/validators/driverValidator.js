const { validateBodyVars } = require("../../utils/dataCheck");

const validateDriverCreate = (req, res, next) => {
    if (!validateBodyVars({dname: req.body['dname'], cluster_id: req.body['cluster_id']})){
        res.status(400).send({ message: 'Please provide correct information to create a Driver.' });
        return;
    }
    next();
}

module.exports = {
    validateDriverCreate,
};