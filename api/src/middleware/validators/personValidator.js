import { appendError, isVarWithValue } from "../../utils/dataCheck.js";

export const validatePersonCreate = (req, res, next) => {
    const body = req.body;
    const errors = {};

    if (!isVarWithValue(body.fname)){
        appendError(errors, 'fname', 'Δώσε ένα όνομα.');
    }

    if (!isVarWithValue(body.lname)){
        appendError(errors, 'lname', 'Δώσε ένα επίθετο.');
    }

	if (!(/^[\-0-9a-zA-Z\.\+_]+@[\-0-9a-zA-Z\.\+_]+\.[a-zA-Z]{2,}$/).test(String(body.email))) {
        appendError(errors, 'email', 'Το email δεν είναι σωστό.');
    }

    if (body.phone_number.length === 10) {
        appendError(errors, 'phone_number', 'Ο αριθμός τηλεφώνου πρέπει να είναι 10 νούμερα.');
    }

    if (body.ppriority >= 1 && body.ppriority <= 5) {
        appendError(errors, 'people', 'Η σημαντικότητα μπορεί να είναι από 1 έως και 5');
    }

    if (Object.keys(errors).length) {
        return res.status(400).send(errors);
    }
    next();
};
