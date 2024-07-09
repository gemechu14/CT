const express = require("express");
const authControllers = require("../controllers/authController.js");
const router = express.Router();
const passport = require("passport");
const session = require("express-session");
const jwt = require("jsonwebtoken");


const middleware = require("../middleware/auth.js");
const User = require("../models/Users.js");
const Tenant = require("../models/tenant.js");
const sequelize = require('../database/db');
const msRestNodeAuth = require("@azure/ms-rest-nodeauth");
const axios = require("axios");

router.post("/login", authControllers.login,        );
router.post("/signin", authControllers.googleAuthentication)
router.get("/profile", middleware.protect, authControllers.getProfile);

const users = {};

//GOOGLE AUTH
router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
  })
);

router.get('/auth/microsoft', passport.authenticate('microsoft', {
    scope: ['user.read']
  }));

  router.get('/auth/microsoft/callback', 
    passport.authenticate('microsoft', {
        successRedirect: "/auth/microsoft/protected",
        failureRedirect: '/auth/microsoft/failure'
    }),
    // authControllers.handleMicrosoftCallback
  );

  router.post('/auth/microsoft/callback', async (req, res, next) => {
    try {
      return res.json(req.body)
      // Call the controller function asynchronously
      await authControllers.handleMicrosoftCallback(req, res, next);
    } catch (error) {
      next(error); // Pass any caught errors to the error handling middleware
    }
  });
  
  router.get('/auth/microsoft/failure', (req, res) => {
    res.send('Something went wrong');
  });
  
  router.get(
    "/auth/microsoft/protected",
    middleware.isLoggedIn,
    authControllers.handleGoogleCallback
  );



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


router.get(
  "/auth/microsoft/protected",(req,res)=>{
    res.send("Hello")
  }
  // middleware.isLoggedIn,
  // authControllers.handleGoogleCallback
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




//  FOR MICROSOFT

var fetch = require('./fetch.js');

var { GRAPH_ME_ENDPOINT } = require('./authConfig.js');

// custom middleware to check auth state
function isAuthenticated(req, res, next) {
    if (!req.session.isAuthenticated) {
        return res.redirect('/auth/signin'); // redirect to sign-in route
    }

    next();
};

router.get('/id',
    isAuthenticated, // check if user is authenticated
    async function (req, res, next) {
        res.render('id', { idTokenClaims: req.session.account.idTokenClaims });
    }
);

router.get('/profile',
    isAuthenticated, // check if user is authenticated
    async function (req, res, next) {
        try {
            const graphResponse = await fetch(GRAPH_ME_ENDPOINT, req.session.accessToken);
            res.render('profile', { profile: graphResponse });
        } catch (error) {
            next(error);
        }
    }
);


//END 


module.exports = router;
