const router = require('express').Router();
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const { search, role, status } = req.query;
    let query = {};
    if (role) query.role = role;
    if (status) query.status = status;
    if (search) query.$or = [{ fullName: new RegExp(search, 'i') }, { username: new RegExp(search, 'i') }];
    const users = await User.find(query).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { fullName, username, password, role, department } = req.body;
    const exists = await User.findOne({ username });
    if (exists) return res.status(400).json({ message: 'Username already exists' });
    const user = await User.create({ fullName, username, password, role, department });
    res.status(201).json({ ...user.toObject(), password: undefined });
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.patch('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true }).select('-password');
    res.json(user);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const admins = await User.countDocuments({ role: 'Administrator' });
    const faculty = await User.countDocuments({ role: 'Faculty' });
    const students = await User.countDocuments({ role: 'Student' });
    res.json({ admins, faculty, students });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
