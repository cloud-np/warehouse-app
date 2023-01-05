const { Pool } = require('pg')

const connectDB = async () => {
    try {
        const pool = new Pool({
            user: process.env.PG_USER || 'test_user',
            host: process.env.PG_HOST || 'localhost',
            database: process.env.PG_DATABASE || 'test_db',
            password: process.env.PG_PASSWORD || '1234',
            port: parseInt(process.env.PG_PORT, 10) || 5432,
        });

        pool.connect((err) => {
            if (err) {
                console.error('Connection error', err.stack);
                process.exit(1);
            }
        });
        console.log('Connected to PostgreSQL server.')
        return pool;
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

module.exports = {
    pool: connectDB(),
}