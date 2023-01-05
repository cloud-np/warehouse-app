
class BaseModel {
    constructor(obj) {
        const keys = Object.keys(obj);
        keys.forEach((key) => {
            this[key] = obj[key];
        });
    }

    static async findAll() {
        const res = await withTransaction(async () => {
            return await client.query('SELECT * FROM clusters');
        });
        return res.rows;
    }
}



module.exports = (client) => {
    CreateModel: (client, columns) => {
        return class Model extends BaseModel {
            constructor(obj) {
                super(obj);
            }
        }
    }
};