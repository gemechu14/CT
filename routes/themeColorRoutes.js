const express = require("express");
const roleControllers = require("../controllers/roleControllers.js");
const middleware=require("../middleware/auth.js");
const themeBrandingController= require("../controllers/themeBranding.js");
const themeColorController= require("../controllers/themeColorsControllers.js")
const upload = require("../middleware/multer.js");
const router = express.Router();

// router.get("/", 
//     middleware.protect,
//     middleware.restrictTo(['Admin','Power','Read Only','Read/Write']),
//     themeBrandingController.getAllThemeBranding);
router.get("/", 
        middleware.protect,
        middleware.restrictTo(['Admin','SuperAdmin','Read Only']),
themeColorController.getCurrentThemeColors);


router.post("/", 
    middleware.protect,
    middleware.restrictTo(['Admin','SuperAdmin','Read Only']),
   
    themeColorController.createThemeColor);


    router.put("/", 
        middleware.protect,
        middleware.restrictTo(['Admin','SuperAdmin','Read Only']),       
        themeColorController.updateThemeColor);


        router.put("/reset", 
                middleware.protect,
                middleware.restrictTo(['Admin','SuperAdmin','Read Only',]),       
                themeColorController.resetThemeColor);
module.exports = router;
