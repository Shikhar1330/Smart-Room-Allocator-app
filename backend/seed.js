const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Room = require('./models/Room');
const Course = require('./models/Course');
const Allocation = require('./models/Allocation');

const seedData = async () => {
  try {
    await User.deleteMany({});
    await Room.deleteMany({});
    await Course.deleteMany({});
    await Allocation.deleteMany({});
    console.log('🧹 Cleared old data, seeding fresh...');

    // Hash passwords manually so we don't rely on the pre-save hook
    const hash = (pw) => bcrypt.hash(pw, 10);

    await User.insertMany([
      { fullName: 'Dr. Elena Fisher',   username: 'admin_demo',            password: await hash('smart_alloc_2024'), role: 'Administrator', department: 'Academic Registry',    status: 'Active' },
      { fullName: 'Dr. Sarah Jenkins',  username: 'faculty_demo',           password: await hash('faculty_2024'),    role: 'Faculty',        department: 'Computer Science',     status: 'Active' },
      { fullName: 'Sarah Mitchell',     username: 's.mitchell.sys',         password: await hash('pass123'),         role: 'Administrator', department: 'Academic Registry',    status: 'Active' },
      { fullName: 'Dr. Robert Khol',    username: 'r.khol@university.edu',  password: await hash('pass123'),         role: 'Faculty',        department: 'Physics & Astronomy',  status: 'Active' },
      { fullName: 'Alex Longman',       username: 'alongman_2024',          password: await hash('pass123'),         role: 'Student',        department: 'Computer Science',     status: 'Pending' },
      { fullName: 'Elena Costa',        username: 'e.costa.fac',            password: await hash('pass123'),         role: 'Faculty',        department: 'Digital Arts',         status: 'Suspended' },
    ]);
    console.log('✅ Users seeded');

    const rooms = await Room.insertMany([
      { roomId: 'ENG-101',   type: 'Lecture Hall', capacity: 120, building: 'Engineering Block', status: 'Available' },
      { roomId: 'LAB-402',   type: 'Computer Lab', capacity: 45,  building: 'Innovation Hub',   status: 'Maintenance' },
      { roomId: 'AUD-01',    type: 'Auditorium',   capacity: 450, building: 'Main Hall',         status: 'Available' },
      { roomId: 'SEM-B2',    type: 'Seminar Room', capacity: 25,  building: 'North Wing',        status: 'Available' },
      { roomId: 'CS-301',    type: 'Computer Lab', capacity: 40,  building: 'Tech Center',       status: 'Available' },
      { roomId: 'HALL-B1',   type: 'Lecture Hall', capacity: 80,  building: 'South Block',       status: 'Available' },
      { roomId: 'LAB-101',   type: 'Laboratory',   capacity: 30,  building: 'Science Block',     status: 'Available' },
      { roomId: 'SEM-A1',    type: 'Seminar Room', capacity: 20,  building: 'North Wing',        status: 'Available' },
      { roomId: 'WING-A302', type: 'Lecture Hall', capacity: 50,  building: 'Wing A',            status: 'Available' },
      { roomId: 'BOARD-101', type: 'Seminar Room', capacity: 12,  building: 'Admin Block',       status: 'Available' },
    ]);
    console.log('✅ Rooms seeded');

    const courses = await Course.insertMany([
      { courseName: 'Intro to Algorithmic Design', courseCode: 'CS-101',   faculty: 'Computing',        department: 'Software Eng.',    semester: 'A-24', duration: 4, studentCount: 45, prerequisite: 'None',    roomType: 'Lecture Hall' },
      { courseName: 'Statistical Inference',       courseCode: 'MTH-302',  faculty: 'Natural Sciences', department: 'Mathematics',      semester: 'S-25', duration: 3, studentCount: 30, prerequisite: 'MTH-101', roomType: 'Lecture Hall' },
      { courseName: 'Urban Planning Principles',   courseCode: 'ARCH-210', faculty: 'Architecture',     department: 'Urban Design',     semester: 'A-24', duration: 6, studentCount: 25, prerequisite: 'None',    roomType: 'Lecture Hall' },
      { courseName: 'Advanced Thermodynamics',     courseCode: 'ENG-402',  faculty: 'Engineering',      department: 'Mechanical',       semester: 'S-25', duration: 4, studentCount: 35, prerequisite: 'ENG-201', roomType: 'Lecture Hall' },
      { courseName: 'Advanced AI Ethics',          courseCode: 'CS-402',   faculty: 'Computing',        department: 'Computer Science', semester: 'A-24', duration: 3, studentCount: 45, prerequisite: 'CS-301',  roomType: 'Lecture Hall' },
      { courseName: 'Machine Learning Lab',        courseCode: 'CS-301',   faculty: 'Computing',        department: 'Computer Science', semester: 'A-24', duration: 3, studentCount: 28, prerequisite: 'CS-201',  roomType: 'Computer Lab' },
      { courseName: 'Neural Networks',             courseCode: 'CS-405',   faculty: 'Computing',        department: 'Computer Science', semester: 'A-24', duration: 2, studentCount: 20, prerequisite: 'CS-301',  roomType: 'Seminar Room' },
      { courseName: 'Data Structures',             courseCode: 'CS-201',   faculty: 'Computing',        department: 'Software Eng.',    semester: 'A-24', duration: 4, studentCount: 60, prerequisite: 'CS-101',  roomType: 'Lecture Hall' },
    ]);
    console.log('✅ Courses seeded');

    const avail = rooms.filter(r => r.status === 'Available');
    await Allocation.insertMany([
      { course: courses[0]._id, room: avail[0]._id, day: 'Monday',    startTime: '10:00', endTime: '12:00', status: 'Confirmed', allocatedBy: 'Auto' },
      { course: courses[1]._id, room: avail[1]._id, day: 'Tuesday',   startTime: '14:00', endTime: '16:00', status: 'Confirmed', allocatedBy: 'Auto' },
      { course: courses[4]._id, room: avail[6]._id, day: 'Monday',    startTime: '10:00', endTime: '11:30', status: 'Confirmed', allocatedBy: 'Manual' },
      { course: courses[5]._id, room: avail[2]._id, day: 'Monday',    startTime: '12:00', endTime: '13:30', status: 'Confirmed', allocatedBy: 'Auto' },
      { course: courses[6]._id, room: avail[0]._id, day: 'Monday',    startTime: '14:00', endTime: '15:30', status: 'Conflict',  allocatedBy: 'Auto' },
      { course: courses[7]._id, room: avail[7]._id, day: 'Monday',    startTime: '16:00', endTime: '17:30', status: 'Confirmed', allocatedBy: 'Manual' },
      { course: courses[2]._id, room: avail[3]._id, day: 'Wednesday', startTime: '09:00', endTime: '11:00', status: 'Confirmed', allocatedBy: 'Auto' },
      { course: courses[3]._id, room: avail[4]._id, day: 'Thursday',  startTime: '10:00', endTime: '12:00', status: 'Confirmed', allocatedBy: 'Auto' },
    ]);
    console.log('✅ Allocations seeded');
    console.log('🎉 Done! Login: admin_demo / smart_alloc_2024');

  } catch (err) {
    console.error('❌ Seed error:', err.message);
  }
};

module.exports = { seedData };