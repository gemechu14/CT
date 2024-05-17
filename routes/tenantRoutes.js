const express = require("express");
const roleControllers = require("../controllers/roleControllers.js");
const tenantControllers=require("../controllers/tenantController.js")
const router = express.Router();

router.get("/", tenantControllers.getAllTenants);
router.post("/",tenantControllers.createTenant);

module.exports = router;
