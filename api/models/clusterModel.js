// Even though an ORM provides a lot of convienience, maintainability and readability,
// I was hesitant to add another dependency to the project so I decided to use a simple
// query builder instead. Plus I also wanted to showcase the ability to write queries. 
// class Cluster extends BaseModel {
//     constructor(id, cname, postcode) {
//         this.id = id;
//         this.text = cname;
//         this.postcode = postcode;
//     }
// }
const { createModel } = require('./models');

const Cluster = createModel("cluster", {
    id: Number, 
    cname: String, 
    postcode: String,
});

module.exports = Cluster;