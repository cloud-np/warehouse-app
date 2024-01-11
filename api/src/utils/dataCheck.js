export const validateBodyVars = (objBody) => {
    return objBody.every(val => isVarWithValue(val));
};

export const isVarWithValue = (val) => val !== null && val !== undefined;

export const appendError = (errors, key, errMsg) => {
    if (errors[key]) {
        errors[key].push(errMsg);
    } else {
        errors[key] = [errMsg]
    }
};
