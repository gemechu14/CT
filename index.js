const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
const sequelize = require("./database/db");
const app = express();
const bodyParser = require("body-parser");
require("dotenv").config();



app.use(cors()); 

app.use((err, req, res, next) => {
  // res.setHeader('Access-Control-Allow-Origin','*')
  res.removeHeader("Cross-Origin-Embedder-Policy");
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went Wrong";
  console.log();
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: err.message || "Something went",
    timestamp: new Date().toISOString(),
    // stack: err.stack,
  });
});

const initializeData =require("./utils/initializeData .js");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.json());
app.use("/uploads", express.static("./uploads/"));
const userRoutes=require("./routes/userRoutes.js");
const roleRoutes=require("./routes/roleRoutes.js");
const permissionRoutes=require("./routes/permissionRoutes.js");
const authRoutes=require("./routes/authRoutes.js");
const tenantRoutes=require("./routes/tenantRoutes.js");
const workspacesRoute=require("./routes/workspaceRoutes.js")
// const UserTenant=require("./models/userTenant.js")


app.use("/api/v1/users",userRoutes);
app.use("/api/v1/roles", roleRoutes);
app.use("/api/v1/permissions",permissionRoutes);
app.use("/",authRoutes);
app.use("/api/v1/tenants",tenantRoutes);
app.use("/api/v1/get-token",workspacesRoute)


app.use(express.json());






const swaggerOptions = {
  swaggerOptions: {
    url: "http://localhost:4400/api-docs/swagger.json", // Update the URL to match your setup
  },
};



app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, swaggerOptions)
);
initializeData()
  .then(() => {
    console.log("Roles initialized successfully");
  })
  .catch((error) => {
    console.error("Error initializing roles:", error);
    process.exit(1); // Exit the process with a non-zero status code
  });

app.use((req, res, next) => {
  const error = new Error("There is no such URL");
  error.status = 404;
  next(error);
});


let isRunning = false;
app.listen(process.env.PORT || 4400, () => {
  console.log(`Server is running on port: ${process.env.PORT}`);
});



