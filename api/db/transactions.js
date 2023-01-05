const withTransaction = async (pool, callback) => {
    try {
      await pool.query('BEGIN');
      const res = await callback();
      await pool.query('COMMIT');
      return res;
    } catch (err) {
      await pool.query('ROLLBACK');
      throw err;
    }
};

module.exports = {
  withTransaction: withTransaction,
};