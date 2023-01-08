const findMissingKeys = (oldObj, newObj, exclude = null) => {
    if (exclude === null) exclude = [];
    const allKeys = [...Object.keys(oldObj), ...Object.keys(newObj)];
    const missingKeys = [];
    allKeys.forEach(key => {
        if (exclude.includes(key)) return;
        if (oldObj.hasOwnProperty(key) && !newObj.hasOwnProperty(key)){
            missingKeys.push(key);
        }
    });
    return missingKeys;
}

module.exports = {
    findMissingKeys,
    mapObjValuesToStr: (objValues) => Object.values(objValues).map(val => typeof val === "string" ? `'${val}'` : val).join(', '),
}