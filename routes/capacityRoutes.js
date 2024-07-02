const express = require("express");
const middleware = require("../middleware/auth.js");
const capacityController= require("../controllers/capacityController.js");
const scheduleCapacityController= require("../controllers/scheduleCapacity.js")
const router = express.Router();

router.put("/",   middleware.protect, capacityController.updateCapacity);

router.post("/schedule", middleware.protect, scheduleCapacityController.addSchedule);
router.put("/schedule/:id" ,middleware.protect, scheduleCapacityController.updateSchedule);
router.get("/schedule",middleware.protect,scheduleCapacityController.getAllSchedules);
router.get("/schedule/:id",middleware.protect,scheduleCapacityController.getScheduleById);
router.delete("/schedule/:id",middleware.protect,scheduleCapacityController.deleteSchedule)


module.exports = router;
