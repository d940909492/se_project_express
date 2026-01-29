const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");

const {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  ConflictError,
} = require("../utils/errors");

const SALT_ROUNDS = 10;

module.exports.createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  bcrypt
    .hash(password, SALT_ROUNDS)
    .then((hash) =>
      User.create({
        name,
        avatar,
        email,
        password: hash,
      })
    )
    .then((user) => {
      const safeUser = user.toObject();
      delete safeUser.password;

      res.status(201).send(safeUser);
    })
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError("Email already exists"));
      }
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid user data"));
      }
      return next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      const isProd = process.env.NODE_ENV === "production";

      res
        .cookie("jwt", token, {
          httpOnly: true,
          sameSite: "lax",
          secure: isProd,
          maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        .send({
          message: "Logged in",
          user: {
            _id: user._id,
            name: user.name,
            avatar: user.avatar,
            email: user.email,
          },
        });
    })
    .catch(() => next(new UnauthorizedError("Incorrect email or password")));
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("User not found"));
      }
      return next(err);
    });
};

module.exports.updateCurrentUser = (req, res, next) => {
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid user data"));
      }
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("User not found"));
      }
      return next(err);
    });
};

module.exports.logout = (req, res) => {
  res
    .clearCookie("jwt", {
      httpOnly: true,
      sameSite: "lax",
    })
    .send({ message: "Logged out" });
};
