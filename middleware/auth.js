const createError = require("../utils/errorResponse.js");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const user = require("../models/Users.js");
const User = require("../models/Users.js");
const Capacity = require("../models/capacity.js");
const sequelize = require('../database/db');
const msRestNodeAuth = require("@azure/ms-rest-nodeauth");
const axios = require("axios");
const Role = require("../models/role.js");

exports.protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req?.cookies?.jwt) {
      token = req?.cookies?.jwt;
    }
    if (!token || token === "expiredtoken") {
      return next(
        createError.createError(
          401,
          "You are not logged in, please log in to get access"
        )
      );
    }
    const decoded = await promisify(jwt.verify)(token, "secret");
    let currentUser;

    currentUser = await User.findByPk(Number(decoded.id));

    if (!currentUser) {
      return next(
        createError.createError(401, `currentUserdoes not longer exists `)
      );
    } else {
      await currentUser.update({ last_active_at: new Date() });
      req.user = currentUser;

      next();
    }
  } catch (err) {
    console.log(err);
    return next(createError.createError(401, "unauthorized access"));
  }
};

//Restricted to SUPERTENANT
exports.restrictTo = (allowedRoleNames) => {
  return async (req, res, next) => {
    try {
     console.log(req.user)

          if (req?.user?.isSuperTenant) {
        return next();
      }

      // Fetch the role name from the database
      const role = await Role.findOne({ where: { id: req?.user?.RoleId } });

      if (!role) {
        return next(
          createError.createError(
            401,
            "You do not have permission to perform this action"
          )
        );
      }
// return res.json(allowedRoleNames.includes(role.name))
      // Check if the role name is in the allowedRoleNames array
      if (allowedRoleNames.includes(role?.name)) {
        return next();
      } else {
        return next(
          createError.createError(
            401,
            "You do not have permission to perform this action"
          )
        );
      }
    } catch (error) {
      console.log(error)
      return next(
        createError.createError(
          500,
          "An error occurred while checking permissions"
        )
      );
    }
  };
};


//Restricted to SUPERTENANT
exports.restrictToSuperTenant = (isSuperTenant) => {
  return async (req, res, next) => {
    // Check if the user is a super tenant

    if (req?.user?.isSuperTenant === isSuperTenant) {
      next();
    } else {
      return next(
        createError.createError(
          401,
          "You do not have permission to perform this action"
        )
      );
    }
  };
};

exports.checkCapacity = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
  

    const capacity = await Capacity.findOne({where: {selectedCapacity: 'superTenant'}});
    // return res.json(capacity.length)
    if (capacity === null) {

      await Capacity.create({
        selectedCapacity:"superTenant",
        embeddedTimeout:100,
      });
      
    }
       
    const foundCapacity= await Capacity.findOne({where: {selectedCapacity: 'superTenant'}});

    
    const creds = await msRestNodeAuth.loginWithServicePrincipalSecret(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      process.env.TENANT_ID,
      {
        tokenAudience: "https://management.azure.com/",
      }
    );

    const token = creds?.tokenCache?._entries[0]?.accessToken;

    const url = `https://management.azure.com/subscriptions/${process.env.SUBSCRIPTION_ID}/resourceGroups/${process.env.RESOURCEGROUPNAME}/providers/Microsoft.Fabric/capacities/${process.env.DEDICATEDCAPACITYNAME}/resume?api-version=${process.env.APPVERSION}`;

    const response = await axios.post(
      url,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
 

  console.log(response.status)
  if(response?.status === 200 || response?.status === 201 || response?.status === 202){
    await foundCapacity.update({isActive:true},
      // {transaction}
          
    )
  }
  


 
  //  await transaction.commit();

      next()
   

    //  if (foundCapacity.isActive){
    //   next();
    //  }
     
    //  else{
     

    //   const creds = await msRestNodeAuth.loginWithServicePrincipalSecret(
    //     process.env.CLIENT_ID,
    //     process.env.CLIENT_SECRET,
    //     process.env.TENANT_ID,
    //     {
    //       tokenAudience: "https://management.azure.com/",
    //     }
    //   );
  
    //   const token = creds?.tokenCache?._entries[0]?.accessToken;
  
    //   const url = `https://management.azure.com/subscriptions/${process.env.SUBSCRIPTION_ID}/resourceGroups/${process.env.RESOURCEGROUPNAME}/providers/Microsoft.Fabric/capacities/${process.env.DEDICATEDCAPACITYNAME}/resume?api-version=${process.env.APPVERSION}`;
  
    //   const response = await axios.post(
    //     url,
    //     {},
    //     {
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //         "Content-Type": "application/json",
    //       },
    //     }
    //   );
   

    // console.log(response.status)
    // if(response.status === 200 || response.status === 201 || response.status === 202){
    //   await foundCapacity.update({isActive:true},
    //     // {transaction}
            
    //   )
    // }

   
    // //  await transaction.commit();

    //     next()
    //  }


   


  } catch (error) {
    // await transaction.rollback();
    console.log(error);
    next()
    // return next(createError.createError(500, "Internal server error"));
  }
};


exports.stopCapacity = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
  

    const capacity = await Capacity.findOne({where: {selectedCapacity: 'superTenant'}});
    // return res.json(capacity.length)
    if (capacity === null) {

      await Capacity.create({
        selectedCapacity:"superTenant",
        embeddedTimeout:100,
      });
      
    }
    
   
    const foundCapacity= await Capacity.findOne({where: {selectedCapacity: 'superTenant'}});

     if (!foundCapacity.isActive){
      next();
     }
     
     else{
     

      const userCount= await User.count({where:{   isLoggedIn:true,}})

      // return res.json(user)

      if(userCount >1){

        next()
      }else if( userCount ===1 ){

      const creds = await msRestNodeAuth.loginWithServicePrincipalSecret(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        process.env.TENANT_ID,
        {
          tokenAudience: "https://management.azure.com/",
        }
      );
  
      const token = creds?.tokenCache?._entries[0]?.accessToken;
  
      const url = `https://management.azure.com/subscriptions/${process.env.SUBSCRIPTION_ID}/resourceGroups/${process.env.RESOURCEGROUPNAME}/providers/Microsoft.Fabric/capacities/${process.env.DEDICATEDCAPACITYNAME}/suspend?api-version=${process.env.APPVERSION}`;
  
      const response = await axios.post(
        url,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
   

    console.log(response.status)
    if(response.status === 200 || response.status === 201 || response.status === 202){
      await foundCapacity.update({isActive:false},
        // {transaction}
      
      
      )
    }

   
    //  await transaction.commit();

        next()
     }


   
    }

  } catch (error) {
    // await transaction.rollback();
    console.log(error);
    return next(createError.createError(500, "Internal server error"));
  }
};
