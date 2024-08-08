const express = require("express");
const roleControllers = require("../controllers/roleControllers.js");
const  teamControllers= require("../controllers/teamControllers.js")
const middleware=require("../middleware/auth.js")
const router = express.Router();

router.get("/", 
    
    middleware.protect,
    teamControllers.getAllTeams);

    router.get("/unassigned-users", 
    
        middleware.protect,
        teamControllers.getAllUnassignedUser);
    
    router.get("/users/:teamId", 
    
        middleware.protect,
        // middleware.restrictTo(['Admin','SuperAdmin','Read Only']),
        
        teamControllers.getAllUserUnderTeam);
router.post("/", 
middleware.protect,
middleware.restrictTo(['SuperAdmin']),

teamControllers.createTeams);


router.put("/assign-to-user",  middleware.protect,
    
    middleware.restrictTo(['SuperAdmin']),
    teamControllers.assignTeamToUser);
router.put("/assign-report",  middleware.protect,
    
    middleware.restrictTo(['Admin','SuperAdmin']),
    teamControllers.assignNavigationToTeam);
router.put("/:id", middleware.protect, teamControllers.updateTeam);
router.delete("/:id", middleware.protect,teamControllers.deleteTeam);
module.exports = router;
