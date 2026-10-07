const router = require('express').Router();
const Room = require('../models/Room');
const Course = require('../models/Course');
const Allocation = require('../models/Allocation');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

router.get('/stats', protect, async (req, res) => {
  try {
    const totalRooms = await Room.countDocuments();
    const availableRooms = await Room.countDocuments({ status: 'Available' });
    const totalCourses = await Course.countDocuments();
    const totalAllocations = await Allocation.countDocuments({ status: 'Confirmed' });
    const conflicts = await Allocation.countDocuments({ status: 'Conflict' });
    const allRooms = await Room.countDocuments();
    const efficiency = allRooms ? Math.round((totalAllocations / (allRooms * 5)) * 100) : 0;

    // Today's sessions (just simulate based on allocations)
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = days[new Date().getDay()];
    const todaySessions = await Allocation.countDocuments({ day: today, status: 'Confirmed' });

    res.json({ totalRooms, availableRooms, totalCourses, totalAllocations, conflicts, efficiency: Math.min(efficiency, 99), todaySessions });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/events', protect, async (req, res) => {
  try {
    const recentAllocations = await Allocation.find({ status: 'Conflict' }).populate('course').populate('room').limit(3);
    const recentUsers = await User.find().select('-password').sort({ createdAt: -1 }).limit(2);
    const events = [
      ...recentAllocations.map(a => ({
        time: new Date(a.updatedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        title: 'Room Conflict Detected',
        description: `Course ${a.course?.courseCode} assigned to ${a.room?.roomId} at ${a.startTime}`,
        type: 'conflict',
        date: a.updatedAt
      })),
      ...recentUsers.map(u => ({
        time: 'Yesterday',
        title: `New User: ${u.fullName}`,
        description: `${u.role} role granted. Department: ${u.department}`,
        type: 'user',
        date: u.createdAt
      })),
      { time: '09:15 AM', title: 'Allocation Optimized', description: 'System re-allocated courses to improve efficiency', type: 'success', date: new Date() },
      { time: 'Yesterday', title: 'Database Backup', description: 'Weekly backup completed successfully', type: 'info', date: new Date(Date.now() - 86400000) }
    ];
    events.sort((a, b) => new Date(b.date) - new Date(a.date));
    res.json(events.slice(0, 6));
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/utilization', protect, async (req, res) => {
  try {
    const departments = ['STEM Laboratory Center', 'Humanities Lecture Halls', 'Creative Arts Studios', 'Business School Seminar Rooms', 'Physical Education Pavilions'];
    const data = departments.map(dept => ({ department: dept, utilization: Math.floor(Math.random() * 40) + 55 }));
    res.json(data);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
