const express = require("express");
const userController = require("../controllers/userControllers.js");
const router = express.Router();
const middleware = require("../middleware/auth.js");
const upload = require("../middleware/multer.js");

router.get(
  "/",
  middleware.protect,

  middleware.restrictTo(["Admin", "Power", "Read Only", "Read/Write"]),
  userController.getAllUser
);


router.post(
  "/",
  middleware.protect,
  middleware.restrictTo(["Power"]),
 
  userController.createUser
);
router.put(
  "/assign-role",
  middleware.protect,
  middleware.restrictTo(["Power"]),
  userController.assignRoleToUser
);




router.put(
  "/assign-supertenant",
  middleware.protect,
  middleware.restrictToSuperTenant,
  // middleware.restrictTo(["Power"]),
  userController.assignSuperTenant
);



router.put(
  "/change-status/",
  middleware.protect,
  middleware.restrictTo(["Power"]),
  userController.activateUser
);

router.put(
  "/changepassword/",
  middleware.protect,
  // middleware.restrictTo(["Power"]),
  userController.changePassword
);

router.put(
  "/resetpassword/:id",
  middleware.protect,
  middleware.restrictTo(["Power"]),
  userController.resetPassword
);

router.put(
  "/change-profile",
  middleware.protect,
upload.fields([
  { name: "imageUrl", maxCount: 1 },

]),
  userController.changeProfile
);
router.put(
  "/",
  middleware.protect,
  // middleware.restrictTo(["Power"]),
  userController.updateUserProfile
);

router.put(
  "/:id",
  middleware.protect,
  middleware.restrictTo(["Power"]),
  userController.updateUser
);
router.delete(
  "/:id",

  middleware.protect,
  middleware.restrictTo(["Power"]),
  userController.deleteUser
);

module.exports = router;


