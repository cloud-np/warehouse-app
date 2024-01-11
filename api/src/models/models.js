import { withTransaction, withoutTransaction } from '../db/transactions.js';
import { findMissingKeys, mapObjValuesToStr } from '../utils/objManipulations.js';

class BaseModel {
    constructor(tableName, tableColumns, insertedValues) {
        this.tableName = tableName;

        // Try to find if the based on the insertedValues
        // the user didn't gave any keys that are present in the table.
        let excludedKeys = ['id'];
        Object.keys(tableColumns).forEach(key => {
            if (typeof tableColumns[key] === 'object' && tableColumns[key] !== null) {
                if(tableColumns[key]['default'] !== undefined){
                    this[key] = tableColumns[key]['default'];
                    excludedKeys.push(key);
                }
            }
        });

        const missingKeys = findMissingKeys(tableColumns, insertedValues, excludedKeys);
        if (missingKeys.length > 0){
            throw new Error(`Your model for the table "${tableName}" is missing columns: ${missingKeys}`);
        }

        // Dynamically add the properties to the class
        const tableKeys = Object.keys(tableColumns);
        tableKeys.forEach(key => {
            // Skip the excluded keys
            if (excludedKeys.includes(key))
                return
            this[key] = insertedValues[key];
        });
        this.insertedValues = insertedValues;
    }
}

export const createModel = (tableName, tableColumns) => {
    if (!tableColumns.hasOwnProperty('id')) {
        throw new Error(`Your model for the table "${tableName}" is missing the "id" column.`);
    }

    return class Model extends BaseModel {
        constructor(insertedValues) {
            super(tableName, tableColumns, insertedValues);
        }

        async saveToDB() {
            const res = await withTransaction(`
                INSERT INTO ${tableName} (${Object.keys(this.insertedValues).join(', ')}) 
                VALUES (${mapObjValuesToStr(this.insertedValues)}) 
                ON CONFLICT DO NOTHING RETURNING *
            `);
            if (res.rows.length === 0) return false
            this.id = res.rows[0].id;
            return this;
        }

        toJson() {
            return { ...this.insertedValues, id: this.id };
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
