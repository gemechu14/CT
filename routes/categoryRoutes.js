const express = require("express");
const navigationController = require("../controllers/navigationControllers.js");
const categoryController = require("../controllers/categoryControllers.js");
const middleware = require("../middleware/auth.js");
const router = express.Router();

router.get("/",   middleware.protect, categoryController.getAllCategory);
router.post("/", middleware.protect, categoryController.createCategory);
router.delete("/:id", middleware.protect, categoryController.deleteCategory);
router.put("/bulkupdate",  middleware.protect,categoryController.bulkUpdateCategory)

module.exports = router;
