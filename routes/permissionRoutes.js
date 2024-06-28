const express = require("express");
const permissionControllers = require("../controllers/permissionControllers");
const router = express.Router();
const middleware=require("../middleware/auth.js")

router.get("/", permissionControllers.getAllPermissions);
router.post("/", 
middleware.protect,
permissionControllers.createpermission);


router.put("/:id", 
middleware.protect,
permissionControllers.updatePermission);

router.delete("/:id", 
middleware.protect,
permissionControllers.deletePermission);
module.exports = router;
