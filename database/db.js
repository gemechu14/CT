

// //Remote Database 
// require("dotenv").config();
// const { Sequelize } = require("sequelize");
// const sequelize = new Sequelize({
//   host: "tai.db.elephantsql.com",
//   port: "5432",
//   database: "jnbisgop",
//   username: "jnbisgop",
//   password: "8VpbSsXEE1AwVYvKhhZ7tOueUcx_i7SF",
//   dialect: "postgres",
  


// });
// // Test the database connection
// async function testConnection() {

//   try {
       
//     await sequelize.authenticate();
//     console.log("Database connection has been established successfully.");
//   } catch (error) {
//     console.log(error)
//     // console.log(process.env.DB_HOST)
//     console.error("Error connecting");
//   }

// }

// // sequelize.sync({ alter: true }) // Use force: true carefully, as it drops existing tables
// //   .then(() => {
// //     console.log('Database synchronized successfully.');
// //   })
// //   .catch((error) => {
// //     console.error('Error synchronizing database:', error);
// //   }); 



// testConnection();
// module.exports = sequelize;




// /// SECOND DATABASE
// Remote Database 
require("dotenv").config();
const { Sequelize } = require("sequelize");
const sequelize = new Sequelize({
  host: "kala.db.elephantsql.com",
  port: "5432",
  database: "tksolwrm",
  username: "tksolwrm",
  password: "kL16oLCSAzmeRUR4WAdL8Nru6Dfzxb4c",
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








// // //Local Database 
// require("dotenv").config();
// const { Sequelize } = require("sequelize");
// const sequelize = new Sequelize({
//   host: "localhost",
//   port: "5432",
//   database: process.env.DB_NAME,
//   username: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   dialect: "postgres",
//   pool: {
//     max: 10000, // Increase max connections
//     min: 0,
//     acquire: 6000, // Increase timeout duration
//     idle: 10000
//   }


// });
// // Test the database connection
// async function testConnection() {

//   try {

    
//     await sequelize.authenticate();
//     console.log("Database connection has been established successfully.");
//   } catch (error) {
//     console.log(error)
//     // console.log(process.env.DB_HOST)
//     console.error("Error connecting");
//   }
// }

// sequelize.sync({ alter: true }) // Use force: true carefully, as it drops existing tables
//   .then(() => {
//     console.log('Database synchronized successfully.');
//   })
//   .catch((error) => {
//     console.error('Error synchronizing database:', error);
//   }); 

// testConnection();
// module.exports = sequelize;




// RENDER

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



///THIRD

// /// THIRD DATABASE
// Remote Database 
// require("dotenv").config();
// const { Sequelize } = require("sequelize");
// const sequelize = new Sequelize({
//   host: "flora.db.elephantsql.com",
//   port: "5432",
//   database: "jaracoti",
//   username: "jaracoti",
//   password: "tk4lxfpjvOv48AsV5hKRB3snExVO9H6W",
//   dialect: "postgres",
  


// });
// // Test the database connection
// async function testConnection() {

//   try {
       
//     await sequelize.authenticate();
//     console.log("Database connection has been established successfully.");
//   } catch (error) {
//     console.log(error)
//     // console.log(process.env.DB_HOST)
//     console.error("Error connecting");
//   }

// }

// // sequelize.sync({ alter: true }) // Use force: true carefully, as it drops existing tables
// //   .then(() => {
// //     console.log('Database synchronized successfully.');
// //   })
// //   .catch((error) => {
// //     console.error('Error synchronizing database:', error);
// //   }); 


// testConnection();
// module.exports = sequelize;