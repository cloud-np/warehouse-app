import pkg from 'pg';
const { Pool } = pkg;

let pool = null;

export const connectDB = async () => {
    const isProduction = process.env.NODE_ENV === "production";
    try {
        pool = new Pool({
            user: process.env.PG_USER || 'test_user',
            host: process.env.PG_HOST || 'localhost',
            database: process.env.PG_DATABASE || 'test_db',
            password: process.env.PG_PASSWORD || '1234',
            port: parseInt(process.env.PG_PORT, 10) || 5432,
            ssl: isProduction ? { rejectUnauthorized: false } : false,
        });
        console.log('Connected to PostgreSQL server.')
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

export const getPool = () => pool;
