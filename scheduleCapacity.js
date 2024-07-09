// const ScheduleCapacity = require("./models/scheduleCapacity");
// const cron = require('node-cron');



// async function initializeSchedules() {
//   try {
//     // Fetch all schedules from the database
//     const schedules = await ScheduleCapacity.findAll({
//       where: { isEnabled: true }
//     });

//     // Log schedules for verification
//     // console.log('Initialized schedules:', schedules);

//     schedules.forEach(schedule => {
//       const { startHour, startMinute, period, durationHours, durationMinutes } = schedule;

//       // Convert startHour and startMinute to 24-hour format
//       let hour = parseInt(startHour, 10);
//       let minute = parseInt(startMinute, 10);

//       if (period === 'PM' && hour < 12) {
//         hour += 12;
//       } else if (period === 'AM' && hour === 12) {
//         hour = 0; // Midnight case
//       }
//       const now = new Date();
//       console.log(`Current time: ${now.toISOString()}`);
//       console.log(`Scheduled task time: ${hour}:${minute} ${period === 'AM' ? 'AM' : 'PM'}`);
//       // Create cron expression
//       const cronExpression = `${minute} ${hour} * * *`;

//       // Schedule the task using node-cron
//       cron.schedule(cronExpression, () => {
//         console.log(`Task started at ${startHour}:${startMinute} ${period}`);

//         // Calculate the duration in milliseconds
//         const duration = (durationHours * 60 * 60 * 1000) + (durationMinutes * 60 * 1000);
//         console.log(`Task duration: ${duration} ms`);
//   ////###################################################///
//   ////###################################################///




//         // Perform your scheduled task here
//         setTimeout(() => {
//           const endTaskTime = new Date();
//           console.log(`Task ended after specified duration (Actual end time: ${endTaskTime.toISOString()})`);
//         }, duration);
//       });

//       console.log(`Scheduled task with cron expression: ${cronExpression}`);
//     });

//   } catch (error) {
//     console.error('Error initializing schedules:', error);
//   }
// }

// module.exports = {
//   initializeSchedules,
// };

const cron = require('node-cron');
const axios = require('axios');
const msRestNodeAuth = require('@azure/ms-rest-nodeauth');
const ScheduleCapacity = require('./models/scheduleCapacity.js');
const Capacity = require('./models/capacity');

async function initializeSchedules() {
  try {
    const schedules = await ScheduleCapacity.findAll({
      where: { isEnabled: true }
    });

    schedules.forEach(schedule => {
      const { startHour, startMinute, period, durationHours, durationMinutes } = schedule;

      let hour = parseInt(startHour, 10);
      let minute = parseInt(startMinute, 10);

      if (period === 'PM' && hour < 12) {
        hour += 12;
      } else if (period === 'AM' && hour === 12) {
        hour = 0;
      }

      const cronExpression = `${minute} ${hour} * * *`;
      cron.schedule(cronExpression, async () => {
        const startTaskTime = new Date();
        console.log(`Task started at ${startHour}:${startMinute} ${period} (Actual start time: ${startTaskTime.toISOString()})`);

        try {
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
    
          const creds = await msRestNodeAuth.loginWithServicePrincipalSecret(
            process.env.CLIENT_ID,
            process.env.CLIENT_SECRET,
            process.env.TENANT_ID,
            {
              tokenAudience: "https://management.azure.com/",
            }
          );

          const token = creds?.tokenCache?._entries[0]?.accessToken;
          const statusUrl = `https://management.azure.com/subscriptions/${process.env.SUBSCRIPTION_ID}/resourceGroups/${process.env.RESOURCEGROUPNAME}/providers/Microsoft.Fabric/capacities/${process.env.DEDICATEDCAPACITYNAME}/resume?api-version=${process.env.APPVERSION}`;

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
            await foundCapacity.update({ isActive: true });
          }

          console.log(`Task completed with status: ${response.status}`);

          const duration = (durationHours * 60 * 60 * 1000) + (durationMinutes * 60 * 1000);
          console.log(`Task duration: ${duration} ms`);
          setTimeout(async () => {
            const endTaskTime = new Date();
            console.log(`Task ended after specified duration (Actual end time: ${endTaskTime.toISOString()})`);

            try {
              // Stopping the capacity
              const creds = await msRestNodeAuth.loginWithServicePrincipalSecret(
                process.env.CLIENT_ID,
                process.env.CLIENT_SECRET,
                process.env.TENANT_ID,
                {
                  tokenAudience: "https://management.azure.com/",
                }
              );

              const token = creds?.tokenCache?._entries[0]?.accessToken;
              const suspendUrl = `https://management.azure.com/subscriptions/${process.env.SUBSCRIPTION_ID}/resourceGroups/${process.env.RESOURCEGROUPNAME}/providers/Microsoft.Fabric/capacities/${process.env.DEDICATEDCAPACITYNAME}/suspend?api-version=${process.env.APPVERSION}`;

              const response = await axios.post(
                suspendUrl,
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

              console.log(`Task completed with status: ${response.status}`);
            } catch (error) {
              console.error('Error during scheduled task execution (suspend):', error);
            }
          }, duration);
        } catch (error) {
          console.error('Error during scheduled task execution (resume):', error);
        }
      });

      console.log(`Scheduled task with cron expression: ${cronExpression}`);
    });

    //       setTimeout(() => {
    //         const endTaskTime = new Date();
    //         console.log(`Task ended after specified duration (Actual end time: ${endTaskTime.toISOString()})`);
    //       }, duration);
    //     } catch (error) {
    //       console.error('Error during scheduled task execution:', error);
    //     }
    //   });

    //   console.log(`Scheduled task with cron expression: ${cronExpression}`);
    // });
  } catch (error) {
    console.error('Error initializing schedules:', error);
  }
}

module.exports = {
  initializeSchedules,
};


