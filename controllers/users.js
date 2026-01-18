const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const {
  BAD_REQUEST,
  SERVER_ERROR,
  NOT_FOUND,
  CONFLICT,
} = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

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

module.exports.getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).send({ message: "User not found" });
      }

      return res.send({
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
  const { name, avatar, email, password } = req.body;

  if (!email || !password) {
    return res.status(BAD_REQUEST).send({
      message: "Email or password is missing",
    });
  }

  return bcrypt
    .hash(password, 12)
    .then((hash) =>
      User.create({
        name,
        avatar,
        email,
        password: hash,
      })
    )
    .then((user) => {
      const USER = user.toObject();
      delete USER.password;

      return res.status(201).send({
        data: USER,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        return res.status(CONFLICT).send({
          message: "This email already exist",
        });
      }

      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({
          message: err.message,
        });
      }

      return res.status(SERVER_ERROR).send({
        message: "Server error",
      });
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.send({ token });
    })
    .catch((err) => {
      console.error(err);
      return res
        .status(BAD_REQUEST)
        .send({ message: "Incorrect email or password" });
    });
};

module.exports.updateCurrentUser = (req, res) => {
  const { name, avatar } = req.body;
  const update = {};
  if (name !== undefined) {
    update.name = name;
  }
  if (avatar !== undefined) {
    update.avatar = avatar;
  }

  return User.findByIdAndUpdate(req.user._id, update, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).send({ message: "User not found" });
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: err.message });
      }
      return res.status(SERVER_ERROR).send({ message: "Server error" });
    });
};
