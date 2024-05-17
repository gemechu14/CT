const express = require("express");
const userController = require("../controllers/userControllers.js");
const router = express.Router();

router.get("/", userController.getAllUser);
router.post("/", userController.createUser);
router.put("/assign-role",userController.assignRoleToUser);


module.exports = router;
