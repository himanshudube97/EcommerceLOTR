const Errorhandler = require("../utils/errorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;


  if (!token) {
    return next(new Errorhandler("pPlease login to access this resource", 401));
  }

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);

  
  req.user = await User.findById(decodedData.id);



  next();
});

exports.authorizeRoles = (...roles) => {   //this is not spread operator but a rest operator. REST operator is used to make an array .

  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new Errorhandler(`Role : ${req.user.role} is not allowed`, 403)
      );
    }
    next();
  };
  
};

//WE ARE USING THE ABOVE FUNCTION but not the down one because its clean code. whenever we need to modify the roles, we just have to add a parameter to the function in the router file.

// exports.authorizeRoles = (req, res, next)=>{
//     if(req.user.role !== "admin"){
//         return next(new Errorhandler(`Role: ${req.user.role} is not allowed`, 403))
//     }
//     next();
// }
