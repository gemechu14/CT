const express = require("express");
const roleControllers = require("../controllers/roleControllers.js");
const tenantControllers=require("../controllers/tenantController.js")
const router = express.Router();
const middleware=require("../middleware/auth.js")

router.put("/unassign-user",

middleware.protect,
tenantControllers.unassingUserFromTenant
);
router.put("/assign-user",

middleware.protect,
tenantControllers.assingToTenant
);
router.get("/", tenantControllers.getAllTenants);
router.post("/",
middleware.protect,
tenantControllers.createTenant);


router.put("/:id",
middleware.protect,
tenantControllers.updateTenant);


router.delete("/:id",
middleware.protect,
tenantControllers.deleteTenant);



module.exports = router;
