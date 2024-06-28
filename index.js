const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
const sequelize = require("./database/db");
const app = express();
const bodyParser = require("body-parser");
require("dotenv").config();
app.use(cors()); 
const session= require("express-session");
const passport= require("passport")
const GoogleStrategy= require("passport-google-oauth2").Strategy;
const sessionManagement = require('./middleware/sessionManagement.js');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.json());
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
app.use("/",authRoutes);

app.use('/auth1',authRoute1)



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






  // MICROSOFT AUTHENTICATION

//   const { msalConfig, REDIRECT_URI, POST_LOGOUT_REDIRECT_URI, GRAPH_ME_ENDPOINT } = require('./routes/authConfig.js');
//   const AuthProvider = require('./routes/AuthProvider.js');
//   const fetch = require('./routes/fetch.js');


//   const authProvider = new AuthProvider(msalConfig);


// // Authentication Routes
// app.get('/auth/signin', authProvider.login({
//   scopes: [],
//   redirectUri: REDIRECT_URI,
//   successRedirect: '/auth/microsoft/protected'
// }));

// app.get('/auth/acquireToken', authProvider.acquireToken({
//   scopes: ['User.Read'],
//   redirectUri: REDIRECT_URI,
//   successRedirect: '/users/profile'
// }));

// app.get('/auth/redirect', authProvider.handleRedirect());

// app.get('/auth/signout', authProvider.logout({
//   postLogoutRedirectUri: POST_LOGOUT_REDIRECT_URI
// }));










app.listen(process.env.PORT || 4400, () => {
  console.log(`Server is running on port: ${process.env.PORT}`);
});



 