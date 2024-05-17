

//Remote Database 
require("dotenv").config();
const { Sequelize } = require("sequelize");
const sequelize = new Sequelize({
  host: "localhost",
  port: "5432",
  database: "cedarstreet",
  username: "postgres",
  password: "pass",
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
sequelize.sync({ alter: true }) // Use force: true carefully, as it drops existing tables
  .then(() => {
    console.log('Database synchronized successfully.');
  })
  .catch((error) => {
    console.error('Error synchronizing database:', error);
  });
  
testConnection();
module.exports = sequelize;

