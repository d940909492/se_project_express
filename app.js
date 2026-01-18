const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const routes = require("./routes/index");
const logger = require("./utils/logger");

const { PORT = 3001 } = process.env;
const app = express();
app.use(express.json());
app.use(cors());

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    logger.info("connect to mongoDB...");
  })
  .catch((error) => {
    logger.error("Database connection error:", error);
    process.exit(1);
  });

app.use("/", routes);

app.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}`);
});
