import { isVarWithValue } from "../../utils/dataCheck.js";

export const validateCeremonyCreate = (req, res, next) => {
    const body = req.body;
    const errors = {};
    const peopleInt = parseInt(body.people, 10);
    const priorityInt = parseInt(body.cpriority, 10);

    if (!isVarWithValue(body.cdate)){
        errors.cdate = ['Δώσε μία ημερομηνία για την δεξίωση.'];
    }

    if (!isVarWithValue(body.ctime)){
        errors.ctime = ['Δώσε μία ώρα για την δεξίωση.'];
    }

    if (!isNaN(peopleInt) && peopleInt <= 0) {
        errors.people = ['Τα άτομα πρέπει να είναι τουλάχιστον 1']
    }

    if (!isNaN(priorityInt) && priorityInt >= 1 && priorityInt <= 5) {
        errors.cpriority = ['Η σημαντικότητα της δεξίωσης μπορεί να είναι από 1 έως και 5']
    }

    if (Object.keys(errors).length) {
        return res.status(400).send(errors);
    }

    next();
};
