const express = require("express");
const userController = require("../controllers/userControllers.js");
const router = express.Router();
const middleware = require("../middleware/auth.js");

router.get("/",  middleware.protect, userController.getAllUser);
router.post("/", middleware.protect, userController.createUser);
router.put("/assign-role",  middleware.protect, userController.assignRoleToUser);
router.put("/:id", middleware.protect, userController.updateUser);
router.delete("/:id", middleware.protect, userController.deleteUser);

module.exports = router;
