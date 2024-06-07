const express = require("express");
const navigationController= require("../controllers/navigationControllers.js")
const middleware=require("../middleware/auth.js")
const router = express.Router();

router.get("/", navigationController.getAllNavigation);
router.get("/:id", navigationController.getNavigationById);
router.post("/", 
middleware.protect,
navigationController.createNavigation);

router.delete("/:id", 
    middleware.protect,
    navigationController.deleteNavigation);

module.exports = router;
