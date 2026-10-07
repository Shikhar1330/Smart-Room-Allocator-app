import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { coursesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Plus, SlidersHorizontal, Download, Trash2, Pencil } from 'lucide-react';

const FACULTIES = ['Computing', 'Natural Sciences', 'Architecture', 'Engineering', 'Business', 'Arts & Humanities'];
const SEMESTERS = ['A-24', 'S-25', 'A-25', 'S-26'];
const ROOM_TYPES = ['Lecture Hall', 'Computer Lab', 'Seminar Room', 'Laboratory', 'Auditorium', 'Studio'];

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ courseName: '', courseCode: '', faculty: 'Computing', department: '', semester: 'A-24', duration: '', studentCount: '', roomType: 'Lecture Hall' });
  const [msg, setMsg] = useState('');
  const { user } = useAuth();
  const isAdmin = user?.role === 'Administrator';

  const load = async () => {
    setLoading(true);
    const { data } = await coursesAPI.getAll();
    setCourses(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await coursesAPI.create({ ...form, duration: Number(form.duration), studentCount: Number(form.studentCount) });
      setMsg('Course added to ledger');
      setForm({ courseName: '', courseCode: '', faculty: 'Computing', department: '', semester: 'A-24', duration: '', studentCount: '', roomType: 'Lecture Hall' });
      load();
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error adding course');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this course?')) return;
    await coursesAPI.delete(id);
    load();
  };

  const semColor = { 'A-24': 'bg-blue-100 text-blue-700', 'S-25': 'bg-red-100 text-red-700', 'A-25': 'bg-blue-100 text-blue-700', 'S-26': 'bg-red-100 text-red-700' };

  return (
    <Layout>
      <div className="animate-slide-up">
        <div className="flex items-center gap-6 mb-6 border-b border-gray-200 pb-0">
          <h1 className="text-xl font-bold text-gray-900 pb-4">Course Management</h1>
          <div className="flex gap-4 ml-2 pb-0">
            {['Catalogue', 'Prerequisites'].map((t, i) => (
              <button key={t} className={`text-sm pb-4 border-b-2 ${i === 0 ? 'border-gray-900 text-gray-900 font-semibold' : 'border-transparent text-gray-400 hover:text-gray-700'}`}>{t}</button>
            ))}
          </div>
        </div>

        {/* Add Course Form */}
        {isAdmin && (
          <div className="card p-6 mb-6">
            <h2 className="font-bold text-gray-900 mb-0.5">Register New Course</h2>
            <p className="text-xs text-gray-400 mb-4">Populate the ledger with new academic modules.</p>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="label">Course Name</label>
                  <input value={form.courseName} onChange={e => setForm(f => ({ ...f, courseName: e.target.value }))} className="input" placeholder="e.g. Advanced Thermodynamics" required />
                </div>
                <div>
                  <label className="label">Course Code</label>
                  <input value={form.courseCode} onChange={e => setForm(f => ({ ...f, courseCode: e.target.value.toUpperCase() }))} className="input" placeholder="ENG-402" required />
                </div>
                <div>
                  <label className="label">Faculty</label>
                  <select value={form.faculty} onChange={e => setForm(f => ({ ...f, faculty: e.target.value }))} className="select-input w-full">
                    {FACULTIES.map(f => <option key={f}>{f}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Duration (Hours/Week)</label>
                  <input type="number" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} className="input" placeholder="4" required />
                </div>
                <div>
                  <label className="label">Department</label>
                  <input value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))} className="input" placeholder="Mechanical Engineering" required />
                </div>
                <div>
                  <label className="label">Semester</label>
                  <select value={form.semester} onChange={e => setForm(f => ({ ...f, semester: e.target.value }))} className="select-input w-full">
                    {SEMESTERS.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Student Count</label>
                  <input type="number" value={form.studentCount} onChange={e => setForm(f => ({ ...f, studentCount: e.target.value }))} className="input" placeholder="30" />
                </div>
                <div>
                  <label className="label">Room Type Needed</label>
                  <select value={form.roomType} onChange={e => setForm(f => ({ ...f, roomType: e.target.value }))} className="select-input w-full">
                    {ROOM_TYPES.map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>
              </div>
              {msg && <p className={`text-xs mb-3 px-3 py-2 rounded-lg ${msg.includes('added') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>{msg}</p>}
              <button type="submit" className="btn-primary"><Plus size={14} />Add Course to Ledger</button>
            </form>
          </div>
        )}

        {/* Table */}
        <div className="card">
          <div className="p-5 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-gray-900">Active Course Index</h2>
              <p className="text-xs text-gray-400 mt-0.5">Overview of all currently allocated modules and their respective departments.</p>
            </div>
            <div className="flex gap-2">
              <button className="btn-secondary py-2 text-xs"><SlidersHorizontal size={13} />Filter</button>
              <button className="btn-secondary py-2 text-xs"><Download size={13} />Export CSV</button>
            </div>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Code', 'Course', 'Faculty', 'Dept', 'Sem', 'Hours', isAdmin ? 'Actions' : null].filter(Boolean).map(h => (
                  <th key={h} className="table-th">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="table-td text-center py-12 text-gray-400">Loading courses...</td></tr>
              ) : courses.map(c => (
                <tr key={c._id} className="table-row">
                  <td className="table-td font-mono text-xs font-bold text-gray-700">{c.courseCode}</td>
                  <td className="table-td">
                    <div className="font-semibold text-gray-900">{c.courseName}</div>
                    <div className="text-xs text-gray-400">{c.prerequisite !== 'None' ? `Prerequisite: ${c.prerequisite}` : 'Prerequisite: None'}</div>
                  </td>
                  <td className="table-td text-gray-600">{c.faculty}</td>
                  <td className="table-td text-gray-500">{c.department}</td>
                  <td className="table-td">
                    <span className={`text-xs font-bold px-2 py-1 rounded ${semColor[c.semester] || 'bg-gray-100 text-gray-600'}`}>{c.semester}</span>
                  </td>
                  <td className="table-td font-mono font-semibold">{String(c.duration).padStart(2, '0')}</td>
                  {isAdmin && (
                    <td className="table-td">
                      <div className="flex gap-1">
                        <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-700"><Pencil size={13} /></button>
                        <button onClick={() => handleDelete(c._id)} className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600"><Trash2 size={13} /></button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-4 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-400">Showing {courses.length} of {courses.length} registered courses</span>
            <div className="flex gap-1">
              {[1,2,3,'...',32].map((p, i) => (
                <button key={i} className={`w-8 h-8 text-xs rounded-lg ${p === 1 ? 'bg-gray-900 text-white font-bold' : 'hover:bg-gray-100 text-gray-500'}`}>{p}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
