const { Client } = require('pg')

let client = null;

const connectDB = async () => {
    try {
        client = new Client({
            user: process.env.PG_USER || 'test_user',
            host: process.env.PG_HOST || 'localhost',
            database: process.env.PG_DATABASE || 'test_db',
            password: process.env.PG_PASSWORD || '1234',
            port: parseInt(process.env.PG_PORT, 10) || 5432,
        });

        client.connect((err) => {
            if (err) {
                console.error('Connection error', err.stack);
                process.exit(1);
            }
        });
        console.log('Connected to PostgreSQL server.')
        return client;
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

module.exports = {
    client,
    connectDB
}