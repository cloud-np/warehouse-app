const { withTransaction } = require('../db/transactions');
const { createModel } = require('./models');

const Driver = createModel("driver", {
    id: Number,
    dname: String,
    is_ready: { type: Boolean, default: false },
    cluster_id: Number,
});

Driver.findAllWithPackagesLeft = async function () {
    return await withTransaction(`
        SELECT c.cname, d.dname, d.is_ready, COUNT(p.*) AS packages_left
        FROM clusters c
        LEFT JOIN driver d ON c.id = d.cluster_id
        LEFT JOIN package p ON c.id = p.cluster_id AND p.scanned_at IS NULL
        WHERE d.dname IS NOT NULL
        GROUP BY c.cname, d.dname, d.is_ready;
    `);
};

Driver.findClusterDriverWithPackagesLeft = async function (cluster_id) {
    return await withTransaction(`
        SELECT c.cname, d.dname, d.is_ready, COUNT(p.*) AS packages_left
        FROM clusters c
        LEFT JOIN driver d ON c.id = d.cluster_id
        LEFT JOIN package p ON c.id = p.cluster_id AND p.scanned_at IS NULL
        WHERE c.id = ${cluster_id} AND d.dname IS NOT NULL
        GROUP BY c.cname, d.dname, d.is_ready;
    `);
};

module.exports = Driver;