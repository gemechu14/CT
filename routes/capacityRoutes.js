const express = require("express");
const middleware = require("../middleware/auth.js");
const capacityController= require("../controllers/capacityController.js")
const router = express.Router();

router.put("/",   middleware.protect, capacityController.updateCapacity);

module.exports = router;
