/*

i wanna use it, but...

*/

function sendJson(res, statusCode, payload) {
  res.status(statusCode).json(payload);
}

function sendSuccess(res, data, statusCode = 200) {
  sendJson(res, statusCode, {
    success: true,
    data,
  });
}

function sendCreated(res, data, message = "resource created") {
  sendJson(res, 201, {
    success: true,
    message,
    data,
  });
}

function sendError(res, message, statusCode = 500) {
  sendJson(res, statusCode, {
    success: false,
    error: message,
  });
}

module.exports = {
  sendSuccess,
  sendCreated,
  sendError,
};
