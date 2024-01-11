import asyncHandler from 'express-async-handler';
import { QueryFailureError } from '../errors/databaseRelatedErrors.js';
import { CeremonyModel } from '../models/ceremonyModel.js';

// @desc    Get ceremonies
// @route   GET /api/ceremonies
// @access  Private
export const getCeremonies = asyncHandler(async (req, res, next) => {
    try {
        const ceremonies = await CeremonyModel.findAll();
        res.status(200).json(ceremonies);
    } catch (err) {
        next(err);
    }
});

// @desc    Set ceremony
// @route   POST /api/ceremonies
// @access  Private
export const createCeremony = asyncHandler(async (req, res, next) => {
    try {
        const ceremony = await new CeremonyModel({ ...req.body }).saveToDB();
        if (!ceremony) {
            throw new QueryFailureError("Ceremony could not be created.");
        }
        res.status(200).json(ceremony.toJson());
    } catch (err) {
        next(err);
    }
});
