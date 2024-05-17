const express = require("express");
const userController = require("../controllers/userControllers.js");
const router = express.Router();
const middleware= require("../middleware/auth.js")

router.get("/", userController.getAllUser);
router.post("/", 
middleware.protect,
userController.createUser);
router.put("/assign-role",userController.assignRoleToUser);


module.exports = router;
