const express = require("express");
const middleware = require("../middleware/auth.js");
const themeLayoutController = require("../controllers/themeLayout.js");
const router = express.Router();

router.get(
  "/",
  middleware.protect,
  middleware.restrictTo(["Admin", "Power", "Read Only", "Read/Write"]),
  themeLayoutController.getCurrentLayout
);
router.post(
  "/",
  middleware.protect,
  middleware.restrictTo(["Admin", "Power", "Read Only", "Read/Write"]),

  themeLayoutController.createThemeLayout
);


router.put(
    "/",
    middleware.protect,
    middleware.restrictTo(["Admin", "Power", "Read Only", "Read/Write"]),
  
    themeLayoutController.updateThemeLayout
  );
module.exports = router;
