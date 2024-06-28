const jwt = require('jsonwebtoken');

const signToken = (id, email, roleId, tenant, defaultTenant, currentTenant, isSuperTenant) => {
  try {
    const token = jwt.sign(
      { id, email, roleId, tenant, defaultTenant, currentTenant, isSuperTenant },
      "your_jwt_secret", // Replace with your JWT secret
      { expiresIn: "7d" }
    );

    const refreshToken = jwt.sign(
      { id, email, roleId, tenant, defaultTenant, currentTenant, isSuperTenant },
      "your_refresh_jwt_secret", // Replace with your refresh JWT secret
      { expiresIn: "90d" }
    );

    return { token, refreshToken };
  } catch (err) {
    throw err;
  }
};
module.exports = {
    signToken,
    // createSendToken,
  };