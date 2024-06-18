const User = require('../models/Users.js');
// const PowerBiCapacity = require('../models/powerBiCapacity');

async function checkUserActivity() {
    try {

        console.log("Hello there!")
        // const inactiveThreshold = 15 * 60 * 1000; // 15 minutes in milliseconds
        // const cutoffTime = new Date(Date.now() - inactiveThreshold);

        // // Find users who have not been active since cutoffTime
        // const inactiveUsers = await User.findAll({
        //     where: {
        //         last_active_at: { [Op.lt]: cutoffTime }
        //     }
        // });

        // // Update Power BI capacity based on user activity
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