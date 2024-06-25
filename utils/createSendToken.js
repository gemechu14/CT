// const User = require('../models/User'); // Import your User model

const User = require("../models/Users");
const signToken= require("./signToken.js")

const createSendToken = async (user, statusCode, res) => {
  try {
    // Generate tokens
    const { token, refreshToken } = signToken(
      user.id,
      user.email,
      user.roleId,
      user.tenant,
      user.defaultTenant,
      user.currentTenant,
      user.isSuperTenant
    );

    // Update user's currentTenant and isLoggedIn status
    await User.update(
      { currentTenant: user.defaultTenant, isLoggedIn: true },
      { where: { id: user.id } }
    );

    // Set cookie options
    const cookieOptions = {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days in milliseconds
      secure: process.env.NODE_ENV === "production" ? true : false,
      httpOnly: true,
    };

    // Send JWT token in a cookie
    res.cookie("jwt", token, cookieOptions);

    // Respond with tokens
    res.status(statusCode).json({
      token,
      refreshToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
module.exports = {
    // signToken,
    createSendToken,
  };