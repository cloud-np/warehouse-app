const { withTransaction, withoutTransaction } = require('../db/transactions');
const { findMissingKeys, mapObjValuesToStr } = require('../utils/objManipulations');

/*
    Even though an ORM provides a lot of convienience, maintainability and readability,
    I was hesitant to add another dependency to the project so I decided to implement one
    myself. Plus I also wanted to showcase the ability to write queries and work with a 
    higher level of abstraction. So I tried to write a simple ORM that looks/acts kinda
    similar to mongoose library.

    One of the downsides of my 'abstraction' here is that I add a lot of complexity to the
    codebase. Which for this project's scope is debatable if it was needed at all. But nevertheless
    I tried to solve the problem like a real life scenario by trying to write more re-usable code and having
    a more 'long-term' thinking approach. Also another downside is that I am forcing the developer to use
    the naming 'id' for the primary key of the table. Which with a little bit of refactoring could be changed
    to make it more dynamically if needed. Another one is that I do not take into account the columns that
    may have a default value in the database.
*/
class BaseModel {
    constructor(tableName, objColumns, objValues) {
        tableName = tableName;

        // Exclude the id column if it has a default value
        let excludedKeys = ['id'];
        Object.keys(objColumns).forEach(key => {
            if (typeof objColumns[key] === 'object' && objColumns[key] !== null) {
                if(objColumns[key]['autoCreated'] !== undefined || objColumns[key]['default'] !== undefined){
                    this[key] = objColumns[key]['default'];
                    excludedKeys.push(key);
                }
            }
        });

        const missingKeys = findMissingKeys(objColumns, objValues, excludedKeys);
        if (missingKeys.length > 0){
            throw new Error(`Your model for the table "${tableName}" is missing columns: ${missingKeys}`);
        }
        // Dynamically add the properties to the class
        const tableKeys = Object.keys(objColumns);
        tableKeys.forEach(key => {
            // Skip the id column if it was not provided by the user
            if (excludedKeys.includes(key))
                return
            this[key] = objValues[key];
        });
        this.objValues = objValues;
    }
}

const createModel = (tableName, tableColumns) => {
    if (!tableColumns.hasOwnProperty('id')) {
        throw new Error(`Your model for the table "${tableName}" is missing the "id" column.`);
    }

    return class Model extends BaseModel {
        constructor(objValues) {
            super(tableName, tableColumns, objValues);
        }

        async saveToDB() {
            const res = await withTransaction(`
                INSERT INTO ${tableName} (${Object.keys(this.objValues).join(', ')}) 
                VALUES (${mapObjValuesToStr(this.objValues)}) 
                ON CONFLICT DO NOTHING RETURNING *
            `);
            if (res.rows.length === 0) return false
            this.id = res.rows[0].id;
            return this;
        }

        toJson() {
            return {...this.objValues, id: this.id};
        }

        static async findAll() {
            const res = await withoutTransaction(`SELECT * FROM ${tableName}`);
            return res.rows;
        }

        static async findByColumn(column, val) {
            const res = await withoutTransaction(`SELECT * FROM ${tableName} WHERE ${column} = ${val ? `'${val}'` : val}`);
            return res.rows;
        }

        static async findById(id) {
            const res = await withoutTransaction(`SELECT * FROM ${tableName} WHERE id = ${id}`);
            return res.rows[0];
        }
    }
}

module.exports = {
    createModel,
}