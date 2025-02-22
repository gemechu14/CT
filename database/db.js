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
// require("dotenv").config();
// const { Sequelize } = require("sequelize");
// const sequelize = new Sequelize({
//   host: "kala.db.elephantsql.com",
//   port: "5432",
//   database: "tksolwrm",
//   username: "tksolwrm",
//   password: "kL16oLCSAzmeRUR4WAdL8Nru6Dfzxb4c",
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

// // //PRODUCTION Database
require("dotenv").config();
const { Sequelize } = require("sequelize");
const sequelize = new Sequelize({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,

  dialect: "postgres",
  // pool: {
  //   max: 10000, // Increase max connections
  //   min: 0,
  //   acquire: 6000, // Increase timeout duration
  //   idle: 10000
  // }
});
// Test the database connection
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("Database connection has been established successfully.");
  } catch (error) {
    console.log(error);
    // console.log(process.env.DB_HOST)
    console.error("Error connecting");
  }
}

// sequelize.sync({ alter: true }) // Use force: true carefully, as it drops existing tables
//   .then(() => {
//     console.log('Database synchronized successfully.');
//   })
//   .catch((error) => {
//     console.error('Error synchronizing database:', error.message);
//   });

testConnection();
module.exports = sequelize;

//

// RENDER

// // Create a new Sequelize instance with database connection details
// require("dotenv").config();
// const { Sequelize } = require("sequelize");
// const sequelize = new Sequelize({
//   host: "dpg-cp3gmi7sc6pc73foh22g-a.oregon-postgres.render.com",
//   port: "5432",
//   database: "ct",
//   username: 'ct_user',
//   password: 'y3sNLAB4dr7pcq8pCBqwMtoCzMsvrZq1',
//   dialect: "postgres",
//   // pool: {
//   //   max: 10000, // Increase max connections
//   //   min: 0,
//   //   acquire: 6000, // Increase timeout duration
//   //   idle: 10000
//   // }
//   dialectOptions: {
//     ssl: {
//       require: true, // This will help in ensuring SSL connection
//       rejectUnauthorized: false // This might be necessary for some providers like Heroku
//     }}

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

// // sequelize.sync({ alter: true }) //Use force: true carefully, as it drops existing tables
// //   .then(() => {
// //     console.log('Database synchronized successfully.');
// //   })
// //   .catch((error) => {
// //     console.error('Error synchronizing database:', error);
// //   });

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
