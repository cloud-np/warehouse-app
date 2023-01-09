const { createModel } = require('./models');
const { withTransaction, withoutTransaction } = require('../db/transactions');

const Package = createModel("package", {
    id: Number,
    voucher: String,
    postcode: String,
    cluster_id: { type: Number, autoCreated: true },
    driver_id: { type: Number, default: null },
    scanned_at: { type: 'Timestamp', default: null },
});

// We are adding a static method to the Package model
Package.packagePickedByDriver = async function (driver_id, package_id) {
    return await withTransaction(`UPDATE package SET driver_id = ${driver_id}, scanned_at = NOW() WHERE id = ${package_id}`);
};

Package.getPackagesByCluster = async function (cluster_id) {
    console.log(cluster_id)
    return await withoutTransaction(`
        SELECT p.id, p.voucher, p.postcode, COALESCE(p.scanned_at, NULL), COALESCE(d.dname, 'No driver yet') AS driver_name, c.cname AS cluster_name
        FROM package p
        LEFT JOIN driver d ON p.driver_id = d.id
        JOIN clusters c ON p.cluster_id = c.id
        WHERE p.cluster_id = ${cluster_id};
    `);
};

module.exports = Package;