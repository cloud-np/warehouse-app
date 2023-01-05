const withTransaction = async (callback) => {
    try {
      await client.query('BEGIN');
      const res = await callback();
      await client.query('COMMIT');
      return res;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    }
};

module.exports = withTransaction;