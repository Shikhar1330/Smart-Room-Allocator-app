import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { dashboardAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { DoorOpen, BookOpen, Sparkles, Calendar, AlertTriangle, CheckCircle, Plus, Download, Zap, User, Database } from 'lucide-react';

const modules = [
  { label: 'Room Management', tag: 'INVENTORY', icon: DoorOpen, desc: 'Modify capacity, change technical equipment profile, or audit specific classroom space.', path: '/rooms' },
  { label: 'Course Catalog', tag: 'CURRICULUM', icon: BookOpen, desc: 'Update course requirements, student counts, and instructor preferences for next semester.', path: '/courses' },
  { label: 'Smart Allocation', tag: 'AI CORE', icon: Sparkles, desc: 'Run the allocation engine to automatically pair courses with optimal room environments.', path: '/allocation' },
  { label: 'Interactive Timetable', tag: 'MASTER VIEW', icon: Calendar, desc: 'Visual drag-and-drop interface for manually adjusting schedules and room bookings.', path: '/timetable' },
];

const eventIcon = (type) => ({
  conflict: <AlertTriangle size={14} className="text-red-500" />,
  success: <CheckCircle size={14} className="text-green-500" />,
  user: <User size={14} className="text-blue-500" />,
  info: <Database size={14} className="text-gray-400" />,
})[type] || <CheckCircle size={14} className="text-gray-400" />;

export default function Dashboard() {
  const [stats, setStats] = useState({});
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([dashboardAPI.getStats(), dashboardAPI.getEvents()])
      .then(([s, e]) => { setStats(s.data); setEvents(e.data); })
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    { label: 'Total Rooms', value: stats.totalRooms || 0, sub: '+4 new', icon: DoorOpen },
    { label: 'Available', value: `${stats.availableRooms || 0}`, sub: `${stats.totalRooms ? Math.round((stats.availableRooms / stats.totalRooms) * 100) : 0}%`, accent: 'blue' },
    { label: 'Courses', value: stats.totalCourses || 0, icon: BookOpen },
    { label: 'Today', value: stats.todaySessions || 0, sub: 'Sessions' },
    { label: 'Allocated', value: `${stats.efficiency || 0}%`, sub: '✓ verified', accent: 'green' },
    { label: 'Conflicts', value: stats.conflicts || 0, sub: 'URGENT', accent: stats.conflicts > 0 ? 'red' : 'green' },
  ];

  const accentColor = { blue: 'text-blue-600', red: 'text-red-600 border-t-2 border-red-400', green: 'text-green-600' };

  return (
    <Layout>
      <div className="animate-slide-up">
        {/* Page header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {user?.role === 'Faculty' ? `Welcome back, ${user?.fullName?.split(' ')[1] || user?.fullName}.` : 'Institutional Dashboard'}
            </h1>
            <p className="text-gray-400 text-sm mt-1 flex items-center gap-2">
              <Calendar size={14} />
              Winter Semester 2024 • Academic Week 08
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="btn-secondary"><Download size={14} />Export PDF</button>
            <button onClick={() => navigate('/rooms')} className="btn-primary"><Plus size={14} />New Request</button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-6 gap-4 mb-8">
          {statCards.map((s, i) => (
            <div key={i} className={`card p-4 ${s.accent === 'red' ? 'border-t-2 border-red-400' : ''}`}>
              <div className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-2">{s.label}</div>
              <div className={`text-2xl font-black ${s.accent ? accentColor[s.accent] || '' : 'text-gray-900'}`}>{loading ? '—' : s.value}</div>
              {s.sub && <div className={`text-xs mt-1 ${s.accent === 'red' ? 'text-red-500 font-semibold' : 'text-gray-400'}`}>{s.sub}</div>}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-5 gap-6">
          {/* Quick Access */}
          <div className="col-span-3">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Quick Access Modules</h2>
              <button className="text-xs font-semibold text-gray-400 hover:text-gray-700 uppercase tracking-wider">Manage All</button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {modules.filter(m => user?.role === 'Administrator' || !['Smart Allocation'].includes(m.label)).map((m) => (
                <button key={m.label} onClick={() => navigate(m.path)} className="card p-5 text-left hover:border-gray-300 hover:shadow-sm transition-all group">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                      <m.icon size={18} className="text-gray-600" />
                    </div>
                    <span className="text-xs font-bold text-gray-400 tracking-widest uppercase">{m.tag}</span>
                  </div>
                  <div className="font-bold text-gray-900 mb-1.5">{m.label}</div>
                  <div className="text-xs text-gray-500 leading-relaxed">{m.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* System Events */}
          <div className="col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Recent System Events</h2>
            </div>
            <div className="card divide-y divide-gray-100">
              {loading ? (
                <div className="p-6 text-center text-gray-400 text-sm">Loading events...</div>
              ) : events.slice(0, 5).map((ev, i) => (
                <div key={i} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">{eventIcon(ev.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-gray-400 mb-0.5">{ev.time}</div>
                      <div className="text-sm font-semibold text-gray-900 mb-0.5">{ev.title}</div>
                      <div className="text-xs text-gray-500 leading-relaxed">{ev.description}</div>
                      {ev.type === 'conflict' && (
                        <button onClick={() => navigate('/conflicts')} className="text-xs font-bold text-red-600 mt-1 hover:underline uppercase tracking-wide">Resolve Now</button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {user?.role === 'Administrator' && (
                <div className="p-3 bg-gray-900 rounded-b-xl">
                  <button onClick={() => navigate('/allocation')} className="w-full text-white text-sm font-semibold flex items-center justify-center gap-2 py-1">
                    <Zap size={14} />
                    Run Allocation Engine
                  </button>
                </div>
              )}
              <div className="p-3">
                <button className="w-full text-xs font-semibold text-gray-400 uppercase tracking-wider hover:text-gray-700 py-1">View Full Log History</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
