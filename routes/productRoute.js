const express = require("express");
const { 
    getAllProducts, 
    createProduct,
    updateProduct,
    deleteProduct,
    getSingleProduct,
    createProductReview,
    getAllReviews,
    deleteReview
 } = require("../controllers/productController");
const {isAuthenticatedUser, authorizeRoles} = require("../middleware/auth");

const router = express.Router();

router.route("/allProducts").get( getAllProducts);
router.route("/admin/addProduct").post(isAuthenticatedUser, authorizeRoles("admin"),createProduct);
router.route("/admin/updateProduct").put(isAuthenticatedUser, authorizeRoles("admin"),updateProduct);
router.route("/admin/deleteProduct").delete(isAuthenticatedUser, authorizeRoles("admin"),deleteProduct);
router.route("/singleProduct/:id").get(getSingleProduct);
router.route("/createProductReview").post(isAuthenticatedUser,createProductReview);
router.route("/getAllReviews").get(isAuthenticatedUser, getAllReviews);
router.route("/deleteReview").delete(isAuthenticatedUser, deleteReview)
module.exports = router;