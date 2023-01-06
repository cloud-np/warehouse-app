const findMissingKeys = (oldObj, newObj) => {
    const allKeys = [...Object.keys(oldObj), ...Object.keys(newObj)];
    const missingKeys = [];
    allKeys.forEach(key => {
        if (oldObj.hasOwnProperty(key) && !newObj.hasOwnProperty(key)){
            missingKeys.push(key);
        }
    });
    return missingKeys;
}

module.exports = {
    findMissingKeys: findMissingKeys,
}