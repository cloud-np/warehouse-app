const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env.example" });
const helmet = require("helmet");
const morgan = require("morgan");
const clusterRoutes = require("./routes/clusterRoutes");
const driverRoutes = require("./routes/driverRoutes");
const packageRoutes = require("./routes/packageRoutes");
const asyncHandler = require('express-async-handler');
const { errorHandler } = require('./middleware/errorMiddleware');
const { databaseReset } = require('./db/databaseReset');
const path = require("path");
const { connectDB } = require('./db/dbConn');
connectDB();

const app = express();
app.use(express.json());

/* MIDDLEWARES */
// For security
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(cors());
// For better logging
app.use(morgan("common"));

/* ROUTES */
app.use("/api/clusters", clusterRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/packages", packageRoutes);
app.get("/reset-db", asyncHandler(async (req, res) => {
  databaseReset();
  res.status(200).json({ "message": "Database reset" })
}));

// For the rest of the unkonwn routes, send the 404.html file
app.all('*', (req, res) => {
  res.status(404);
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'views', '404.html'));
  } else if (req.accepts('json')) {
    res.json({ "error": "404 Not Found" });
  } else {
    res.type('txt').send("404 Not Found");
  }
});

// Error handler at the end of the middleware chain.
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});