const router = require('express').Router();
const Room = require('../models/Room');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  try {
    const { building, status, search } = req.query;
    let query = {};
    if (building) query.building = building;
    if (status) query.status = status;
    if (search) query.$or = [{ roomId: new RegExp(search, 'i') }, { building: new RegExp(search, 'i') }];
    const rooms = await Room.find(query).sort({ roomId: 1 });
    res.json(rooms);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const room = await Room.create(req.body);
    res.status(201).json(room);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(room);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Room.findByIdAndDelete(req.params.id);
    res.json({ message: 'Room deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/stats', protect, async (req, res) => {
  try {
    const total = await Room.countDocuments();
    const available = await Room.countDocuments({ status: 'Available' });
    const maintenance = await Room.countDocuments({ status: 'Maintenance' });
    const totalCapacity = await Room.aggregate([{ $group: { _id: null, total: { $sum: '$capacity' } } }]);
    res.json({ total, available, maintenance, totalCapacity: totalCapacity[0]?.total || 0 });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
