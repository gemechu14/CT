const express = require("express");
const roleControllers = require("../controllers/roleControllers.js");
const middleware=require("../middleware/auth.js")
const router = express.Router();

router.post("/", 
    middleware.protect,
    middleware.restrictTo(['Admin','Power','Read Only','Read/Write']),
    roleControllers.getAllRoles);



module.exports = router;
