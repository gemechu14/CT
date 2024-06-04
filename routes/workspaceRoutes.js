const express = require("express");
const workspacesControllers = require("../controllers/workspacesController.js");
// const middleware=require("../middleware/auth.js")
const router = express.Router();
router.get("/workspaces", workspacesControllers.getWorkspaces);
router.get("/", workspacesControllers.getAccessToken);



module.exports = router;
