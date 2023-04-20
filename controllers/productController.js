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
    { _id: req.body.productId },
    req.body.updateQuery,
    { upsert: false, new: true, runValidators: true, useFindAndModify: false }
  );

  if (!result) {
    res.status(500).json({
        success: false
    })
  } else {
    res.status(200).json({
      success: true,
      result: result,
    });
  }
};

//Delete Product
exports.deleteProduct = async (req, res, next) => {
    if(!mongoose.Types.ObjectId.isValid(req.body.productId)){
        return res.status(400).json({
            message: "Invalid Object Id"
        })
    }
  let result = await Product.deleteOne({ _id: req.body.productId });
  console.log(result, "result")
  if (result.deletedCount === 0) {
    res.status(500).json({
        success: false
    })
  } else {
    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      result: result,
    });
  }
};

//Get single Product

exports.getProductById = async (req, res, next) => {
  let result = await Product.findOne({ _id: req.params.id });
  console.log(result, "result");
  if (!result) {
    res.status(500).json({
        success: false
    })
  } else {
    res.status(200).json({
      success: true,
      result: result,
    });
  }
};
