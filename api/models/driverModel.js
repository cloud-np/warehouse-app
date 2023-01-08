const { createModel } = require('./models');

const Driver = createModel("driver", {
    id: Number,
    dname: String,
    is_ready: { type: Boolean, default: true},
    cluster_id: Number,
});

module.exports = Driver;