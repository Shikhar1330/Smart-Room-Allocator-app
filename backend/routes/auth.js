const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET || 'smartalloc_secret_2024', { expiresIn: '7d' });

router.post('/login', async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const user = await User.findOne({ username, role });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid credentials' });
    res.json({ token: generateToken(user._id), user: { id: user._id, fullName: user.fullName, username: user.username, role: user.role, department: user.department } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { fullName, username, password, role, department } = req.body;
    const exists = await User.findOne({ username });
    if (exists) return res.status(400).json({ message: 'Username already taken' });
    const user = await User.create({ fullName, username, password, role, department });
    res.status(201).json({ token: generateToken(user._id), user: { id: user._id, fullName: user.fullName, username: user.username, role: user.role, department: user.department } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
