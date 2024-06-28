const express = require("express");
const roleControllers = require("../controllers/roleControllers.js");
const themeControllers= require("../controllers/themeController.js")
const middleware=require("../middleware/auth.js")
const router = express.Router();

router.get("/", 
    // middleware.protect,
    // middleware.restrictTo(['Admin','Power','Read Only','Read/Write']),
    themeControllers.getAllTheme);
// router.post("/", 
// middleware.protect,
// roleControllers.createRole);
// router.put("/assign-permissions",roleControllers.assignPermissionToRole);
// router.put("/:id", middleware.protect, roleControllers.updateRoleNew);
// router.delete("/:id", middleware.protect, roleControllers.deleteRole);
module.exports = router;
