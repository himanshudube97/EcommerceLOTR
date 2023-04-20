const Product = require("../models/productModel");
const mongoose = require("mongoose");
//Create Product -- Admin route
exports.createProduct = async (req, res, next) => {
  try {
    const result = await Product.create(req.body);
    res.status(201).json({
      success: true,
      statusCode: 200,
      result: result,
    });
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
};

//Get All Product

exports.getAllProducts = async (req, res) => {
  try {
    const result = await Product.find({});
    res.status(200).json({
      success: true,
      result: result,
    });
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
};

//Update Product -- admin

exports.updateProduct = async (req, res, next) => {
  let result = await Product.findOneAndUpdate(
    req.body.findQuery,
    req.body.updateQuery,
    { upsert: false, new: true, runValidators: true }
  );

  if (!result) {
    return res.status(500).json({
      success: false,
    });
  }
  res.status(200).json({
    success: true,
    result: result,
  });
};

