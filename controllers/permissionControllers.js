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
     const {name,description} =req.body;

     const existingPermission = await Permission.findOne({ where: { name } });
     if (existingPermission) {
       return next(createError.createError(500,"Permission already defined "))
     }
 
 
     const newUPermission = await Permission.create({
       name,
       description
   
     });
 
     res.status(201).json({ message: "Permission registered successfully", Permission: newUPermission });
     
    
        
    } catch (error) {
        return next(createError.createError(500,"Internal server Error"))
        
    }

};