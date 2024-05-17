
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/Users.js");
const createError=require("../utils/errorResponse.js");
const Role = require("../models/role.js");
const Permission = require("../models/permission.js");
const Tenant = require("../models/tenant.js");


const signToken = (id, email,permissions,tenant,defaultTenant,currentTenant) => {
    try {
  
      const token = jwt.sign({ id, email,permissions ,tenant,defaultTenant,currentTenant}, 'secret', {
        expiresIn: '7d'
      })
  
      const refreshToken = jwt.sign({ id, email,permissions,tenant,defaultTenant,currentTenant }, 'refreshSecret', {
        expiresIn: '90d' 
      })
      return  { token, refreshToken }
    } catch (err) {
      return err;
    }
  };
  
  
  const createSendToken = async (user, statusCode, res) => {
    try {
      const {token,refreshToken} = signToken(user.id, user.email,user.permissions,user.tenant,user.defaultTenant,user.defaultTenant);
     
      await User.update({currentTenant:user.defaultTenant},{where:{id:user.id}})
      // await user.update({currentTenant:user.defaultTenant})
      const cookieOptions = {
        expires: new Date(Date.now() + 1000 * 24 * 60 * 60 * 1000),
  
        secure: "production" ? true : false,
        httpOnly: true,
      };
      user.password = undefined
      res.cookie('jwt', token, cookieOptions)
      res.status(statusCode).json({
     
        token,
        refreshToken  
      })
    } catch (error) {
      return res.status(500).json({ message: error.name });
    }
  };
  
  exports.login = async (req, res, next) => {
    try {
    
        const { email, password } = req.body;
  
      if (!email || !password ) {

        return next(createError(400, "Please provide both email and password"));

     
      }
      const user = await User.findOne({
        where: { email },
        include:[{model:Tenant,

          through: { attributes: [] },
        },
       {
          
          model: Role,
          through: { attributes: [] }, // To exclude the UserRole pivot table data
          include: {
            model: Permission,
            through: { attributes: [] } // To exclude the RolePermission pivot table data
          },
         
        },
      ]
       
      });
    

      // return res.json(user)
      if (!user || !(await bcrypt.compare(password, user.password))) {

        return next(createError.createError(401,"Unauthorized access - Invalid email, password"))
   
      }
      
      const permissions = user.Roles.reduce((acc, role) => {
        role.Permissions.forEach(permission => {
          if (!acc.includes(permission.name)) {
            acc.push(permission.name);
          }
        });
        return acc;
      }, []);
      // Extract all tenantIds from user.Tenants
const tenantIds = user.Tenants.map(tenant => tenant.id);
      // Construct the desired output object
      const userData = {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        isSuperTenant: user.isSuperTenant,
        defaultTenant:user.defaultTenant,
        currentTenant: user.defaultTenant,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        permissions: permissions,
        tenant: tenantIds
      };
      
    
  
    
    
      createSendToken(userData, 200, res);
    } catch (error) {
  console.log(error)
      return next(createError.createError(500, "Internal server error"));
  
    }
  };