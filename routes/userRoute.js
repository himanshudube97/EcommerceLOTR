const express = require("express");
const {registerUser, loginUser, logout, getUserDetail, updatePassword, updateUserProfile, getAllUsers, getSingleUser, updateUserRole, deleteUser} = require("../controllers/userController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();


router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logout);
router.route("/getUserDetail").get( isAuthenticatedUser,getUserDetail);
router.route("/updatePassword").post(isAuthenticatedUser, updatePassword);
router.route("/updateUserProfile").post(isAuthenticatedUser, updateUserProfile);

router.route("/admin/getAllUsers").get(isAuthenticatedUser, authorizeRoles("admin"), getAllUsers);
router.route("/admin/getSingleUser/:id").get(isAuthenticatedUser, authorizeRoles("admin"), getSingleUser);
router.route("/admin/updateUserRole").post(isAuthenticatedUser, authorizeRoles("admin"), updateUserRole);
router.route("/admin/deleteUser/:id").delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);

module.exports = router; 