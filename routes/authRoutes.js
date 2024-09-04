const express = require("express");
const authControllers = require("../controllers/authController.js");
const router = express.Router();
const passport = require("passport");
const session = require("express-session");
const jwt = require("jsonwebtoken");
const initializeData= require("../utils/initializeData .js")


const middleware = require("../middleware/auth.js");
const User = require("../models/Users.js");
const Tenant = require("../models/tenant.js");
const sequelize = require('../database/db');
const msRestNodeAuth = require("@azure/ms-rest-nodeauth");
const axios = require("axios");

router.post("/login", authControllers.login,        );
router.post("/signin", authControllers.googleAuthentication)
router.get("/profile", middleware.protect, authControllers.getProfile);

router.put("/auth/forgetpassword", authControllers.forgetPassword);
router.post('/auth/resetPassword/:token', authControllers.resetPassword);

router.get("/superuserexist", authControllers.checkSuperTenant);
const users = {};

//LOGOUT
router.get("/auth/logout", authControllers.logout);

//END OF ROUTE
router.post(
  "/logout",
  middleware.protect,

  // middleware.stopCapacity,

  authControllers.logout
);
router.use(initializeData);
router.post("/signup", authControllers.signup);





module.exports = router;
