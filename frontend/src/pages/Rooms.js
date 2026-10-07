import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { roomsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Plus, Search, SlidersHorizontal, Pencil, Trash2 } from 'lucide-react';

const STATUS_BADGE = { Available: 'badge-available', Maintenance: 'badge-maintenance', Occupied: 'badge-conflict' };
const ROOM_TYPES = ['Lecture Hall', 'Computer Lab', 'Seminar Room', 'Laboratory', 'Auditorium', 'Studio'];
const BUILDINGS = ['Engineering Block', 'Innovation Hub', 'Main Hall', 'North Wing', 'South Block', 'Science Block', 'Tech Center', 'Admin Block', 'Wing A'];

function Badge({ status }) {
  return <span className={STATUS_BADGE[status] || 'badge-confirmed'}>{status}</span>;
}

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ roomId: '', capacity: '', type: 'Lecture Hall', building: 'North Wing' });
  const [msg, setMsg] = useState('');
  const { user } = useAuth();
  const isAdmin = user?.role === 'Administrator';

  const load = async () => {
    setLoading(true);
    const [r, s] = await Promise.all([roomsAPI.getAll({ search }), roomsAPI.getStats()]);
    setRooms(r.data);
    setStats(s.data);
    setLoading(false);
  };

  useEffect(() => { load(); }, [search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await roomsAPI.create({ ...form, capacity: Number(form.capacity) });
      setMsg('Room added successfully');
      setForm({ roomId: '', capacity: '', type: 'Lecture Hall', building: 'North Wing' });
      load();
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error adding room');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this room?')) return;
    await roomsAPI.delete(id);
    load();
  };

  return (
    <Layout>
      <div className="animate-slide-up">
        <h1 className="text-xl font-bold text-gray-900 mb-6">Room Management</h1>

        <div className="flex gap-6">
          {/* Add Room Form */}
          {isAdmin && (
            <div className="card p-6 flex-1" style={{ maxWidth: '560px' }}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="font-bold text-gray-900">Provision New Resource</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Define spatial parameters for the institutional ledger.</p>
                </div>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <label className="label">Room No</label>
                    <input value={form.roomId} onChange={e => setForm(f => ({ ...f, roomId: e.target.value }))} className="input" placeholder="e.g. LAB-402" required />
                  </div>
                  <div>
                    <label className="label">Capacity</label>
                    <input type="number" value={form.capacity} onChange={e => setForm(f => ({ ...f, capacity: e.target.value }))} className="input" placeholder="45" required />
                  </div>
                  <div>
                    <label className="label">Type</label>
                    <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className="select-input w-full">
                      {ROOM_TYPES.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label">Building</label>
                    <select value={form.building} onChange={e => setForm(f => ({ ...f, building: e.target.value }))} className="select-input w-full">
                      {BUILDINGS.map(b => <option key={b}>{b}</option>)}
                    </select>
                  </div>
                </div>
                {msg && <p className={`text-xs mb-3 px-3 py-2 rounded-lg ${msg.includes('success') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>{msg}</p>}
                <button type="submit" className="btn-primary"><Plus size={14} />Commit to Registry</button>
              </form>
            </div>
          )}

          {/* Stats card */}
          <div className="card bg-gray-900 text-white p-6 w-52 flex-shrink-0">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Registry Overview</h3>
            <div className="text-3xl font-black mb-1">{stats.totalCapacity?.toLocaleString() || '—'}</div>
            <div className="text-xs text-gray-400 mb-4">Total Capacity</div>
            <div className="h-1.5 bg-gray-700 rounded-full mb-4">
              <div className="h-1.5 bg-white rounded-full" style={{ width: stats.total ? `${(stats.available / stats.total) * 100}%` : '0%' }}></div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="text-xs text-gray-400 uppercase tracking-wider">Active Rooms</div>
                <div className="text-xl font-bold mt-0.5">{stats.available || 0}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400 uppercase tracking-wider">Maintenance</div>
                <div className="text-xl font-bold mt-0.5">{stats.maintenance || 0}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="card mt-6">
          <div className="p-5 border-b border-gray-200 flex items-center justify-between">
            <h2 className="font-bold text-gray-900">Resource Inventory</h2>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={search} onChange={e => setSearch(e.target.value)} className="input pl-9 w-52" placeholder="Filter by Building or ID..." />
              </div>
              <button className="btn-secondary py-2"><SlidersHorizontal size={14} /></button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['Room ID', 'Type', 'Capacity', 'Building', 'Status', isAdmin ? 'Actions' : null].filter(Boolean).map(h => (
                    <th key={h} className="table-th">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} className="table-td text-center text-gray-400 py-12">Loading rooms...</td></tr>
                ) : rooms.length === 0 ? (
                  <tr><td colSpan={6} className="table-td text-center text-gray-400 py-12">No rooms found</td></tr>
                ) : rooms.map(room => (
                  <tr key={room._id} className="table-row">
                    <td className="table-td font-bold text-gray-900">{room.roomId}</td>
                    <td className="table-td">{room.type}</td>
                    <td className="table-td">{room.capacity} {room.type === 'Computer Lab' ? 'Workstations' : room.type === 'Auditorium' ? 'Fixed Seats' : room.type === 'Seminar Room' ? 'Flexible' : 'Students'}</td>
                    <td className="table-td">{room.building}</td>
                    <td className="table-td"><Badge status={room.status} /></td>
                    {isAdmin && (
                      <td className="table-td">
                        <div className="flex items-center gap-2">
                          <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-700"><Pencil size={14} /></button>
                          <button onClick={() => handleDelete(room._id)} className="p-1.5 hover:bg-red-50 rounded-lg transition-colors text-gray-400 hover:text-red-600"><Trash2 size={14} /></button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-400 uppercase tracking-wide">Showing {rooms.length} of {stats.total || 0} records</span>
            <div className="flex gap-2">
              <button className="btn-secondary py-1.5 text-xs">Previous</button>
              <button className="btn-secondary py-1.5 text-xs">Next</button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
