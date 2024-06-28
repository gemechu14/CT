const User = require("../models/Users.js");
const { Op } = require("sequelize");
const msRestNodeAuth = require("@azure/ms-rest-nodeauth");
const axios = require("axios");
const Capacity = require("../models/capacity.js");
const express =require("express")

// const PowerBiCapacity = require('../models/powerBiCapacity');

async function checkUserActivity() {
  try {
    console.log("Hello there!");
    const inactiveThreshold = 100 * 60 * 1000; // 1 minute in milliseconds
    const cutoffTime = new Date(Date.now() - inactiveThreshold);

    // Find users who have not been active since cutoffTime and are logged in
    const inactiveUsers = await User.findAll({
      where: {
        isLoggedIn: true,
        last_active_at: { [Op.gte]: cutoffTime },
      },
    });

    if (inactiveUsers.length > 0) {
      console.log("There are active users.");
      // console.log(inactiveUsers.last_active_at)
      console.log(cutoffTime);
    } else {
      const checkCapacity = await Capacity.findOne({
        where: { selectedCapacity: "superTenant" },
      });

      if (checkCapacity === null) {
        await Capacity.create({
          selectedCapacity: "superTenant",
          embeddedTimeout: 100,
        });
      }

      const foundCapacity = await Capacity.findOne({
        where: { selectedCapacity: "superTenant" },
      });

      if (!foundCapacity.isActive) {
        console.log("Capacity is already suspended")
        // next();
      } else {
        const creds = await msRestNodeAuth.loginWithServicePrincipalSecret(
          process.env.CLIENT_ID,
          process.env.CLIENT_SECRET,
          process.env.TENANT_ID,
          {
            tokenAudience: "https://management.azure.com/",
          }
        );

        const token = creds?.tokenCache?._entries[0]?.accessToken;
        const statusUrl = `https://management.azure.com/subscriptions/${process.env.SUBSCRIPTION_ID}/resourceGroups/${process.env.RESOURCEGROUPNAME}/providers/Microsoft.Fabric/capacities/${process.env.DEDICATEDCAPACITYNAME}/suspend?api-version=${process.env.APPVERSION}`;

        const response = await axios.post(
          statusUrl,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if(response.status === 200 || response.status === 201 || response.status === 202){
            await foundCapacity.update({isActive:false})
          }
      

        
        console.log(response.status);
        console.log("Suspended successfully.");
      }
    }

   
  } catch (err) {
    console.error("Error checking user activity:", err);
  }
}



module.exports = {
  checkUserActivity,
};
