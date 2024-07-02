// schedule.js

const schedule = require('node-schedule');
const moment = require('moment-timezone');
moment.tz.setDefault('Africa/Nairobi');
const  ScheduleCapacity = require('./models/scheduleCapacity.js'); // Adjust path as per your project structure

// Function to setup scheduled tasks
async function setupScheduledTasks() {
  try {
    const enabledSchedules = await ScheduleCapacity.findAll({
      where: {
        isEnabled: true
      }
    });

    enabledSchedules.forEach(scheduleInstance => {
      scheduleTask(scheduleInstance);
    });

  } catch (error) {
    console.error('Error setting up scheduled tasks:', error);
  }
}

// Function to schedule a task
function scheduleTask(scheduleInstance) {

  const { startHour, startMinute, period, durationHours, durationMinutes } = scheduleInstance;
  let hour = parseInt(startHour);
  if (period === 'PM' && hour !== 12) {
    hour += 12;
  } else if (period === 'AM' && hour === 12) {
    hour = 0;
  }

  const scheduledTime = moment().tz('Africa/Nairobi')
  .hour(hour)
  .minute(parseInt(startMinute))
  .second(0);

  // Log detailed information for debugging
  console.log('Scheduled time:', scheduledTime.format('YYYY-MM-DD HH:mm:ss'));
  console.log('Current time:',moment().tz('Africa/Nairobi').format('YYYY-MM-DD hh:mm:ss a'));
  console.log('Is scheduled time after current momen    t?', scheduledTime.isAfter(moment().tz('Africa/Nairobi')));
  // Schedule job only if scheduled time is in the future
  if (scheduledTime.isAfter(moment())) {
    schedule.scheduleJob(scheduleInstance.id.toString(), scheduledTime.toDate(), () => {
      executeScheduledTask(scheduleInstance);
    });
  }
}

// Function to execute when schedule time is reached
async function executeScheduledTask(scheduleInstance) {
  const { startHour, startMinute, period, durationHours, durationMinutes } = scheduleInstance;

  console.log(`Scheduled task started at ${startHour}:${startMinute} ${period}`);

  try {
    // Calculate scheduled start time in Nairobi timezone
    const scheduledTime = moment().tz('Africa/Nairobi')
      .hour(parseInt(startHour))
      .minute(parseInt(startMinute))
      .second(0);

    // Wait until scheduled time is reached
    await waitUntil(scheduledTime);

    console.log('Task started.');

    // Perform action for duration
    await performTaskForDuration(durationHours, durationMinutes);

    console.log('Task ended.');

    // Example: Update schedule status or next execution time
    scheduleInstance.lastExecutionTime = new Date();
    await scheduleInstance.save();
  } catch (error) {
    console.error('Error executing scheduled task:', error);
  }
}

// Function to wait until a specific time
async function waitUntil(targetTime) {
  const now = moment().tz('Africa/Nairobi');
  if (now.isBefore(targetTime)) {
    const delay = targetTime.diff(now);
    await new Promise(resolve => setTimeout(resolve, delay));
  }
}

// Function to perform task for a specified duration
async function performTaskForDuration(hours, minutes) {
  const duration = moment.duration({ hours, minutes }).asMilliseconds();
  const endTime = moment().tz('Africa/Nairobi').add(hours, 'hours').add(minutes, 'minutes');

  while (moment().tz('Africa/Nairobi').isBefore(endTime)) {
    console.log('Performing scheduled action...');
    await wait(0, 1); // Wait for 1 minute before next action (adjust as needed)
  }
}

// Function to wait for a duration
async function wait(hours, minutes) {
  const duration = moment.duration({ hours, minutes }).asMilliseconds();
  return new Promise(resolve => setTimeout(resolve, duration));
}

module.exports = {
  setupScheduledTasks
};





// const cron = require('node-cron');
// const ScheduleCapacity = require('./models/scheduleCapacity'); 


// const performScheduledTask = async (schedule) => {
  
//   console.log(`Scheduled task running for schedule ID ${schedule.id}. Start time: ${new Date().toISOString()}`);
  
// };

// const startScheduler = () => {
//   cron.schedule('* * * * *', async () => {
//     try {
//       const schedules = await ScheduleCapacity.findAll({ where: { isEnabled: true } });

//       schedules.forEach(schedule => {
//         const cronExpression = `${schedule.startMinute} ${schedule.startHour} * * *`;

//         cron.schedule(cronExpression, async () => {
//           await performScheduledTask(schedule);
//         });
//       });

//     } catch (error) {
//       console.error('Error fetching schedules:', error);
//     }
//   });
// };

// // Start the scheduler
// startScheduler();

// module.exports = startScheduler;
