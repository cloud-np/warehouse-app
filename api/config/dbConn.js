const { Pool } = require('pg')

const connectDB = async () => {
    try {
        new Pool({
            user: process.env.DB_USER,
            
        })

        console.log(`Database Connected: ${conn.connection.host}`.cyan.underline)
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

module.exports = connectDB