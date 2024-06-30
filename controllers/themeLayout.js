const ThemeLayout = require("../models/themeLayout.js");
const createError = require("../utils/errorResponse.js");


// GET CURRENT TENANT THEME
exports.getCurrentLayout = async (req, res, next) => {
    try {

      const themeLayout = await ThemeLayout.findAll({
        where:{TenantId:req.user.currentTenant},
        attributes: { exclude: ["createdAt", "updatedAt"] },
        
   
         });
  
      return res.status(200).json(
        themeLayout)
    
    } catch (error) {
      console.log(error)
      return next(createError.createError(500, "Internal server Error"));
    }

};
  


//CREATE LAYOUT
exports.createThemeLayout = async (req, res, next) => {
    try {
      const { layout} = req.body;
  
      // Validate input if necessary
      if (!layout ) {
        return next(createError(400, 'layout is required'));
      }
  
      const themeLayout= await ThemeLayout.findOne({
        where: {TenantId: req.user.currentTenant}
    })
    
    if(themeLayout){
        return next(createError.createError(400,"Theme Layout already created update it"))
    }


      // Create a new ThemeLayout record
      const newThemeLayout = await ThemeLayout.create({
        layout,
        TenantId: req.user.currentTenant
      });
  
      return res.status(201).json({ message: 'ThemeLayout created successfully', themeLayout: newThemeLayout });
    } catch (error) {
      console.error('Error creating ThemeLayout:', error);
      return next(createError.createError(500, 'Internal server error'));
    }
  };


  //UPDATE THEME LAYOUT

  exports.updateThemeLayout = async (req, res, next) => {
    try {
      const { layout } = req.body;
      // Validate input if necessary
      if (!layout ) {
        return next(createError.createError(400, 'field layout  is required for update'));
      }
  
      // Find the existing ThemeLayout record
      const themeLayout= await ThemeLayout.findOne({
        where: {TenantId: req.user.currentTenant}
    })

      if (!themeLayout) {
        const newThemeLayout = await ThemeLayout.create({
            layout,
            TenantId: req.user.currentTenant
          });

          return res.status(201).json({ message: 'ThemeLayout created successfully', themeLayout: newThemeLayout });
      }
  
      // Prepare updates object based on provided fields
      const updates = {};
      if (layout) {
        updates.layout = layout;
      }
      updates.TenantId= req.user.currentTenant
  
      // Perform the update
      themalayout = await themeLayout.update(updates);
  
      return res.status(201).json({ message: 'ThemeLayout updated successfully', themalayout });
    } catch (error) {
      console.error('Error updating ThemeLayout:', error);
      return next(createError.createError(500, 'Internal server error'));
    }
  };