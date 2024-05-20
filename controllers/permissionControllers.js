const Permission = require("../models/permission.js");
const createError=require("../utils/errorResponse.js");



// GET ALL USER
exports.getAllPermissions = async (req, res,next) => {

    try {
        const permissions = await Permission.findAll(
            {
                attributes:{ exclude:[ "createdAt","updatedAt"]}
            }
        );
    
          return res.status(200).json({
            data:permissions});
        
    } catch (error) {
        console.log(error)
        return next(createError.createError(500,"Internal server Error"))
        
    }

};


// CREATE PERMISSION
exports.createpermission = async (req, res,next) => {

    try {
     const {name,description,isSuperTenantPermission} =req.body;

     const existingPermission = await Permission.findOne({ where: { name } });
     if (existingPermission) {
       return next(createError.createError(400,"Permission already defined "))
     }
 
 
     const newUPermission = await Permission.create({
       name,
       description,
       isSuperTenantPermission
   
     });
 
     res.status(201).json({ message: "Permission registered successfully", Permission: newUPermission });
     
    
        
    } catch (error) {
        return next(createError.createError(500,"Internal server Error"))
        
    }

};

exports.updatePermission = async (req, res, next) => {
    try {
      //insert required field
      const { name, description ,isSuperTenantPermission} = req.body;
      const updates = {};
      const { id } = req.params;
  
      const permission = await Permission.findOne({
        where: { id: id },
      });
      if (!permission) {
        return next(createError.createError(404, "Permission not found"));
      }
      if (name) {
        updates.name = name;
      }
      if (description) {
        updates.description = description;
      }
     
      if(isSuperTenantPermission){
        updates.isSuperTenantPermission=isSuperTenantPermission
      }
  
      const result = await permission.update(updates);
  
      res.status(200).json({
        message: "updated successfully",
        data: result,
      });
    } catch (error) {
      console.log(error);
      return next(createError.createError(500, "Internal server Error"));
    }
  };
  
  exports.deletePermission = async (req, res, next) => {
    try {
      const { id } = req.params;
      const permission = await Permission.findOne({ where: { id: id } });
      if (!permission) {
        return next(createError.createError(404, "Permission not found"));
      }
      await permission.destroy({ where: { id } });
      res.status(200).json({ message: "Deleted successfully" });
    } catch (error) {
      console.log(error);
      return next(createError.createError(500, "Internal server error"));
    }
  };
  
  
  