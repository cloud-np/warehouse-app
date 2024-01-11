import { createModel } from './models.js';

export const CeremonyModel = createModel("ceremony", {
    id: Number,
    details: String,
    people: String,
    cdate: Date,
    ctime: 'Time',
    cpriority: Number,
    is_over: { type: Boolean, default: false }
});
