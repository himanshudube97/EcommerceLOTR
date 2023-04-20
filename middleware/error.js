const Errorhandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  if (err.name === "CastError") {   // this error occurs when we put small id
    const message = `Resource not found. Invalid: ${err.path}`;
    err = new Errorhandler(message, 400);
  }
  res.status(err.statusCode).json({
    success: false,
    status: err.statusCode,
    // error: err.stack or we can do
    error: err.message,
  });
};

//  ALWAYS USE TRY CATCH BLOCK WITH AYSNC FUNCTIONS. TO CAPTURE ASYNC ERRORS.
