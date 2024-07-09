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
const passport= require("passport")
// const GoogleStrategy= require("passport-google-oauth2").Strategy;
const sessionManagement = require('./middleware/sessionManagement.js');
const cron = require('node-cron');
const ScheduleCapacity = require('./models/scheduleCapacity.js');


const { initializeSchedules, startScheduledTasks } = require('./scheduleCapacity.js');


const startSchedules = require('./');

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
app.use('/auth1',authRoute1);



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







// const moment = require('moment-timezone');

// const currentTime = moment().tz('Africa/Nairobi').format('YYYY-MM-DD hh:mm:ss a');

// console.log('Current time in Nairobi:', currentTime);

//////SCHEDULER
// sequelize.sync().then(  async () => {
// const schedules = await ScheduleCapacity.findAll({
//   where: { isEnabled: true }
// });

// // console.log(schedules)
// schedules.forEach(schedule => {
//   const { startHour, startMinute, period, durationHours, durationMinutes } = schedule;

//   // Convert startHour and startMinute to 24-hour format
//   let hour = parseInt(startHour, 10);
//   const minute = parseInt(startMinute, 10);

//   if (period === 'PM' && hour < 12) {
//     hour += 12;
//   } else if (period === 'AM' && hour === 12) {
//     hour = 0; // Midnight case
//   }

//   // Schedule the task using node-cron
//   cron.schedule(`${minute} ${hour} * * *`, () => {
//     console.log(`Task started at ${startHour}:${startMinute} ${period}`);

//     // Calculate the duration in milliseconds
//     const duration = (durationHours * 60 * 60 * 1000) + (durationMinutes * 60 * 1000);

//     // Perform your scheduled task here
//     setTimeout(() => {
//       console.log('Task ended after specified duration');
//     }, duration);
//   });
// });
// })


// async () => {
//   console.log("Database & tables created!");

//   // Start the schedules
//  const data= await startSchedules();
//  console.log(data)
// }


// initializeSchedules().then(() => {
//   startScheduledTasks();
// }).catch(error => {
//   console.error('Failed to initialize schedules:', error);
// });

// initializeSchedules().catch(error => {
//   console.error('Failed to initialize schedules:', error);
// });

///END OF SCHEDULER


app.listen(process.env.PORT || 4400,async () => {
  console.log(`Server is running on port: ${process.env.PORT}`);
  try {
    // await setupScheduledTasks();//
  } catch (error) {
    console.log(error)
  }
});



 