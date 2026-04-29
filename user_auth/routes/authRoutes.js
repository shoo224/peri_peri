const express = require("express");
const router = express.Router();

const {registerUser, loginUser, createOrder} = require("../controller/authController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/orders", createOrder);

module.exports = router;