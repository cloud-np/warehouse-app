const { createModel } = require('./models');

const Cluster = createModel("clusters", {
    id: Number, 
    cname: String, 
    postcode: String,
});

module.exports = Cluster;