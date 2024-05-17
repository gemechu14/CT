const express = require("express");
const permissionControllers = require("../controllers/permissionControllers");
const router = express.Router();
const middleware=require("../middleware/auth.js")

router.get("/", permissionControllers.getAllPermissions);
router.post("/", 
middleware.protect,
permissionControllers.createpermission);

module.exports = router;
