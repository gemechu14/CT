const { Certificate } = require("crypto");
const Role = require("../models/role.js");
const Permission = require("../models/permission.js");
const RolePermission = require("../models/rolePermission.js");
const createError = require("../utils/errorResponse.js");
const { create } = require("domain");
const User = require("../models/Users.js");
const UserRole = require("../models/userRole.js");
const sequelize = require('../database/db');
const { use } = require("../routes/userRoutes.js");
const Capacity = require("../models/capacity.js");
const { nextTick } = require("process");


exports.getAllCapacity = async (req, res, next) => {
  try {
    const capacity = await Capacity.findAll();

    res.status(200).json(capacity);
  } catch (error) {
    console.error('Error fetching schedules:', error);
    return next(createError.createError(500, 'Internal server error.'));
  }
};

exports.updateCapacity= async(req,res,next)=>{
    try {
        

        const { embeddedTimeout}= req.body;

        if(!embeddedTimeout){
            return next(createError.createError(400, "The 'embeddedTimeout' field is required and cannot be empty."))
        }
        const checkCapacity = await Capacity.findOne({
            where: { selectedCapacity: "superTenant" },
          });
          const updates = {};
          if (embeddedTimeout) {
            updates.embeddedTimeout = embeddedTimeout;
          }

          if (checkCapacity === null) {
            await Capacity.create({
              selectedCapacity: "superTenant",
              embeddedTimeout: embeddedTimeout?? 100,

            });
          }
          else{
            await checkCapacity.update(updates)
          }
    
  return res.status(200).json({
    message: " updated successfully"
  })

    } catch (error) {
        console.log(error)
        return next(createError.createError(500,"Internet server server"))
        
    }
}
