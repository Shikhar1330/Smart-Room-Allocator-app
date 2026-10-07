import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { dashboardAPI, roomsAPI, usersAPI } from '../services/api';
import { Download, SlidersHorizontal, TrendingUp } from 'lucide-react';

const FACULTY_DATA = [
  { name: 'Dr. Rivers', dept: 'QUANTUM PHYS.', hours: 18, max: 20, status: 'OPTIMAL', color: 'text-green-700 bg-green-50 border-green-200' },
  { name: 'Prof. Liang', dept: 'BIO-CHEMISTRY', hours: 24, max: 20, status: 'OVERLOAD', color: 'text-red-700 bg-red-50 border-red-200' },
  { name: 'Sarah Chen', dept: 'DATA ETHICS', hours: 12, max: 20, status: 'LIGHT', color: 'text-gray-500 bg-gray-50 border-gray-200' },
  { name: 'A. Kapoor', dept: 'MACRO ECON.', hours: 20, max: 20, status: 'MAXIMIZED', color: 'text-amber-700 bg-amber-50 border-amber-200' },
];

export default function Reports() {
  const [utilization, setUtilization] = useState([]);
  const [roomStats, setRoomStats] = useState({});
  const [userStats, setUserStats] = useState({});
  const [view, setView] = useState('WEEKLY');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([dashboardAPI.getUtilization(), roomsAPI.getStats(), usersAPI.getStats()])
      .then(([u, r, us]) => { setUtilization(u.data); setRoomStats(r.data); setUserStats(us.data); })
      .finally(() => setLoading(false));
  }, []);

  const topStats = [
    { label: 'TOTAL', sub: 'Managed facilities', value: roomStats.total || 142 },
    { label: 'ACTIVE', sub: 'Currently assigned', value: roomStats.available || 118 },
    { label: 'FREE', sub: 'Ready for intake', value: 12 },
    { label: 'ALERT', sub: 'Schedule overlaps', value: 4, accent: true },
    { label: 'OFFLINE', sub: 'Maintenance mode', value: roomStats.maintenance || 8 },
    { label: 'EFF.', sub: 'Global utilization', value: '83%', dark: true },
  ];

  const efficiencyMetrics = [
    { label: 'Spatial Density', value: '4.2', unit: 'person / m²', note: 'Within 5% of target range for institutional safety guidelines.' },
    { label: 'Resource Waste', value: '12%', unit: 'Unused hours', note: 'Primarily located in specialized lab spaces on Friday afternoons.' },
    { label: 'Faculty Satisfaction', value: '8.8', unit: 'Index / 10', note: 'Based on recent scheduling preference match rates.' },
    { label: 'Conflict Resolution', value: '99.1%', unit: '', note: 'Resolved via autonomous allocator before manual intervention.' },
  ];

  return (
    <Layout>
      <div className="animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-gray-900">Performance Intelligence</h1>
          <button className="btn-secondary text-xs"><Download size={13} />Download Full Ledger</button>
        </div>

        {/* Top stats */}
        <div className="grid grid-cols-6 gap-3 mb-6">
          {topStats.map((s, i) => (
            <div key={i} className={`card p-4 ${s.dark ? 'bg-gray-900 text-white border-gray-900' : ''}`}>
              <div className={`text-xs font-bold uppercase tracking-widest mb-1 ${s.dark ? 'text-gray-400' : 'text-gray-400'}`}>{s.label}</div>
              <div className={`text-2xl font-black mb-1 ${s.dark ? 'text-white' : s.accent ? 'text-red-500' : 'text-gray-900'}`}>{s.value}</div>
              <div className={`text-xs ${s.dark ? 'text-gray-400' : 'text-gray-400'} leading-tight`}>{s.sub}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-5 gap-6 mb-6">
          {/* Room Utilization */}
          <div className="card p-6 col-span-3">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-bold text-gray-900">Room Utilization</h2>
                <p className="text-xs text-gray-400 mt-0.5">Weekly density breakdown by department</p>
              </div>
              <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                {['DAILY', 'WEEKLY'].map(v => (
                  <button key={v} onClick={() => setView(v)} className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${view === v ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-700'}`}>{v}</button>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              {loading ? (
                <div className="text-center text-gray-400 py-8">Loading...</div>
              ) : utilization.map((u, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">{u.department}</span>
                    <span className="text-xs font-bold text-gray-900">{u.utilization}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-2 rounded-full transition-all duration-700"
                      style={{ width: `${u.utilization}%`, backgroundColor: u.utilization > 85 ? '#374151' : u.utilization > 65 ? '#6B7280' : '#9CA3AF' }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
              <span className="text-xs text-gray-400 italic">Refreshed: Today at 08:00 AM</span>
              <button className="text-xs font-semibold text-gray-500 hover:text-gray-900 flex items-center gap-1.5 uppercase tracking-wide">
                <Download size={12} />Export Chart
              </button>
            </div>
          </div>

          {/* Faculty Load */}
          <div className="card p-6 col-span-2">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-gray-900">Faculty Load</h2>
              <button className="text-gray-400 hover:text-gray-700"><SlidersHorizontal size={15} /></button>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wide">Professor</div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wide text-center">Hours</div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wide text-right">Status</div>
            </div>
            <div className="space-y-4">
              {FACULTY_DATA.map((f, i) => (
                <div key={i} className="grid grid-cols-3 gap-2 items-center">
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{f.name}</div>
                    <div className="text-xs text-gray-400">{f.dept}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold text-gray-900">{f.hours}/{f.max}</div>
                    <div className="h-1 bg-gray-100 rounded-full mt-1">
                      <div className="h-1 bg-gray-800 rounded-full" style={{ width: `${(f.hours / f.max) * 100}%` }}></div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full border ${f.color}`}>{f.status}</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-5 text-xs font-bold text-gray-400 uppercase tracking-wider hover:text-gray-700 pt-4 border-t border-gray-100">View Detailed Load Audit</button>
          </div>
        </div>

        {/* Next Forecast */}
        <div className="card p-5 mb-6 bg-gray-50 border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={15} className="text-gray-500" />
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Next Forecast</span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed max-w-lg">
                Predictive model suggests a <span className="text-red-600 font-bold">12% increase</span> in room conflicts for the Fall semester due to expanded elective offerings.
              </p>
            </div>
            <div className="flex gap-1.5 mt-1">
              {[1, 2, 3].map(i => <div key={i} className={`w-2 h-2 rounded-full ${i === 1 ? 'bg-gray-900' : 'bg-gray-300'}`}></div>)}
            </div>
          </div>
        </div>

        {/* Institutional Efficiency Index */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-bold text-gray-900">Institutional Efficiency Index</h2>
              <p className="text-xs text-gray-400 mt-0.5">Cross-departmental performance comparison</p>
            </div>
            <button className="btn-secondary text-xs"><Download size={13} />Download Full Ledger</button>
          </div>
          <div className="grid grid-cols-4 gap-6">
            {efficiencyMetrics.map((m, i) => (
              <div key={i}>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{m.label}</div>
                <div className="text-3xl font-black text-gray-900 mb-0.5">{m.value} <span className="text-sm font-normal text-gray-400">{m.unit}</span></div>
                <div className="text-xs text-gray-400 leading-relaxed">{m.note}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-gray-400">
          © 2024 SMARTALLOC INSTITUTIONAL INTELLIGENCE ENGINE
        </div>
      </div>
    </Layout>
  );
}
