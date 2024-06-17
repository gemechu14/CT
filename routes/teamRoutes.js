const express = require("express");
const roleControllers = require("../controllers/roleControllers.js");
const  teamControllers= require("../controllers/teamControllers.js")
const middleware=require("../middleware/auth.js")
const router = express.Router();

router.get("/", 
    
    middleware.protect,
    teamControllers.getAllTeams);
    router.get("/users", 
    
        middleware.protect,
        teamControllers.getAllUserUnderTeam);
router.post("/", 
middleware.protect,

teamControllers.createTeams);


router.put("/assign-to-user",  middleware.protect,teamControllers.assignTeamToUser);
router.put("/assign-report",  middleware.protect,teamControllers.assignNavigationToTeam);
router.put("/:id", middleware.protect, teamControllers.updateTeam);
router.delete("/:id", middleware.protect,teamControllers.deleteTeam);
module.exports = router;
