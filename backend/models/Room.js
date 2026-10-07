const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true },
  type: { type: String, enum: ['Lecture Hall', 'Computer Lab', 'Seminar Room', 'Laboratory', 'Auditorium', 'Studio'], required: true },
  capacity: { type: Number, required: true },
  building: { type: String, required: true },
  status: { type: String, enum: ['Available', 'Maintenance', 'Occupied'], default: 'Available' },
  equipment: [String],
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);
