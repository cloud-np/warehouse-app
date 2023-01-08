const { createModel } = require('./models');
const { withTransaction } = require('../db/transactions');

const Package = createModel("package", {
    id: Number,
    voucher: String,
    postcode: String,
    cluster_id: Number,
    driver_id: { type: Number, default: null },
    picked_at: { type: 'Timestamp', default: null },
    scanned_at: 'Timestamp',
});

// We are adding a static method to the Package model
Package.packagePickedByDriver = async function (driver_id, package_id) {
    return await withTransaction(`UPDATE package SET driver_id = ${driver_id} WHERE id = ${package_id}`);
};

module.exports = Package;