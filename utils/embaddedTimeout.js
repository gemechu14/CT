// getEmbeddedTimeout.js
const Capacity = require("../models/capacity.js");

async function getEmbeddedTimeout() {
    const foundCapacity = await Capacity.findOne({
        where: { selectedCapacity: "superTenant" },
    });

    if (foundCapacity && foundCapacity.embeddedTimeout) {
        return parseInt(foundCapacity.embeddedTimeout, 10); // Return the value in minutes
    } else {
        return 5; // Default to 5 minutes if not set
    }
}

module.exports = {
    getEmbeddedTimeout,
};
