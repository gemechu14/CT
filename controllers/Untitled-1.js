// // To convert this SQL schema to Node.js using Sequelize with PostgreSQL, you'll first need to define models corresponding to each table and view in your SQL script. Below is the Sequelize implementation for your schema:

// ```javascript
// // Import necessary modules
// const { Sequelize, DataTypes } = require('sequelize');

// // Initialize Sequelize with PostgreSQL connection
// const sequelize = new Sequelize('your_database', 'your_username', 'your_password', {
//   host: 'localhost',
//   dialect: 'postgres'
// });

// // Define models
// const Permissions = sequelize.define('Permissions', {
//   PermissionsId: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true
//   },
//   OrganisationId: {
//     type: DataTypes.INTEGER,
//     allowNull: true
//   },
//   NavigationId: {
//     type: DataTypes.INTEGER,
//     allowNull: false
//   },
//   UserGroup: {
//     type: DataTypes.INTEGER,
//     allowNull: false
//   },
//   Permission: {
//     type: DataTypes.INTEGER,
//     allowNull: false
//   },
//   Role: {
//     type: DataTypes.STRING(3000),
//     allowNull: true
//   },
//   CanEdit: {
//     type: DataTypes.BOOLEAN,
//     allowNull: true
//   }
// });

// const UserGroups = sequelize.define('UserGroups', {
//   UserGroupsId: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true
//   },
//   OrganisationId: {
//     type: DataTypes.INTEGER,
//     allowNull: true
//   },
//   GroupAzId: {
//     type: DataTypes.STRING(150),
//     allowNull: true
//   },
//   GroupName: {
//     type: DataTypes.STRING(1500),
//     allowNull: true
//   },
//   DateSynched: {
//     type: DataTypes.DATE,
//     allowNull: true
//   },
//   Description: {
//     type: DataTypes.STRING(2500),
//     allowNull: true
//   },
//   UserEmail: {
//     type: DataTypes.STRING(300),
//     allowNull: true
//   },
//   RoleType: {
//     type: DataTypes.STRING(300),
//     allowNull: true
//   },
//   IsUser: {
//     type: DataTypes.BOOLEAN,
//     allowNull: true
//   }
// });

// const NavigationSetup = sequelize.define('NavigationSetup', {
//   NavigationSetupId: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true
//   },
//   OrganisationId: {
//     type: DataTypes.INTEGER,
//     allowNull: true
//   },
//   Title: {
//     type: DataTypes.STRING(350),
//     allowNull: true
//   },
//   CategoryId: {
//     type: DataTypes.INTEGER,
//     allowNull: false
//   },
//   Type: {
//     type: DataTypes.STRING(10),
//     allowNull: true
//   },
//   PagePath: {
//     type: DataTypes.TEXT,
//     allowNull: true
//   },
//   PowerBiWorkspace: {
//     type: DataTypes.STRING(150),
//     allowNull: true
//   },
//   SortOrder: {
//     type: DataTypes.INTEGER,
//     allowNull: false
//   },
//   Parent: {
//     type: DataTypes.INTEGER,
//     allowNull: true
//   },
//   Icon: {
//     type: DataTypes.STRING(100),
//     allowNull: true
//   },
//   Description: {
//     type: DataTypes.STRING(300),
//     allowNull: true
//   },
//   PageType: {
//     type: DataTypes.STRING(30),
//     allowNull: true
//   },
//   IsRls: {
//     type: DataTypes.BOOLEAN,
//     allowNull: true
//   },
//   ShowFilter: {
//     type: DataTypes.BOOLEAN,
//     allowNull: true
//   },
//   ShowContentPane: {
//     type: DataTypes.BOOLEAN,
//     allowNull: true
//   },
//   ShowExportButton: {
//     type: DataTypes.BOOLEAN,
//     allowNull: true
//   },
//   ShowSharingButton: {
//     type: DataTypes.BOOLEAN,
//     allowNull: true
//   },
//   HideTitleAnddescription: {
//     type: DataTypes.BOOLEAN,
//     allowNull: false
//   },
//   HideTitleSection: {
//     type: DataTypes.BOOLEAN,
//     allowNull: false
//   },
//   CreatedBy: {
//     type: DataTypes.STRING(300),
//     allowNull: true
//   },
//   CreatedOn: {
//     type: DataTypes.DATE,
//     allowNull: false
//   },
//   UpdatedOn: {
//     type: DataTypes.DATE,
//     allowNull: false
//   },
//   ReportType: {
//     type: DataTypes.TEXT,
//     allowNull: true
//   },
//   ReportPages: {
//     type: DataTypes.TEXT,
//     allowNull: true
//   },
//   UseDynamicBinding: {
//     type: DataTypes.BOOLEAN,
//     allowNull: true
//   },
//   DynamicDataSetWorkspace: {
//     type: DataTypes.STRING(50),
//     allowNull: true
//   },
//   DynamicDataSetid: {
//     type: DataTypes.STRING(750),
//     allowNull: true
//   },
//   ReportDatasetId: {
//     type: DataTypes.STRING(50),
//     allowNull: true
//   }
// });

// const Vw_NavigationSecurity = sequelize.define('Vw_NavigationSecurity', {
//   // Define view fields here based on your SQL script
// }, {
//   tableName: 'Vw_NavigationSecurity',
//   timestamps: false
// });

// const PowerBiWorkSpaces = sequelize.define('PowerBiWorkSpaces', {
//   PowerBiWorkSpacesId: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true
//   },
//   OrganisationId: {
//     type: DataTypes.INTEGER,
//     allowNull: true
//   },
//   PowerBiWorkSpaceName: {
//     type: DataTypes.STRING(500),
//     allowNull: true
//   },
//   PowerBiId: {
//     type: DataTypes.STRING(80),
//     allowNull: true
//   },
//   IsActive: {
//     type: DataTypes.BOOLEAN,
//     allowNull: true
//   }
// });

// const VW_NavigationSetup = sequelize.define('VW_NavigationSetup', {
//   // Define view fields here based on your SQL script
// }, {
//   tableName: 'VW_NavigationSetup',
//   timestamps: false
// });

// // Define associations if any

// // Synchronize models with the database
// sequelize.sync({ force: false })
//   .then(() => {
//     console.log('Database & tables synced');
//   })
//   .catch(err => {
//     console.error('Error syncing database:', err);
//   });

// // Export models
// module.exports = {
//   Permissions,
//   UserGroups,
//   NavigationSetup,
//   Vw_NavigationSecurity,
//   PowerBiWorkSpaces,
//   VW_NavigationSetup
// };
// ```

// Remember to replace `'your_database'`, `'your_username'`, and `'your_password'` with your actual database name, username, and password respectively. This script defines Sequelize models for each table and view in your SQL schema and synchronizes them with the database.