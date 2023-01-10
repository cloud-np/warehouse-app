const { getPool } = require('./dbConn');

const withTransaction = async (query) => {
  const pool = getPool();
  try {
    await pool.query('BEGIN');
    const res = await pool.query(query);
    await pool.query('COMMIT');
    return res;
  } catch (err) {
    await pool.query('ROLLBACK');
    throw err;
  }
}

const withoutTransaction = async (query) => {
  const pool = getPool();
  try {
    return await pool.query(query);;
  } catch (err) {
    throw err;
  }
}

module.exports = {
  withTransaction,
  withoutTransaction,
};