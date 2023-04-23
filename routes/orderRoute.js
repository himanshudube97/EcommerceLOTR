const express = require("express");
const router = express.Router();
const {newOrder, myOrders, getSingleOrder, getAllOrders, updateOrder, deleteOrder} = require("../controllers/orderControllers")
const {isAuthenticatedUser, authorizeRoles} = require("../middleware/auth");


router.route("/newOrder").post(isAuthenticatedUser, newOrder);
router.route("/getSingleOrder/:id").get(isAuthenticatedUser, getSingleOrder);
router.route("/myOrders").get(isAuthenticatedUser, myOrders);
router.route("/admin/orders").get(isAuthenticatedUser, authorizeRoles("admin"), getAllOrders);
router.route("/admin/updateOrderStatus/:id").put(isAuthenticatedUser, authorizeRoles("admin"), updateOrder);
router.route("/admin/deleteOrder/:id").put(isAuthenticatedUser, authorizeRoles("admin"), deleteOrder);

module.exports =router;