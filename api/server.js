const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const { errorHandler } = require('./middleware/errorMiddleware');
const path = require("path");

dotenv.config({ path: "./.env.example" });
const app = express();
app.use(express.json());
// For security
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(cors());
// For better logging
app.use(morgan("common"));

/* ROUTES */
// app.use("/auth", authRoutes);
// app.use("/users", userRoutes);
// app.use("/posts", postRoutes);

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 3000;
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

app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const Cluster = require('./models/clusterModel');
// console.log(Cluster);

const clust = new Cluster(1, "Cluster 1", "12345")
// .findById(1).then((res) => console.log(res));

console.log("cluster obj: ", clust);
console.log("Cluster class: ", Cluster);
Cluster.findAll().then((res) => console.log(res));