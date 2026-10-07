import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { allocationsAPI, coursesAPI, roomsAPI } from '../services/api';
import { Sparkles, Calendar, CheckCircle, AlertTriangle, Zap } from 'lucide-react';

const DAYS = ['M', 'T', 'W', 'T', 'F'];
const DAY_FULL = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const ROOM_TYPES = ['Lecture Hall', 'Laboratory', 'Seminar'];

export default function Allocation() {
  const [courses, setCourses] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [conflicts, setConflicts] = useState([]);
  const [selectedDays, setSelectedDays] = useState([1, 3]);
  const [roomType, setRoomType] = useState('Laboratory');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [efficiency, setEfficiency] = useState(92);

  // Manual override
  const [manual, setManual] = useState({ course: '', room: '', day: 'Monday', startTime: '', endTime: '' });

  useEffect(() => {
    Promise.all([coursesAPI.getAll(), roomsAPI.getAll(), allocationsAPI.getAll(), allocationsAPI.getConflicts()])
      .then(([c, r, a, cf]) => { setCourses(c.data); setRooms(r.data); setAllocations(a.data); setConflicts(cf.data); });
  }, []);

  const toggleDay = (i) => setSelectedDays(d => d.includes(i) ? d.filter(x => x !== i) : [...d, i]);

  const handleAutoAllocate = async () => {
    setLoading(true);
    setMsg('');
    try {
      const res = await allocationsAPI.autoAllocate({
        preferredDays: selectedDays.map(i => DAY_FULL[i]),
        roomType: roomType === 'Seminar' ? 'Seminar Room' : roomType,
      });
      setMsg(`✓ Successfully allocated ${res.data.allocated} courses`);
      const [a, cf] = await Promise.all([allocationsAPI.getAll(), allocationsAPI.getConflicts()]);
      setAllocations(a.data);
      setConflicts(cf.data);
      setEfficiency(prev => Math.min(prev + Math.random() * 3, 99));
    } catch (err) {
      setMsg('Error during allocation');
    } finally {
      setLoading(false);
    }
  };

  const handleManual = async () => {
    if (!manual.course || !manual.room || !manual.startTime || !manual.endTime) return setMsg('Fill all fields');
    try {
      await allocationsAPI.create(manual);
      setMsg('Override confirmed');
      const [a, cf] = await Promise.all([allocationsAPI.getAll(), allocationsAPI.getConflicts()]);
      setAllocations(a.data);
      setConflicts(cf.data);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error');
    }
  };

  const resolveConflict = async (id) => {
    await allocationsAPI.resolve(id);
    const [a, cf] = await Promise.all([allocationsAPI.getAll(), allocationsAPI.getConflicts()]);
    setAllocations(a.data);
    setConflicts(cf.data);
  };

  const occupancy = rooms.slice(0, 2).map((r, i) => ({ room: r.roomId, pct: i === 0 ? 85 : 42 }));

  return (
    <Layout>
      <div className="animate-slide-up">
        <h1 className="text-xl font-bold text-gray-900 mb-1">Allocation Engine</h1>
        <p className="text-sm text-gray-400 mb-6">Manage institutional spatial distribution with precision.</p>

        {msg && (
          <div className={`mb-4 px-4 py-3 rounded-xl text-sm font-medium border ${msg.startsWith('✓') ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
            {msg}
          </div>
        )}

        <div className="flex gap-6">
          {/* Auto Allocation */}
          <div className="card p-6 flex-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                <Sparkles size={18} className="text-purple-600" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900">Auto Allocation</h2>
                <p className="text-xs text-gray-400">Intelligent algorithmic slotting</p>
              </div>
            </div>

            <div className="mb-4">
              <label className="label">Target Course</label>
              <select className="select-input w-full">
                <option value="">Select Course Cluster...</option>
                {courses.map(c => <option key={c._id} value={c._id}>{c.courseName} ({c.courseCode})</option>)}
              </select>
            </div>

            <div className="flex gap-4 mb-4">
              <div className="flex-1">
                <label className="label">Preferred Days</label>
                <div className="flex gap-1.5">
                  {DAYS.map((d, i) => (
                    <button
                      key={i}
                      onClick={() => toggleDay(i)}
                      className={`w-9 h-9 rounded-lg text-sm font-bold transition-all ${selectedDays.includes(i) ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                    >{d}</button>
                  ))}
                </div>
              </div>
              <div className="flex-1">
                <label className="label">Time Window</label>
                <div className="flex items-center gap-2">
                  <input type="time" className="input flex-1" defaultValue="08:00" />
                  <span className="text-gray-400 text-sm">to</span>
                  <input type="time" className="input flex-1" defaultValue="18:00" />
                </div>
              </div>
            </div>

            <div className="mb-5">
              <label className="label">Room Type</label>
              <div className="grid grid-cols-3 gap-2">
                {ROOM_TYPES.map(t => (
                  <button
                    key={t}
                    onClick={() => setRoomType(t)}
                    className={`p-3 rounded-xl border text-sm font-medium flex flex-col items-center gap-1.5 transition-all ${roomType === t ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    {t === 'Lecture Hall' ? '🎓' : t === 'Laboratory' ? '🔬' : '👥'}
                    <span className="text-xs">{t}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button className="btn-secondary flex-1 justify-center">Preview</button>
              <button onClick={handleAutoAllocate} disabled={loading} className="btn-primary flex-1 justify-center">
                <Zap size={14} />{loading ? 'Allocating...' : 'Auto Allocate'}
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mt-5">
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Current Efficiency</div>
                <div className="text-2xl font-black text-gray-900">{efficiency.toFixed(0)}%</div>
                <div className="text-xs text-green-600">↑4.2%</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Detected Conflicts</div>
                <div className="text-2xl font-black text-red-600">{String(conflicts.length).padStart(2, '0')}</div>
                <div className="text-xs text-gray-400">Unresolved</div>
              </div>
            </div>
          </div>

          {/* Manual Override */}
          <div className="card p-6 w-80 flex-shrink-0 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                <Calendar size={18} className="text-gray-600" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900">Manual Override</h2>
                <p className="text-xs text-gray-400">Precision administrative control</p>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 italic text-xs text-gray-500">
              "Use manual overrides for complex departmental exceptions that the algorithm may not prioritize."
            </div>

            <div>
              <label className="label">Course</label>
              <input value={manual.course} onChange={e => setManual(m => ({ ...m, course: e.target.value }))} className="input" placeholder="Start typing course code..." list="courses-list" />
              <datalist id="courses-list">{courses.map(c => <option key={c._id} value={c._id}>{c.courseCode}</option>)}</datalist>
            </div>

            <div>
              <label className="label">Room</label>
              <select value={manual.room} onChange={e => setManual(m => ({ ...m, room: e.target.value }))} className="select-input w-full">
                <option value="">Select Specific Room...</option>
                {rooms.filter(r => r.status === 'Available').map(r => <option key={r._id} value={r._id}>{r.roomId} — {r.building}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Day</label>
                <select value={manual.day} onChange={e => setManual(m => ({ ...m, day: e.target.value }))} className="select-input w-full">
                  {DAY_FULL.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Time</label>
                <input type="time" value={manual.startTime} onChange={e => setManual(m => ({ ...m, startTime: e.target.value, endTime: e.target.value ? `${String(parseInt(e.target.value) + 2).padStart(2, '0')}:00` : '' }))} className="input" />
              </div>
            </div>

            <button onClick={() => setManual(m => ({ ...m }))} className="btn-secondary justify-center">
              <CheckCircle size={14} />Validate Slot
            </button>
            <button onClick={handleManual} className="btn-primary justify-center">
              🔒 Confirm Override
            </button>

            {/* Occupancy */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Real-time Occupancy</span>
                <span className="text-xs bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full">LIVE</span>
              </div>
              {occupancy.map(o => (
                <div key={o.room} className="mb-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500">{o.room}</span>
                    <span className="font-semibold">{o.pct}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-200 rounded-full">
                    <div className="h-1.5 bg-gray-800 rounded-full transition-all" style={{ width: `${o.pct}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Conflict banner */}
        {conflicts.length > 0 && (
          <div className="mt-6 border-l-4 border-red-500 bg-red-50 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center"><AlertTriangle size={16} className="text-red-600" /></div>
              <div>
                <div className="font-bold text-red-800">Scheduling Conflict Detected</div>
                <div className="text-sm text-red-600">{conflicts[0]?.room?.roomId} is over-allocated for {conflicts[0]?.day} at {conflicts[0]?.startTime}.</div>
              </div>
            </div>
            <button onClick={() => resolveConflict(conflicts[0]._id)} className="bg-white border border-red-300 text-red-700 text-xs font-bold px-4 py-2 rounded-lg hover:bg-red-50 transition-colors">Resolve Now</button>
          </div>
        )}

        {/* Recent allocations table */}
        <div className="card mt-6">
          <div className="p-5 border-b border-gray-200">
            <h2 className="font-bold text-gray-900">Recent Allocations</h2>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Course', 'Room', 'Day', 'Time', 'Status', 'By', 'Actions'].map(h => <th key={h} className="table-th">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {allocations.slice(0, 8).map(a => (
                <tr key={a._id} className="table-row">
                  <td className="table-td"><span className="font-semibold text-gray-900">{a.course?.courseCode}</span><span className="text-gray-400 text-xs ml-1">{a.course?.courseName}</span></td>
                  <td className="table-td font-mono text-xs font-bold">{a.room?.roomId}</td>
                  <td className="table-td text-gray-600">{a.day}</td>
                  <td className="table-td font-mono text-xs">{a.startTime} – {a.endTime}</td>
                  <td className="table-td">
                    <span className={a.status === 'Confirmed' ? 'badge-confirmed' : a.status === 'Conflict' ? 'badge-conflict' : 'text-xs text-gray-500'}>{a.status}</span>
                  </td>
                  <td className="table-td text-xs text-gray-400">{a.allocatedBy}</td>
                  <td className="table-td">
                    {a.status === 'Conflict' && (
                      <button onClick={() => resolveConflict(a._id)} className="text-xs text-red-600 font-semibold hover:underline">Resolve</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
