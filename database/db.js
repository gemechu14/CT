

//Remote Database 
require("dotenv").config();
const { Sequelize } = require("sequelize");
const sequelize = new Sequelize({
  host: "tai.db.elephantsql.com",
  port: "5432",
  database: "jnbisgop",
  username: "jnbisgop",
  password: "8VpbSsXEE1AwVYvKhhZ7tOueUcx_i7SF",
  dialect: "postgres",

});
// Test the database connection
async function testConnection() {

  try {

    
    await sequelize.authenticate();
    console.log("Database connection has been established successfully.");
  } catch (error) {
    console.log(error)
    // console.log(process.env.DB_HOST)
    console.error("Error connecting");
  }
}

// sequelize.sync({ alter: true }) // Use force: true carefully, as it drops existing tables
//   .then(() => {
//     console.log('Database synchronized successfully.');
//   })
//   .catch((error) => {
//     console.error('Error synchronizing database:', error);
//   });
  
testConnection();
module.exports = sequelize;




// Create a new Sequelize instance with database connection details
// const { Sequelize } = require("sequelize");
// // const CustomError = require("../utils/ErrorHandler");
// // const { Sequelize } = require('sequelize');

// const sequelize = new Sequelize('om/pgdb_1cwn', {
//   dialect: 'postgres',
//   protocol: 'postgres',
//   dialectOptions: {
//     ssl: {
//       require: true,
//       rejectUnauthorized: false,
//     },
//   },
// });
// // Test the database connection
// async function testConnection() {
//   try {
//     await sequelize.authenticate();
//     console.log("Database connection has been established successfully.");
//   } catch (error) {
//     console.error("Error connecting:", error);
//   }
// }

// // Call the function to test the connection
// testConnection();
// module.exports = sequelize;