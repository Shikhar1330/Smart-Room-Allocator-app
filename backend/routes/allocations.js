const router = require('express').Router();
const Allocation = require('../models/Allocation');
const Room = require('../models/Room');
const Course = require('../models/Course');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  try {
    const allocations = await Allocation.find().populate('course').populate('room').sort({ day: 1, startTime: 1 });
    res.json(allocations);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { course, room, day, startTime, endTime } = req.body;
    // Check conflicts
    const conflict = await Allocation.findOne({ room, day, status: { $ne: 'Conflict' }, $or: [{ startTime: { $lt: endTime }, endTime: { $gt: startTime } }] });
    const status = conflict ? 'Conflict' : 'Confirmed';
    const allocation = await Allocation.create({ course, room, day, startTime, endTime, status, allocatedBy: 'Manual' });
    res.status(201).json(await allocation.populate(['course', 'room']));
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// Auto-allocate endpoint
router.post('/auto', protect, adminOnly, async (req, res) => {
  try {
    const { courseIds, preferredDays, timeWindow, roomType } = req.body;
    const courses = courseIds ? await Course.find({ _id: { $in: courseIds } }) : await Course.find();
    const rooms = await Room.find({ status: 'Available', ...(roomType ? { type: roomType } : {}) });
    const days = preferredDays?.length ? preferredDays : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const slots = ['08:00', '10:00', '12:00', '14:00', '16:00'];
    const results = [];

    for (const course of courses) {
      const eligibleRooms = rooms.filter(r => r.capacity >= course.studentCount);
      if (!eligibleRooms.length) continue;
      let allocated = false;
      for (const day of days) {
        if (allocated) break;
        for (const slot of slots) {
          if (allocated) break;
          const endSlot = `${String(parseInt(slot) + 2).padStart(2, '0')}:00`;
          for (const room of eligibleRooms) {
            const conflict = await Allocation.findOne({ room: room._id, day, $or: [{ startTime: { $lt: endSlot }, endTime: { $gt: slot } }] });
            if (!conflict) {
              const alloc = await Allocation.create({ course: course._id, room: room._id, day, startTime: slot, endTime: endSlot, status: 'Confirmed', allocatedBy: 'Auto' });
              results.push(await alloc.populate(['course', 'room']));
              allocated = true;
              break;
            }
          }
        }
      }
    }
    res.json({ allocated: results.length, allocations: results });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Allocation.findByIdAndDelete(req.params.id);
    res.json({ message: 'Allocation removed' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/conflicts', protect, async (req, res) => {
  try {
    const conflicts = await Allocation.find({ status: 'Conflict' }).populate('course').populate('room');
    res.json(conflicts);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.patch('/:id/resolve', protect, adminOnly, async (req, res) => {
  try {
    const allocation = await Allocation.findByIdAndUpdate(req.params.id, { status: 'Confirmed' }, { new: true }).populate('course').populate('room');
    res.json(allocation);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
