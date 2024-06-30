const createError = require("../utils/errorResponse.js");
const ThemeBranding = require("../models/themeBranding.js");

// GET ALL 
exports.getAllThemeBranding = async (req, res, next) => {
  try {
// console.log(req.session)
    const themeBranding = await ThemeBranding.findAll({
      attributes: { exclude: ["createdAt", "updatedAt"] },
 
       });

    return res.status(200).json(
        themeBranding)
  
  } catch (error) {
    console.log(error)
    return next(createError.createError(500, "Internal server Error"));
  }
};



exports.getCurrentThemeBranding = async (req, res, next) => {
    try {

      const themeBranding = await ThemeBranding.findAll({
        where:{TenantId:req.user.currentTenant},
        attributes: { exclude: ["createdAt", "updatedAt"] },
        
   
         });
  
      return res.status(200).json(
          themeBranding)
    
    } catch (error) {
      console.log(error)
      return next(createError.createError(500, "Internal server Error"));
    }

};
  

//CREATE 
exports.createThemeBranding = async (req, res, next) => {
    try {

const themeBranding= await ThemeBranding.findOne({
    where: {TenantId: req.user.currentTenant}
})

if(themeBranding){
    return next(createError.createError(400,"Branding already created update it"))
}
      const {
        
        loginLogoutBackground,
        showFooter,
        externalLinks,
      } = req.body;

  
      const logoImagePath = req.files?.logoImage?.[0]?.path;
      const logoImage = logoImagePath ?? null;

      const siteFaviconImagePath = req.files?.siteFaviconImage?.[0]?.path;
      const siteFaviconImage = siteFaviconImagePath?? null;
  
      const secondaryLogoImagePath = req.files?.secondaryLogoImage?.[0]?.path;
      const secondaryLogoImage = secondaryLogoImagePath?? null;
  
      const customLoaderPath = req.files?.customLoader?.[0]?.path;
      const customLoader = customLoaderPath ?? null;

    
        // Create ThemeBranding record
      const newThemeBranding = await ThemeBranding.create({
        logoImage,
        siteFaviconImage,
        customLoader,
        loginLogoutBackground,
        showFooter,
        secondaryLogoImage,
        externalLinks,
        TenantId:req.user.currentTenant
      });


  
      return res.status(201).json({ message: 'ThemeBranding created successfully', themeBranding: newThemeBranding });
    } catch (error) {
      console.error('Error creating ThemeBranding:', error);
      return next(createError.createError(500, 'Internal server error'));
    }
  };


  //UPDATE BRANDING

  exports.updateThemeBranding = async (req, res, next) => {
    try {



const {
        
    loginLogoutBackground,
    showFooter,
    externalLinks,
  } = req.body;


  const logoImagePath = req.files?.logoImage?.[0]?.path;
  const logoImage = logoImagePath ?? null;

  const siteFaviconImagePath = req.files?.siteFaviconImage?.[0]?.path;
  const siteFaviconImage = siteFaviconImagePath?? null;

  const secondaryLogoImagePath = req.files?.secondaryLogoImage?.[0]?.path;
  const secondaryLogoImage = secondaryLogoImagePath?? null;

  const customLoaderPath = req.files?.customLoader?.[0]?.path;
  const customLoader = customLoaderPath ?? null;


  const themeBranding= await ThemeBranding.findOne({
    where: {TenantId: req.user.currentTenant}
})

if(!themeBranding){
    const newThemeBranding = await ThemeBranding.create({
        logoImage,
        siteFaviconImage,
        customLoader,
        loginLogoutBackground,
        showFooter,
        secondaryLogoImage,
        externalLinks,
        TenantId:req.user.currentTenant
      });

      return res.status(200).json("Updated successfully")
}
     

const updates = {};



if (logoImage) {
  updates.logoImage = logoImage;
}
if (siteFaviconImage) {
  updates.siteFaviconImage = siteFaviconImage;
}
if (customLoader) {
  updates.loginLogoutBackground = loginLogoutBackground;
}
if (showFooter) {
  updates.showFooter = showFooter;
}
if (secondaryLogoImage) {
  updates.secondaryLogoImage = secondaryLogoImage;
}
if (externalLinks) {
  updates.externalLinks = externalLinks;
}
if (loginLogoutBackground) {
    updates.loginLogoutBackground = loginLogoutBackground;
  }
  

const result = await themeBranding.update(updates);


res.status(200).json({
  message: "updated successfully",
  data: result,
});  
      return res.status(201).json({ message: 'Updated successfully', themeBranding: newThemeBranding });
    } catch (error) {
      console.error('Error creating ThemeBranding:', error);
      return next(createError.createError(500, 'Internal server error'));
    }
  };
