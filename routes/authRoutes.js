const express = require("express");
const authControllers = require("../controllers/authController.js");
const router = express.Router();
const initializeData=require("../utils/initializeData .js")
const middleware= require("../middleware/auth.js")
router.post("/login", authControllers.login);
router.get("/profile", middleware.protect, authControllers.getProfile)
router.post("/logout",
    middleware.protect,
    
    authControllers.logout)
router.use(initializeData);
router.post("/signup",authControllers.signup);

module.exports = router;
