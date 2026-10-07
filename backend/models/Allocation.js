const mongoose = require('mongoose');

const allocationSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  status: { type: String, enum: ['Confirmed', 'Conflict', 'Pending'], default: 'Confirmed' },
  allocatedBy: { type: String, default: 'Auto' },
}, { timestamps: true });

module.exports = mongoose.model('Allocation', allocationSchema);
