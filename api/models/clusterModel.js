const { createModel } = require('./models');

const Cluster = createModel("clusters", {
    id: Number, 
    cname: String, 
    ccode: String,
});

module.exports = Cluster;