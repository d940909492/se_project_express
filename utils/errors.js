/* eslint-disable max-classes-per-file */
const BAD_REQUEST = 400;
const UNAUTHORIZED = 401;
const FORBIDDEN = 403;
const NOT_FOUND = 404;
const CONFLICT = 409;
const SERVER_ERROR = 500;

class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = BAD_REQUEST;
  }
}

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = UNAUTHORIZED;
  }
}

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = FORBIDDEN;
  }
}

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = NOT_FOUND;
  }
}

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = CONFLICT;
  }
}

module.exports = {
  BAD_REQUEST,
  UNAUTHORIZED,
  FORBIDDEN,
  NOT_FOUND,
  CONFLICT,
  SERVER_ERROR,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
};
