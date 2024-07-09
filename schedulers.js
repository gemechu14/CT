// scheduler.js
const cron = require('node-cron');
const ScheduleCapacity = require('./models/scheduleCapacity.js');

async function startSchedules() {
  // Fetch all schedules from the database
  const schedules = await ScheduleCapacity.findAll({
    where: { isEnabled: true }
  });
//   return  res.json(schedules)
  schedules.forEach(schedule => {
    const { startHour, startMinute, period, durationHours, durationMinutes } = schedule;

    // Convert startHour and startMinute to 24-hour format
    let hour = parseInt(startHour, 10);
    const minute = parseInt(startMinute, 10);

    if (period === 'PM' && hour < 12) {
      hour += 12;
    } else if (period === 'AM' && hour === 12) {
      hour = 0; // Midnight case
    }

    // Schedule the task using node-cron
    cron.schedule(`${minute} ${hour} * * *`, () => {
      console.log(`Task started at ${startHour}:${startMinute} ${period}`);

      // Calculate the duration in milliseconds
      const duration = (durationHours * 60 * 60 * 1000) + (durationMinutes * 60 * 1000);
      console.log(duration)
    //   Perform your scheduled task here
      setTimeout(() => {
        console.log('Task ended after specified duration');
      }, duration);
    });
  });
}

module.exports = startSchedules;
