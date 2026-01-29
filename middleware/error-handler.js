const { SERVER_ERROR } = require("../utils/errors");

module.exports = (err, req, res, next) => {
  console.error(err);

  const statusCode = err.statusCode || SERVER_ERROR;
  const message =
    statusCode === SERVER_ERROR
      ? "An error occurred on the server"
      : err.message;

  res.status(statusCode).send({ message });
};
