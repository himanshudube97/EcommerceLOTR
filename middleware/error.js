const Errorhandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  if (err.name === "CastError") {
    // this error occurs when we put small id
    const message = `Resource not found. Invalid: ${err.path}`;
    err = new Errorhandler(message, 400);
  }
  // if (err.code == "ERR_HTTP_HEADERS_SENT") {
  //   console.log("kya hai bhai");
  //   err.message = "Cannot set headers after sent to client";
  //   err.statusCode = 400;
  // }
  // console.log("brother");

  // Mongoose Duplicate Error
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
    // err.message = message;
    // err.statusCode = 400;
    //or we can also write

    err = new Errorhandler(message, 400);
  }

  // Wrong JWT error

  if (err.name === "JsonWebTokenError") {
    const message = `Json Web Token is invalid, try again`;
    err = new Errorhandler(message, 400);
  }

  //JWT expire error
  
  if (err.name === "TokenExpiredError") {
    const message = `Json Web Token is Expired, try again`;
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
