const express = require("express");
const workspacesControllers = require("../controllers/workspacesController.js");
// const middleware=require("../middleware/auth.js")
const router = express.Router();
router.get("/", workspacesControllers.getWorkspaces);
// router.get("/workspaces/generate-token", workspacesControllers.generateTokenWithRequiredPermission);
router.get("/get-token", workspacesControllers.getAccessToken);
router.get("/get-embedtoken", workspacesControllers.fetchEmbedToken);
router.get("/reports",workspacesControllers.getReports)
router.get("/reports/details",workspacesControllers.fetchReportDetails)
router.get("/dashboards",workspacesControllers.getDashboards)
router.get("/datasets",workspacesControllers.getDATASETS)
router.get("/capabilities",workspacesControllers.getListOfOfCapability);
router.get("/capabilities/start",workspacesControllers.startCapability);
router.get("/capabilities/pause",workspacesControllers.pauseCapability);


module.exports = router;

