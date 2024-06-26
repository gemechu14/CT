const express = require("express");
const authControllers = require("../controllers/authController.js");
const router = express.Router();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const MicrosoftStrategy = require("passport-microsoft").Strategy;
const session = require("express-session");
const jwt = require("jsonwebtoken");

const middleware = require("../middleware/auth.js");
const User = require("../models/Users.js");
const Tenant = require("../models/tenant.js");

router.post("/login", authControllers.login);
router.get("/profile", middleware.protect, authControllers.getProfile);

const users = {};

//GOOGLE AUTH
router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
  })
);

// router.get("/auth/micro",authControllers.microsoftAuthentication)
// router.get('/auth/microsoft1', passport.authenticate('microsoft', {
//     scope: ['user.read.all']
//   }));

//   router.get('/auth/microsoft/callback1', 
//     passport.authenticate('microsoft', {
//         successRedirect: "/auth/microsoft/protected",
//         failureRedirect: '/auth/microsoft/failure'
//     }),
//     // authControllers.handleMicrosoftCallback
//   );
  
//   router.get('/auth/microsoft/failure1', (req, res) => {
//     res.send('Something went wrong');
//   });
  
//   router.get(
//     "/auth/microsoft/protected1",
//     middleware.isLoggedIn,
//     authControllers.handleGoogleCallback
//   );



//CALLBACK
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/auth/protected",
    failureRedirect: "/auth/google/failure",
  })
);
//AUTH FAILURE
router.get("/auth/google/failure", (req, res) => {
  res.send("Something went wrong");
});
//PROTECTED ROUTE
router.get(
  "/auth/protected",
  middleware.isLoggedIn,
  authControllers.handleGoogleCallback
);
//LOGOUT
router.get("/auth/logout", authControllers.logout);

//END OF ROUTE
router.post(
  "/logout",
  middleware.protect,

  // middleware.stopCapacity,

  authControllers.logout
);
// router.use(initializeData);
router.post("/signup", authControllers.signup);


module.exports = router;
