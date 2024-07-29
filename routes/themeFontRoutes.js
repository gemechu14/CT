const express = require("express");
const middleware=require("../middleware/auth.js");
const themeFontController= require("../controllers/themeFontController.js")
const router = express.Router();


router.get("/", 
        middleware.protect,
        middleware.restrictTo(['Admin','SuperAdmin','Read Only']),
themeFontController.getCurrentThemeColors);




router.post("/", 
    middleware.protect,
    middleware.restrictTo(['Admin','SuperAdmin','Read Only']),
themeFontController.createThemeLayout);


router.put("/", 
    middleware.protect,
    middleware.restrictTo(['Admin','SuperAdmin','Read Only']),
themeFontController.updateThemeFont);

module.exports = router;
