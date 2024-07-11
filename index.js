const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
const sequelize = require("./database/db");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');  
require("dotenv").config();
app.use(cors()); 
const session= require("express-session");
const fs = require("fs");
const https = require("https");
const passport= require("passport")
// const GoogleStrategy= require("passport-google-oauth2").Strategy;
const sessionManagement = require('./middleware/sessionManagement.js');
const cron = require('node-cron');
const ScheduleCapacity = require('./models/scheduleCapacity.js');
const { initializeSchedules, startScheduledTasks } = require('./scheduleCapacity.js');
// const startSchedules = require('./');

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.json());
// app.use(cookieParser());
app.use("/uploads", express.static("./uploads/"));
// app.use("/uploads", express.static("./uploads/"));
const userRoutes=require("./routes/userRoutes.js");
const roleRoutes=require("./routes/roleRoutes.js");
const permissionRoutes=require("./routes/permissionRoutes.js");
const authRoutes=require("./routes/authRoutes.js");
const tenantRoutes=require("./routes/tenantRoutes.js");
const workspacesRoute=require("./routes/workspaceRoutes.js")
const navigationRoute=require("./routes/navigationRoutes.js");
const categoryRoute=require("./routes/categoryRoutes.js")
const teamRoute= require("./routes/teamRoutes.js");
const authRoute1= require("./routes/auth.js")
const themesRoute=require("./routes/themesRoute.js")
const themeBrandingRoute=require("./routes/themeBrandingRoutes.js");
const themeColorRoute= require("./routes/themeColorRoutes.js");
const themeFontRoute=require("./routes/themeFontRoutes.js");
const themeLayoutRoute= require("./routes/themeLayoutRoute.js");
const capacityRoute= require("./routes/capacityRoutes.js")
const {setupScheduledTasks}= require("./scheduler.js")


app.use(session({
  secret: 'secret_key', 
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } 
}));


app.use(passport.initialize());
app.use(passport.session()); 

app.use("/api/v1/users",userRoutes);
app.use("/api/v1/roles", roleRoutes);
app.use("/api/v1/permissions",permissionRoutes);
app.use("/api/v1/tenants",tenantRoutes);
app.use("/api/v1/workspaces",workspacesRoute)
app.use("/api/v1/navigations",navigationRoute)
app.use("/api/v1/category",categoryRoute);
app.use("/api/v1/team", teamRoute);
app.use("/api/v1/themes", themesRoute);
app.use("/api/v1/branding",themeBrandingRoute);
app.use("/api/v1/colors", themeColorRoute)
app.use("/api/v1/fonts",themeFontRoute)
app.use("/api/v1/layouts",themeLayoutRoute)
app.use("/api/v1/capacity", capacityRoute)
app.use("/",authRoutes);

// app.use('/auth1',authRoute1);

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

  // SCHEDULE
  // const activityCheckInterval = 1 * 60 * 1000; // 5 minutes in milliseconds
  // setInterval(async () => {
  //     await sessionManagement.checkUserActivity();
  // }, activityCheckInterval);


  // SCHEDULER
// initializeSchedules().catch(error => {
//   console.error('Failed to initialize schedules:', error);
// });


// // Load SSL certificate and key
// const sslOptions = {
//   key: fs.readFileSync('./certificate/cedarplatform_io.key'),
//   cert: fs.readFileSync('./certificate/cedarplatform_io.crt')
// };


const PORT = process.env.PORT || 4400;

// Start the HTTPS server
// https.createServer(sslOptions, app).listen(PORT, async () => {
//   console.log(`Server is running on https://localhost:${PORT}`);
//   try {
//     // await setupScheduledTasks();//
//   } catch (error) {
//     console.log(error);
//   }
// });




// // Path to your SSL certificate files
const privateKey = fs.readFileSync('/home/ubuntu/cedarplatform_io.key', 'utf8');
const certificate = fs.readFileSync('/home/ubuntu/cedarplatform_io.crt', 'utf8');
const credentials = {
  key: privateKey,
  cert: certificate
};


// Create the HTTPS server
const httpsServer = https.createServer(credentials, app);


httpsServer.listen(4400, () => {
  console.log('HTTPS Server running on port 4400');
});


// app.listen(process.env.PORT || 4400,async () => {
//   console.log(`Server is running on port: ${process.env.PORT}`);
//   try {
//     // await setupScheduledTasks();//
//   } catch (error) {
//     console.log(error)
//   }
// });



 