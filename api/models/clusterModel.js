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
const models = require('./models');
const { client } = require('../db/dbConn');
const { CreateModel } = models(client);


const Cluster = CreateModel({
    id: 1, 
    cname: "A", 
    postcode: "10",
});

module.exports = Cluster;