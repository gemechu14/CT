const User = require("../models/Users.js");
const { Op } = require("sequelize");
const msRestNodeAuth = require("@azure/ms-rest-nodeauth");
const axios = require("axios");
const Capacity = require("../models/capacity.js");
const ScheduleCapacity = require("../models/scheduleCapacity.js");

async function checkUserActivity() {
  try {
    // No active users found, proceed with checking schedules

    // const currentHour = new Date().getHours();
    // const currentMinute = new Date().getMinutes();
    // const currentTimeInMinutes = currentHour * 60 + currentMinute;
    // const currentTime = `${currentHour}:${currentMinute}`;

    // // Fetch all enabled schedules from the database
    // const schedules = await ScheduleCapacity.findAll({
    //   where: { isEnabled: true },
    // });

    // const activeSchedule = schedules.find((schedule) => {
    //   const { startHour, startMinute, period, durationHours, durationMinutes } =
    //     schedule;

    //   let scheduleStartTime =
    //     parseInt(startHour, 10) * 60 + parseInt(startMinute, 10);
    //   if (period === "PM" && parseInt(startHour, 10) < 12) {
    //     scheduleStartTime += 12 * 60;
    //   } else if (period === "AM" && parseInt(startHour, 10) === 12) {
    //     scheduleStartTime -= 12 * 60;
    //   }

    //   const endTimeInMinutes =
    //     scheduleStartTime + durationHours * 60 + durationMinutes;

    //   return (
    //     currentTimeInMinutes >= scheduleStartTime &&
    //     currentTimeInMinutes < endTimeInMinutes
    //   );
    // });

    // if (activeSchedule) {
    //   console.log(
    //     `Current time (${currentTime}) is within schedule ${activeSchedule.id}.`
    //   );
    //   console.log(
    //     `Scheduled start time: ${activeSchedule.startHour}:${activeSchedule.startMinute} ${activeSchedule.period}`
    //   );
    //   // Perform actions based on the active schedule
    // } else {
    //   console.log(
    //     `Current time (${currentTime}) is not within any active schedule.`
    //   );
    // }

    const inactiveThreshold = 10 * 60 * 1000; // 100 minutes in milliseconds
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
        console.log("Capacity is already suspended");
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

        if (response.status === 200 || response.status === 201 || response.status === 202) {
          await foundCapacity.update({ isActive: false });
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
