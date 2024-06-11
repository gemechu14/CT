const express = require("express");
const roleControllers = require("../controllers/roleControllers.js");
const  teamControllers= require("../controllers/teamControllers.js")
const middleware=require("../middleware/auth.js")
const router = express.Router();

router.get("/", teamControllers.getAllTeams);
router.post("/", 
middleware.protect,

teamControllers.createTeams);


router.put("/assign-to-user",teamControllers.assignTeamToUser);
router.put("/assign-report",teamControllers.assignNavigationToTeam);
router.put("/:id", middleware.protect, teamControllers.updateTeam);
router.delete("/:id", middleware.protect,teamControllers.deleteTeam);
module.exports = router;
