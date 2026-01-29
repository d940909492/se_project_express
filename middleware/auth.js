const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { UnauthorizedError } = require("../utils/errors");

module.exports = (req, res, next) => {
  let token;

  const { authorization } = req.headers;
  if (authorization && authorization.startsWith("Bearer ")) {
    token = authorization.replace("Bearer ", "");
  }

  if (!token && req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(new UnauthorizedError("Authorization required"));
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    return next();
  } catch (err) {
    return next(new UnauthorizedError("Authorization required"));
  }
};
