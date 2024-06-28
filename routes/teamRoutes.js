const express = require("express");
const roleControllers = require("../controllers/roleControllers.js");
const  teamControllers= require("../controllers/teamControllers.js")
const middleware=require("../middleware/auth.js")
const router = express.Router();

router.get("/", 
    
    middleware.protect,
    teamControllers.getAllTeams);


    router.get("/users/:teamId", 
    
        middleware.protect,
        middleware.restrictTo(['Admin','Power','Read Only','Read/Write']),
        
        teamControllers.getAllUserUnderTeam);
router.post("/", 
middleware.protect,
middleware.restrictTo(['Power']),

teamControllers.createTeams);


router.put("/assign-to-user",  middleware.protect,
    
    middleware.restrictTo(['Power']),
    teamControllers.assignTeamToUser);
router.put("/assign-report",  middleware.protect,
    
    middleware.restrictTo(['Admin']),
    teamControllers.assignNavigationToTeam);
router.put("/:id", middleware.protect, teamControllers.updateTeam);
router.delete("/:id", middleware.protect,teamControllers.deleteTeam);
module.exports = router;
