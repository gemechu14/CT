const User = require('../models/Users.js');
const { Op } = require('sequelize');
const msRestNodeAuth = require("@azure/ms-rest-nodeauth");
const axios = require("axios");

// const PowerBiCapacity = require('../models/powerBiCapacity');

async function checkUserActivity() {
    try {

        console.log("Hello there!")
        const inactiveThreshold = 1 * 60 * 1000; // 1 minute in milliseconds
        const cutoffTime = new Date(Date.now() - inactiveThreshold);

        // Find users who have not been active since cutoffTime and are logged in
        const inactiveUsers = await User.findAll({
            where: {
                isLoggedIn: true,
                last_active_at: { [Op.gte]: cutoffTime }
            }
        });

        if (inactiveUsers.length > 0) {
            console.log('There are active users.');
            // console.log(inactiveUsers.last_active_at)
            console.log(cutoffTime)
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
              const url = `https://management.azure.com/subscriptions/${process.env.SUBSCRIPTION_ID}/resourceGroups/${process.env.RESOURCEGROUPNAME}/providers/Microsoft.Fabric/capacities/${process.env.DEDICATEDCAPACITYNAME}?api-version=${process.env.APPVERSION}`;
              const statusUrl = `https://management.azure.com/subscriptions/${process.env.SUBSCRIPTION_ID}/resourceGroups/${process.env.RESOURCEGROUPNAME}/providers/Microsoft.Fabric/capacities/${process.env.DEDICATEDCAPACITYNAME}/suspend?api-version=${process.env.APPVERSION}`;
              //     const statusResponse = await axios.get(url, {
              //         headers: {
              //             Authorization: `Bearer ${token}`,
              //             'Content-Type': 'application/json'
              //         }
              //     });
              // return res.json(statusResponse.data)
          
              // const url = `https://management.azure.com/subscriptions/${subscriptionId}/resourceGroups/${resourceGroupName}/providers/Microsoft.PowerBIDedicated/capacities/${dedicatedCapacityName}/suspend?api-version=2022-07-01-preview`;
              // const url = `https://management.azure.com/subscriptions/${subscriptionId}/resourceGroups/${resourceGroupName}/providers/Microsoft.PowerBIDedicated/capacities/${capacityName}/suspend?api-version=2016-01-29`;
          
              // Make a POST request to suspend the capacity with the Authorization header
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
          
            //   return res.status(200).json({
            //     message: "Suspended successfully",
            //   });\
            console.log(response)
            console.log('Suspended successfully.');
        }

        // Update Power BI capacity based on user activity
        // await updatePowerBiCapacity(inactiveUsers.length === 0);
    } catch (err) {
        console.error('Error checking user activity:', err);
    }
}

async function updatePowerBiCapacity(activeUsersExist) {
    try {
        const powerBiCapacity = await PowerBiCapacity.findByPk(1);

        if (!powerBiCapacity) {
            throw new Error('Power BI capacity settings not found');
        }

        if (activeUsersExist && !powerBiCapacity.capacity_active) {
            // Start capacity if there are active users and it's not already active
            await powerBiCapacity.update({ capacity_active: true });
        } else if (!activeUsersExist && powerBiCapacity.capacity_active) {
            // Stop capacity if no active users and it's currently active
            await powerBiCapacity.update({ capacity_active: false });
        }
    } catch (err) {
        console.error('Error updating Power BI capacity:', err);
    }
}

module.exports = {
    checkUserActivity
};