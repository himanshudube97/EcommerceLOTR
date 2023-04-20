const express = require("express");
const { 
    getAllProducts, 
    createProduct,
    updateProduct,
    deleteProduct,
    getProductById
 } = require("../controllers/productController");

const router = express.Router();

router.route("/allProducts").get(getAllProducts);
router.route("/addProduct").post(createProduct);
router.route("/updateProduct").put(updateProduct);
router.route("/deleteProduct").post(deleteProduct);
router.route("/getProductById/:id").get(getProductById);


module.exports = router;