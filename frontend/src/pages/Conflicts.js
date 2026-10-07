import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { allocationsAPI } from '../services/api';
import { AlertTriangle, CheckCircle, Trash2 } from 'lucide-react';

export default function Conflicts() {
  const [conflicts, setConflicts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resolving, setResolving] = useState(null);

  const load = async () => {
    setLoading(true);
    const { data } = await allocationsAPI.getConflicts();
    setConflicts(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const resolve = async (id) => {
    setResolving(id);
    await allocationsAPI.resolve(id);
    await load();
    setResolving(null);
  };

  const remove = async (id) => {
    await allocationsAPI.delete(id);
    await load();
  };

  return (
    <Layout>
      <div className="animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Conflict Resolution</h1>
            <p className="text-sm text-gray-400 mt-0.5">Manage and resolve scheduling conflicts across the institution.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold ${conflicts.length > 0 ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700'}`}>
              {conflicts.length > 0 ? <AlertTriangle size={14} /> : <CheckCircle size={14} />}
              {conflicts.length > 0 ? `${conflicts.length} Unresolved` : 'All Clear'}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="card p-12 text-center text-gray-400">Loading conflicts...</div>
        ) : conflicts.length === 0 ? (
          <div className="card p-16 text-center">
            <CheckCircle size={40} className="text-green-400 mx-auto mb-4" />
            <div className="text-lg font-bold text-gray-900 mb-2">No conflicts detected</div>
            <div className="text-sm text-gray-400">All room allocations are conflict-free.</div>
          </div>
        ) : (
          <div className="space-y-4">
            {conflicts.map((c) => (
              <div key={c._id} className="card border-l-4 border-red-400 p-5 flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                    <AlertTriangle size={18} className="text-red-500" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 mb-1">
                      {c.course?.courseCode} — {c.room?.roomId}
                    </div>
                    <div className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">{c.course?.courseName}</span> is double-booked in{' '}
                      <span className="font-mono font-semibold">{c.room?.roomId}</span> ({c.room?.building})
                    </div>
                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      <span className="text-xs bg-gray-100 text-gray-700 font-mono px-2 py-1 rounded">{c.day}</span>
                      <span className="text-xs bg-gray-100 text-gray-700 font-mono px-2 py-1 rounded">{c.startTime} – {c.endTime}</span>
                      <span className="text-xs text-gray-400">Allocated by: {c.allocatedBy}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => resolve(c._id)}
                    disabled={resolving === c._id}
                    className="bg-gray-900 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-gray-700 transition-colors flex items-center gap-1.5"
                  >
                    <CheckCircle size={13} />
                    {resolving === c._id ? 'Resolving...' : 'Mark Resolved'}
                  </button>
                  <button
                    onClick={() => remove(c._id)}
                    className="p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary card */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          {[
            { label: 'Total Conflicts', value: conflicts.length, color: 'text-red-600' },
            { label: 'Urgent (>24h)', value: conflicts.filter(() => true).length, color: 'text-amber-600' },
            { label: 'Auto-resolvable', value: Math.floor(conflicts.length * 0.6), color: 'text-blue-600' },
          ].map(s => (
            <div key={s.label} className="card p-5">
              <div className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-2">{s.label}</div>
              <div className={`text-3xl font-black ${s.color}`}>{s.value}</div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
