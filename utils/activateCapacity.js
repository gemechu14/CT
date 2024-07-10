// activateCapacity.js
const msRestNodeAuth = require("@azure/ms-rest-nodeauth");
const axios = require('axios');
// const msRestNodeAuth = require('ms-rest-nodeauth');
const Capacity = require('../models/capacity');

const activateCapacityIfNeeded = async () => {
  try {
    // Check if 'superTenant' capacity is already activated
    let capacity = await Capacity.findOne({ where: { selectedCapacity: 'superTenant' } });

    // If capacity is not found, create it
    if (capacity === null) {
      await Capacity.create({
        selectedCapacity: "superTenant",
        embeddedTimeout: 100,
      });
    }

    // Fetch the capacity again to ensure it exists
    capacity = await Capacity.findOne({ where: { selectedCapacity: 'superTenant' } });

    // Get Azure credentials
    const creds = await msRestNodeAuth.loginWithServicePrincipalSecret(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      process.env.TENANT_ID,
      {
        tokenAudience: "https://management.azure.com/",
      }
    );

    // Obtain access token
    const token = creds?.tokenCache?._entries[0]?.accessToken;

    // Check capacity status
    const url = `https://management.azure.com/subscriptions/${process.env.SUBSCRIPTION_ID}/resourceGroups/${process.env.RESOURCEGROUPNAME}/providers/Microsoft.Fabric/capacities/${process.env.DEDICATEDCAPACITYNAME}?api-version=${process.env.APPVERSION}`;
    const statusResponse = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const capacityStatus = statusResponse?.data?.properties?.state;

    // If capacity status is not 'Active', resume it
    if (capacityStatus !== 'Active') {
      const resumeUrl = `https://management.azure.com/subscriptions/${process.env.SUBSCRIPTION_ID}/resourceGroups/${process.env.RESOURCEGROUPNAME}/providers/Microsoft.Fabric/capacities/${process.env.DEDICATEDCAPACITYNAME}/resume?api-version=${process.env.APPVERSION}`;

      await axios.post(
        resumeUrl,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
    }
  } catch (error) {
    console.error("Error activating capacity:", error);
    throw error; // Propagate the error to handle it elsewhere if needed
  }
};

module.exports = activateCapacityIfNeeded;
