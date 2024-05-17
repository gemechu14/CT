const express = require("express");
const roleControllers = require("../controllers/roleControllers.js");
const middleware=require("../middleware/auth.js")
const router = express.Router();

router.get("/", roleControllers.getAllRoles);
router.post("/", 
middleware.protect,

roleControllers.createRole);
router.put("/assign-permissions",roleControllers.assignPermissionToRole)

module.exports = router;
