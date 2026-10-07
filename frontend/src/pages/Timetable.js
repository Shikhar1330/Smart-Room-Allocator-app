import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { allocationsAPI } from '../services/api';
import { Download, Edit } from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const SLOTS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
const COLORS = ['bg-blue-50 border-blue-200 text-blue-800', 'bg-purple-50 border-purple-200 text-purple-800', 'bg-green-50 border-green-200 text-green-800', 'bg-amber-50 border-amber-200 text-amber-800', 'bg-pink-50 border-pink-200 text-pink-800'];

export default function Timetable() {
  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    allocationsAPI.getAll().then(({ data }) => { setAllocations(data); setLoading(false); });
  }, []);

  const getSlot = (day, slot) => {
    return allocations.filter(a => {
      if (a.day !== day) return false;
      const start = parseInt(a.startTime);
      const slotH = parseInt(slot);
      return slotH >= start && slotH < parseInt(a.endTime);
    });
  };

  const colorMap = {};
  let colorIdx = 0;
  allocations.forEach(a => {
    if (!colorMap[a.course?._id]) colorMap[a.course?._id] = COLORS[colorIdx++ % COLORS.length];
  });

  return (
    <Layout>
      <div className="animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Interactive Timetable</h1>
            <p className="text-sm text-gray-400 mt-0.5">Visual schedule for all confirmed room allocations</p>
          </div>
          <div className="flex gap-2">
            <button className="btn-secondary text-xs"><Download size={13} />Export PDF</button>
            <button className="btn-primary text-xs"><Edit size={13} />Edit Schedule</button>
          </div>
        </div>

        {loading ? (
          <div className="card p-12 text-center text-gray-400">Loading timetable...</div>
        ) : (
          <div className="card overflow-x-auto">
            <table className="w-full border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="table-th w-20 text-center">Time</th>
                  {DAYS.map(d => <th key={d} className="table-th text-center">{d}</th>)}
                </tr>
              </thead>
              <tbody>
                {SLOTS.map((slot, si) => (
                  <tr key={slot} className="border-b border-gray-100">
                    <td className="py-3 px-4 text-center">
                      <span className="text-xs font-mono font-semibold text-gray-400">{slot}</span>
                    </td>
                    {DAYS.map(day => {
                      const slotItems = getSlot(day, slot);
                      return (
                        <td key={day} className="py-1.5 px-2 align-top min-h-[3rem]">
                          {slotItems.map(item => (
                            <div key={item._id} className={`border rounded-lg p-2 mb-1 text-xs ${colorMap[item.course?._id] || COLORS[0]} ${item.status === 'Conflict' ? 'border-red-400 bg-red-50' : ''}`}>
                              <div className="font-bold">{item.course?.courseCode}</div>
                              <div className="opacity-70 truncate">{item.room?.roomId}</div>
                              {item.status === 'Conflict' && <div className="text-red-600 font-bold text-xs">⚠ Conflict</div>}
                            </div>
                          ))}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Legend */}
        <div className="mt-4 flex items-center gap-4 flex-wrap">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Legend:</span>
          {allocations.slice(0, 5).map((a, i) => (
            <div key={a._id} className="flex items-center gap-1.5">
              <div className={`w-3 h-3 rounded border ${COLORS[i % COLORS.length]}`}></div>
              <span className="text-xs text-gray-600">{a.course?.courseCode}</span>
            </div>
          ))}
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-red-50 border border-red-400"></div>
            <span className="text-xs text-gray-600">Conflict</span>
          </div>
        </div>
      </div>
    </Layout>
  );
}
