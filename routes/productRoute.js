const express = require("express");
const { 
    getAllProducts, 
    createProduct,
    updateProduct,
   
 } = require("../controllers/productController");

const router = express.Router();

router.route("/allProducts").get(getAllProducts);
router.route("/addProduct").post(createProduct);
router.route("/updateProduct").put(updateProduct);


module.exports = router;