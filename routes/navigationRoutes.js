const express = require("express");
const navigationController= require("../controllers/navigationControllers.js")
const middleware=require("../middleware/auth.js")
const router = express.Router();

router.get("/", middleware.protect,navigationController.getAllNavigation);
router.get("/:id",middleware.protect,
    middleware.checkCapacity,
    
    navigationController.getNavigationById);



router.post("/", 
middleware.protect,
navigationController.createNavigation);

router.delete("/:id", 
    middleware.protect,
    navigationController.deleteNavigation);

router.put("/bulkupdate",   middleware.protect,navigationController.bulkUpdateNavigation)

module.exports = router;
