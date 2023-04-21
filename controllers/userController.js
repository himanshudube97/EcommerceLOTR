const Errorhandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");

//Register a User-

exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;
  const user = await User.create({ name, email, password });

  sendToken(user, 201, res);
  //   const token = user.getJWTToken();

  //   res.status(201).json({
  //     success: true,
  //     user,
  //     token,
  //   });
});

// Login User

exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new Errorhandler("Please Enter Email and Password", 400));
  }

  const user = await User.findOne({ email: email }).select("+password");

  if (!user) {
    return next(new Errorhandler("User dosent exist", 401));
  }

  const isPasswordMatched = user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new Errorhandler("Invalid Email or password", 401));
  }

  //   const token = user.getJWTToken();

  //   res.status(200).json({
  //     success: true,
  //     token
  //   })

  sendToken(user, 200, res);
});
