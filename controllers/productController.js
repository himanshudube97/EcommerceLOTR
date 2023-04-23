const Product = require("../models/productModel");
const Errorhandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apifeatures");

//Create Product -- Admin route
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
  req.body.user = req.user.id;
  const result = await Product.create(req.body);
  return res.status(201).json({
    success: true,
    statusCode: 200,
    result: result,
  });
});

//Get All Product

exports.getAllProducts = catchAsyncErrors(async (req, res, next) => {
  let resultPerPage = 5;
  const productCount = await Product.countDocuments();

  const apiFeatures = new ApiFeatures(Product.find(), req.query);
  apiFeatures.search().filter().pagination(resultPerPage);
  const result = await apiFeatures.query;
  res.status(200).json({
    success: true,
    productCount,
    result: result,
  });
});

//Update Product -- admin

exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  let result = await Product.findOneAndUpdate(
    req.body.findQuery,
    req.body.updateQuery,
    { upsert: false, new: true, runValidators: true }
  );
  if (!result) return next(new Errorhandler("product not found", 404)); // this is not an async error, as we have waited for result, then see ki result main kya hai. async errors are different.

  res.status(200).json({
    success: true,
    result: result,
  });
});

//delete product

exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  console.log(req.body);
  const result = await Product.findOneAndDelete(req.body.findQuery);

  // if(!result) return res.status(500).json({success: false, message: "Not found"})
  if (!result) return next(new Errorhandler("Product not found", 404));

  res.status(200).json({
    success: true,
    result,
  });
});

//get single product

exports.getSingleProduct = catchAsyncErrors(async (req, res, next) => {
  let result = await Product.findOne({ _id: req.params.id });

  if (!result) {
    return next(new Errorhandler("Product Not found", 404));
  }

  res.status(200).json({
    success: true,
    result,
  });
});

// Create New review or Update the review

exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
  console.log(req.user);
  const { rating, comment, productId } = req.body;
  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);

  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );
  console.log(isReviewed, "isReviewed");

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString()) {
        rev.rating = rating;
        rev.comment = comment;
      }
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  let avg = 0;

  product.reviews.forEach((rev) => {
    avg = avg + rev.rating;
  });

  product.ratings = avg / product.reviews.length;
  await product.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
    message: "review updated",
  });
});

// Get All Reviews of a Product

exports.getAllReviews = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.query.productId);

  if (!product) {
    return next(new Errorhandler("Product doesn't exists", 400));
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

//Delete Review-

exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findOne({ _id: req.query.productId });

  if (!product) {
    return next(new Errorhandler("Product doesn't exists", 400));
  }

  const reviews = product.reviews.filter((item) => {
    return item._id.toString() !== req.query.reviewId;
  });

  let avg = 0;

  reviews.forEach((rev) => {
    avg = avg + rev.rating;
  });

  const ratings = avg / reviews.length;

  const numOfReviews = reviews.length;

  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
  });
});

// async error hoga jab create product ke time pe agar hum required field na dein.
//catchAsyncErrors basically ek function hai which is promisifying the above function. async errors are hard to catch so we have to
//either user try catch block or we can promisify it and wait for the function to execute.
//promise.resolve().catch() is also acting as a try-catch block only.
