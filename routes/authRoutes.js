const express = require("express");
const authControllers = require("../controllers/authController.js");
const router = express.Router();
const initializeData=require("../utils/initializeData .js")

router.post("/login", authControllers.login);
router.use(initializeData);
router.post("/signup",authControllers.signup);

module.exports = router;
