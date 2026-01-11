const User = require("../models/user");
const { BAD_REQUEST, SERVER_ERROR, NOT_FOUND } = require("../utils/errors");

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send({
        message: "get all users called",
        data: users,
      });
    })
    .catch((err) => res.status(SERVER_ERROR).send({ message: err.message }));
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).send({ message: "User not found" });
      }

      return res.send({
        message: `get user called, the user name is ${user.name}`,
        data: user,
      });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "user id is invalid" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "user not found" });
      }
      return res.status(SERVER_ERROR).send({ message: "server error" });
    });
};

module.exports.createUser = (req, res) => {
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((users) =>
      res.status(201).send({
        message: `create user called, the user is ${req.params.name}`,
        data: users,
      })
    )
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(BAD_REQUEST).send({ message: err.message });
      } else {
        res.status(SERVER_ERROR).send({ message: "server error" });
      }
    });
};
