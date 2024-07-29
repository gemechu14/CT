const express = require("express");
const roleControllers = require("../controllers/roleControllers.js");
const middleware=require("../middleware/auth.js");
const themeBrandingController= require("../controllers/themeBranding.js");
const upload = require("../middleware/multer.js");
const router = express.Router();

// router.get("/", 
//     middleware.protect,
//     middleware.restrictTo(['Admin','Power','Read Only','Read/Write']),
//     themeBrandingController.getAllThemeBranding);
router.get("/", 
        middleware.protect,
        middleware.restrictTo(['Admin','SuperAdmin','Read Only']),
        themeBrandingController.getCurrentThemeBranding);

router.post("/", 
            middleware.protect,
            middleware.restrictTo(['Admin','SuperAdmin','Read Only']),
            upload.fields([
                { name: 'logoImage', maxCount: 1 },
                { name: 'siteFaviconImage', maxCount: 1 },
                { name: 'customLoader', maxCount: 1 },
                { name: 'secondaryLogoImage', maxCount: 1 }]),
            themeBrandingController.createThemeBranding);

 router.put("/", 
                middleware.protect,
                middleware.restrictTo(['Admin','SuperAdmin','Read Only']),
                upload.fields([
                    { name: 'logoImage', maxCount: 1 },
                    { name: 'siteFaviconImage', maxCount: 1 },
                    { name: 'customLoader', maxCount: 1 },
                    { name: 'secondaryLogoImage', maxCount: 1 }]),
                themeBrandingController.updateThemeBranding);

module.exports = router;
