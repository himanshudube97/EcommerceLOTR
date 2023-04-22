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

  const isPasswordMatched = await user.comparePassword(password);

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

//Logout User-

exports.logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});

// Get User details-

exports.getUserDetail = catchAsyncErrors(async (req, res, next) => {
  let result = await User.findById(req.user.id);
  // if(!result){
  //     return next(new Errorhandler("User dosen't exist", 400))
  // } no need kyunki, login user dekh hi lega,
  res.status(200).json({
    success: true,
    result,
  });
});

// Update User Password-

exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
  console.log(isPasswordMatched, "hellopassword");

  if (!isPasswordMatched) {
    return next(new Errorhandler("Old password is incorrect", 400));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new Errorhandler("Password didnt match, confirm wlaa", 400));
  }

  user.password = req.body.newPassword;

  await user.save();

  sendToken(user, 200, res);
});

//update user profile-

exports.updateUserProfile = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };
  // if we dont have req.body.name main name field than it will not send error but will show undefined.
  console.log(req.body.name, "name");

  const result = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: true,
  });

  res.status(200).json({
    success: true,
    result,
  });
});

//get all users, for admin-

exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const result = await User.find();
  res.status(200).json({
    success: true,
    result,
  });
});

//get single user detail - admin

exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {
  const result = await User.findById(req.params.id);
  if (!result) {
    return next(new Errorhandler("User Not found", 404));
  }
  res.status(200).json({
    success: true,
    result,
  });
});

//update user Role - admin
exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };
  // if we dont have req.body.name main name field than it will not send error but will show undefined.
  console.log(req.body.name, "name");

  const result = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: true,
  });

  res.status(200).json({
    success: true,
    result,
  });
});

//delete user - by admin

exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  let user = await User.findByIdAndDelete(req.params.id);
  res.json({
    success: true,
    message: "User deleted Successfully",
    user,
  });
});
