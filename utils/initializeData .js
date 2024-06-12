const express =require("express");
const Role = require('../models/role.js');
const createError=require("./errorResponse.js")

// const initializeData  = async (req,res,next) => {
//   const roles = ['admin', 'user','tenantId'];
//   try {
//     for (const roleName of roles) {
//       const roleExists = await Role.findOne({ where: { name: roleName } });
//       if (!roleExists) {
//         await Role.create({ name: roleName, description: `${roleName.charAt(0).toUpperCase() + roleName.slice(1)} role` });
//         console.log(`Role '${roleName}' created successfully`);
//       }
     
//     }
//   } catch (error) {
//     console.error('Error initializing roles:', error);
//     return res.status(500).json("Internal server error")
//     // return next(createError.createError("Error initializing roles"))
//   }
// };

// module.exports = initializeData ;


const initializeData = async (req, res, next) => {
  // const roles = [
  //   { name: 'Admin', description: 'Administrator role with full access' },
  //   { name: 'Read/Write', description: 'Read and write access' },
  //   { name: 'Read Only', description: 'Read-only access' },
  //   { name: 'Power', description: 'Power user with extended privileges' },
  // ];
  
  try {
  //   for (const role of roles) {
  //     const roleExists = await Role.findOne({ where: { name: role.name } });
  //     if (!roleExists) {
  //       await Role.create(role);
  //       console.log(`Role '${role.name}' created successfully`);
  //     }
  //   }
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error('Error initializing roles:', error);

    // return res.status(500).json("Internal server error")
    // return next(createError.createError(500, 'Error initializing roles'));
  }
};

module.exports = initializeData;