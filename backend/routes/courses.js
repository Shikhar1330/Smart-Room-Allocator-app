const router = require('express').Router();
const Course = require('../models/Course');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  try {
    const { search, faculty, semester } = req.query;
    let query = {};
    if (faculty) query.faculty = faculty;
    if (semester) query.semester = semester;
    if (search) query.$or = [{ courseName: new RegExp(search, 'i') }, { courseCode: new RegExp(search, 'i') }];
    const courses = await Course.find(query).sort({ courseCode: 1 });
    res.json(courses);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json(course);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(course);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: 'Course deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
