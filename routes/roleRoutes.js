const express = require("express");
const roleControllers = require("../controllers/roleControllers.js");
const middleware=require("../middleware/auth.js")
const router = express.Router();

router.get("/", 
    middleware.protect,
    middleware.restrictTo(['Admin1','Power']),
    roleControllers.getAllRoles);
router.post("/", 
middleware.protect,
roleControllers.createRole);
router.put("/assign-permissions",roleControllers.assignPermissionToRole);
router.put("/:id", middleware.protect, roleControllers.updateRoleNew);
router.delete("/:id", middleware.protect, roleControllers.deleteRole);
module.exports = router;
