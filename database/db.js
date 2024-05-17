

//Remote Database 
require("dotenv").config();
const { Sequelize } = require("sequelize");
const sequelize = new Sequelize({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || "5432",
  database: process.env.DB_NAME || "cedarstreet",
  username: process.env.DB_USER  ||"postgres",
  password: process.env.DB_PASSWORD || "pass",
  dialect: "postgres",
});
// Test the database connection
async function testConnection() {
  try {
    // await sequelize.authenticate();
    console.log("Database connection has been established successfully.");
  } catch (error) {
    console.log(error)
    console.log(process.env.DB_HOST)
    console.error("Error connecting");
  }
}
// sequelize.sync({ alter: false }) // Use force: true carefully, as it drops existing tables
//   .then(() => {
//     console.log('Database synchronized successfully.');
//   })
//   .catch((error) => {
//     console.error('Erro r synchronizing database:', error);
//   });
  
testConnection();
module.exports = sequelize;

