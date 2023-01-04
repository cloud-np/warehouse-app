const connectDB = require('./dbConn');

test('connection string test', async () => {
    expect(await connectDB(false)).toBe(true);
});