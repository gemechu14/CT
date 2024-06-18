const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
const sequelize = require("./database/db");
const app = express();
const bodyParser = require("body-parser");
require("dotenv").config();
app.use(cors()); 
const session= require("express-session")
const sessionManagement = require('./middleware/sessionManagement.js');

// app.use((err, req, res, next) => {
//   // res.setHeader('Access-Control-Allow-Origin','*')
//   res.removeHeader("Cross-Origin-Embedder-Policy");
//   const errorStatus = err.status || 500;
//   const errorMessage = err.message || "Something went Wrong";
//   console.log();
//   return res.status(errorStatus).json({
//     success: false,
//     status: errorStatus,
//     message: err.message || "Something went",
//     timestamp: new Date().toISOString(),
//     // stack: err.stack,
//   });
// });


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.json());
app.use("/uploads", express.static("./uploads/"));
// const initializeData =require("./utils/initializeData .js");
const userRoutes=require("./routes/userRoutes.js");
const roleRoutes=require("./routes/roleRoutes.js");
const permissionRoutes=require("./routes/permissionRoutes.js");
const authRoutes=require("./routes/authRoutes.js");
const tenantRoutes=require("./routes/tenantRoutes.js");
const workspacesRoute=require("./routes/workspaceRoutes.js")
const navigationRoute=require("./routes/navigationRoutes.js");
const categoryRoute=require("./routes/categoryRoutes.js")
const teamRoute= require("./routes/teamRoutes.js")
// const UserTenant=require("./models/userTenant.js")

// Session middleware setup
app.use(session({
  secret: 'your_secret_key', // Replace with a strong secret key
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1 * 60 * 1000 } // Session expires in 1 hour (adjust as needed)
}));



app.use("/api/v1/users",userRoutes);
app.use("/api/v1/roles", roleRoutes);
app.use("/api/v1/permissions",permissionRoutes);

app.use("/api/v1/tenants",tenantRoutes);
app.use("/api/v1/workspaces",workspacesRoute)
app.use("/api/v1/navigations",navigationRoute)
app.use("/api/v1/category",categoryRoute);
app.use("/api/v1/team", teamRoute);
app.use("/",authRoutes);


app.use(express.json());

///new appi are added to this tackle


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
// initializeData()
//   .then(() => {
//     console.log("Roles initialized successfully");
//   })
//   .catch((error) => {
//     console.error("Error initializing roles:", error);
//     process.exit(1); // Exit the process with a non-zero status code
//   });


// app.use((req, res, next) => {
//   if (req.session.user) {
//     req.session.lastAccess = Date.now(); // Update last access time
//     // Store session data in locals for easier access
//     app.locals.sessions = app.locals.sessions || {};
//     app.locals.sessions[req.sessionID] = {
//       user: req.session.user,
//       lastAccess: req.session.lastAccess
//     };
//   }
//   next();
// });

  app.use((err, req, res, next) => {
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
  // const activityCheckInterval = 1 * 60 * 1000; // 5 minutes in milliseconds
  // setInterval(async () => {
  //     await sessionManagement.checkUserActivity();
  // }, activityCheckInterval);



let isRunning = false;
app.listen(process.env.PORT || 4400, () => {
  console.log(`Server is running on port: ${process.env.PORT}`);
});



