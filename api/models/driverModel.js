const { createModel } = require('./models');

const Driver = createModel("driver", {
    id: Number,
    dname: String,
    is_ready: { type: Boolean, default: false },
    cluster_id: Number,
});

Driver.e = async function (driver_id, package_id) {
    return await withTransaction(`UPDATE package SET driver_id = ${driver_id} WHERE id = ${package_id}`);
};

module.exports = Driver;