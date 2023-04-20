const express = require("express");
const { 
    getAllProducts, 
    createProduct,
    updateProduct,
    deleteProduct,
    getSingleProduct
 } = require("../controllers/productController");

const router = express.Router();

router.route("/allProducts").get(getAllProducts);
router.route("/addProduct").post(createProduct);
router.route("/updateProduct").put(updateProduct);
router.route("/deleteProduct").delete(deleteProduct);
router.route("/singleProduct/:id").get(getSingleProduct);


module.exports = router;