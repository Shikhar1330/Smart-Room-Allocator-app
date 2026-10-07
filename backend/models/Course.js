const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  courseName: { type: String, required: true },
  courseCode: { type: String, required: true, unique: true },
  faculty: { type: String, required: true },
  department: { type: String, required: true },
  semester: { type: String, required: true },
  duration: { type: Number, required: true }, // hours/week
  studentCount: { type: Number, default: 30 },
  prerequisite: { type: String, default: 'None' },
  roomType: { type: String, enum: ['Lecture Hall', 'Computer Lab', 'Seminar Room', 'Laboratory', 'Auditorium', 'Studio'], default: 'Lecture Hall' },
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
