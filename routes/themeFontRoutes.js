const express = require("express");
const middleware=require("../middleware/auth.js");
const themeFontController= require("../controllers/themeFontController.js")
const router = express.Router();


router.get("/", 
        middleware.protect,
        middleware.restrictTo(['Admin','Power','Read Only','Read/Write']),
themeFontController.getCurrentThemeColors);




router.post("/", 
    middleware.protect,
    middleware.restrictTo(['Admin','Power','Read Only','Read/Write']),
themeFontController.createThemeLayout);


router.put("/", 
    middleware.protect,
    middleware.restrictTo(['Admin','Power','Read Only','Read/Write']),
themeFontController.updateThemeFont);

module.exports = router;
