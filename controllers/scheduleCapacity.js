const { Certificate } = require("crypto");
const Role = require("../models/role.js");
const Permission = require("../models/permission.js");
const RolePermission = require("../models/rolePermission.js");
const createError = require("../utils/errorResponse.js");
const { create } = require("domain");
const User = require("../models/Users.js");
const UserRole = require("../models/userRole.js");
const sequelize = require('../database/db');
const ScheduleCapacity = require("../models/scheduleCapacity.js");
const { initializeSchedules } = require('../scheduleCapacity.js');

const { setupScheduledTasks } = require('../scheduler.js'); 

//GET ALL SCHEDULE
exports.getAllSchedules = async (req, res, next) => {
    try {
      const schedules = await ScheduleCapacity.findAll();
  
      res.status(200).json(schedules);
    } catch (error) {
      console.error('Error fetching schedules:', error);
      return next(createError.createError(500, 'Internal server error.'));
    }
  };
  //GET SCHEDULE BY ID
exports.getScheduleById = async (req, res, next) => {
    try {
      const { id } = req.params;
  
      // Find the schedule by ID
      const scheduleCapacity = await ScheduleCapacity.findByPk(Number(id));
  
      if (!scheduleCapacity) {
        return next(createError.createError(404, 'Schedule not found.'));
      }
  
      res.status(200).json(scheduleCapacity);
    } catch (error) {
      console.error('Error fetching schedule:', error);
      return next(createError.createError(500, 'Internal server error.'));
    }
  };

//ADD SCHEDULE
exports.addSchedule = async (req, res,next) => {
    try {
      const { startHour, startMinute, period, durationHours, durationMinutes, isEnabled } = req.body;
  
      // Validate input
      if (!startHour || !startMinute || !period) {

        return next(createError.createError(400,'Start hour, start minute, and period are required.'))
      }
  
      // Create a new schedule
      const newSchedule = await ScheduleCapacity.create({
        startHour,
        startMinute,
        period,
        durationHours: durationHours || 0,
        durationMinutes: durationMinutes || 0,
        isEnabled: isEnabled || false,
      });
   // Setup scheduled tasks including the new schedule
    // Reload schedules after update
    await initializeSchedules();
  //  await setupScheduledTasks();

      res.status(201).json(newSchedule);
    } catch (error) {
      console.error('Error creating schedule:', error);
      return next(createError.createError(500,"Internal server error"))
    }
  };

//UPDATE SCHEDULE

exports.updateSchedule = async (req, res, next) => {
    try {
      const { startHour, startMinute, period, durationHours, durationMinutes, isEnabled } = req.body;
      const { id } = req.params;
      const updates = {};
      // Find the schedule by ID
      const scheduleCapacity = await ScheduleCapacity.findOne({
        where: { id: Number(id) }
      });
  
      if (!scheduleCapacity) {
        return next(createError.createError(404, 'Schedule not found'));
      }
  
      // Prepare the updates

      if (startHour ) {
        updates.startHour = startHour;
      }
      if (startMinute ) {
        updates.startMinute = startMinute;
      }
      if (period ) {
        updates.period = period;
      }
      if (durationHours) {
        updates.durationHours = durationHours;
      }
      if (durationMinutes ) {
        updates.durationMinutes = durationMinutes;
      }
      if (isEnabled ) {
        updates.isEnabled = isEnabled;
      }
  
      // Update the schedule
     const updatedSchedule=   await scheduleCapacity.update(updates);
      // Reload schedules after update
    await initializeSchedules();
      res.status(200).json({
        message: "Schedule updated successfully",
        data:updatedSchedule
      });
    } catch (error) {
      console.error('Error updating schedule:', error);
      return next(createError.createError(500, "Internal server error"));
    }
  };

//DELETE SCHEDULE

exports.deleteSchedule = async (req, res, next) => {
    try {
      const { id } = req.params;
  
      const scheduleCapacity = await ScheduleCapacity.findByPk(Number(id));
  
      if (!scheduleCapacity) {
        return next(createError.createError(404, 'Schedule not found.'));
      }
  
      // Delete the schedule
      await scheduleCapacity.destroy();
  
      res.status(200).json({ message: 'Schedule deleted successfully' });
    } catch (error) {
      console.error('Error deleting schedule:', error);
      return next(createError.createError(500, 'Internal server error.'));
    }
  };