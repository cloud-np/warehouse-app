const validateBodyVars = (objBody) => {
    return Object.values(objBody).every((val) => isVarWithValue(val));
}
const isVarWithValue = (val) => !(val === null || val === undefined);

module.exports = {
    validatePostcode: (postcode) => /^\d{5}$/.test(postcode),
    validateCcode: (ccode) => /^\d{2}$/.test(ccode),
    isVarWithValue,
    validateBodyVars,
};