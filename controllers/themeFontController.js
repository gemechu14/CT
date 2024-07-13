const ThemeFont = require("../models/themeFonts.js");
const createError = require("../utils/errorResponse.js");


// GET CURRENT TENANT THEME
exports.getCurrentThemeColors = async (req, res, next) => {
    try {

      const themefont = await ThemeFont.findAll({
        where:{TenantId:req.user.currentTenant},
        attributes: { exclude: ["createdAt", "updatedAt"] },
        
   
         });
  
      return res.status(200).json(
        themefont)
    
    } catch (error) {
      console.log(error)
      return next(createError.createError(500, "Internal server Error"));
    }

};
  

// CREATE THEME FONT
exports.createThemeLayout = async (req, res, next) => {
    try {
      const { fontFamily} = req.body;
  
      // Validate input if necessary
      if (!fontFamily ) {
        return next(createError(400, 'fontFamily is required'));
      }
  
      const themeFont= await ThemeFont.findOne({
        where: {TenantId: req.user.currentTenant}
    })
    
    if(themeFont){
        return next(createError.createError(400,"Theme Font already created update it"))
    }


      // Create a new ThemeLayout record
      const newThemeFont = await ThemeFont.create({
        fontFamily,
        TenantId: req.user.currentTenant
      });
  
      return res.status(201).json({ message: 'ThemeFont created successfully', newThemeFont });
    } catch (error) {
      console.error('Error creating ThemeFont:', error);
      return next(createError.createError(500, 'Internal server error'));
    }
  };



   //UPDATE THEME FONT
   exports.updateThemeFont = async (req, res, next) => {
    try {
      const { fontFamily } = req.body;
      // Validate input if necessary
      if (!fontFamily ) {
        return next(createError.createError(400, 'field fontFamily  is required for update'));
      }
  
      // Find the existing ThemeLayout record
      const themeFont= await ThemeFont.findOne({
        where: {TenantId: req.user.currentTenant}
    })

      if (!themeFont) {
        const newThemeFont = await ThemeFont.create({
            fontFamily,
            TenantId: req.user.currentTenant
          });

          return res.status(201).json({ message: 'ThemeLayout created successfully', newThemeFont });
      }
  
      // Prepare updates object based on provided fields
      const updates = {};
      if (fontFamily) {
        updates.fontFamily = fontFamily;
      }
      updates.TenantId= req.user.currentTenant
  
      // Perform the update
      themafont = await themeFont.update(updates);
  
      return res.status(201).json({ message: 'ThemeLayout updated successfully', themafont });
    } catch (error) {
      console.error('Error updating ThemeLayout:', error);
      return next(createError.createError(500, 'Internal server error'));
    }
  };




  