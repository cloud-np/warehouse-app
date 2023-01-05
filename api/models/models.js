const { withTransaction } = require('../db/transactions');
const { pool } = require('../db/dbConn');

class BaseModel {
    constructor(tableName, obj, values) {
        this.tableName = tableName;

        // Dynamically add the properties to the class
        const keys = Object.keys(obj);
        if (keys.length !== values.length)
            throw new Error(`Your model for the table "${tableName}" is missing columns.`);
        keys.forEach((key, index) => {
            this[key] = values[index];
        });
        console.log(this.findAll);
    }

    static async findById(id) {
        const res = await withTransaction(pool, async () =>
            await pool.query(`SELECT * FROM ${this.tableName} WHERE id = ${id}`)
        );
        return res.rows;
    }

    static async findAll() {
        const res = await withTransaction(pool, async () =>
            await pool.query(`SELECT * FROM ${this.tableName}`)
        );
        return res.rows;
    }
}

module.exports = {
    createModel: (tableName, columns) => {
        return class Model extends BaseModel {
            constructor(...values){
                super(tableName, columns, values);
            }
        }
    }
}