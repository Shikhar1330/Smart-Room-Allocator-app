import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { usersAPI } from '../services/api';
import { UserPlus, Filter, Download, Eye, Trash2, Info } from 'lucide-react';

const ROLES = ['Administrator', 'Faculty', 'Student'];
const DEPARTMENTS = ['Academic Registry', 'Computer Science', 'Physics & Astronomy', 'Digital Arts', 'Mathematics', 'Engineering', 'Architecture', 'Business'];

const ROLE_BADGE = {
  Administrator: 'bg-gray-900 text-white text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide',
  Faculty: 'bg-purple-50 text-purple-700 border border-purple-200 text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide',
  Student: 'bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide',
};

const STATUS_DOT = {
  Active: 'bg-green-500',
  Pending: 'bg-amber-400',
  Suspended: 'bg-red-500',
};

export default function Users() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ admins: 0, faculty: 0, students: 0 });
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ fullName: '', username: '', role: 'Administrator', department: 'Computer Science', password: '' });
  const [msg, setMsg] = useState('');
  const [showPw, setShowPw] = useState(false);

  const load = async () => {
    setLoading(true);
    const [u, s] = await Promise.all([usersAPI.getAll(), usersAPI.getStats()]);
    setUsers(u.data);
    setStats(s.data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await usersAPI.create(form);
      setMsg('User registered successfully');
      setForm({ fullName: '', username: '', role: 'Administrator', department: 'Computer Science', password: '' });
      load();
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error registering user');
    }
  };

  const handleStatus = async (id, currentStatus) => {
    const next = currentStatus === 'Active' ? 'Suspended' : 'Active';
    await usersAPI.updateStatus(id, next);
    load();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user permanently?')) return;
    await usersAPI.delete(id);
    load();
  };

  const initials = (name) => name?.split(' ').map(n => n[0]).join('').slice(0, 2) || '??';

  return (
    <Layout>
      <div className="animate-slide-up">
        <h1 className="text-xl font-bold text-gray-900 mb-1">User Management</h1>
        <p className="text-sm text-gray-400 mb-6">Configure institutional access and delegate administrative roles across the university ecosystem.</p>

        <div className="flex gap-6 mb-6">
          {/* Add user form */}
          <div className="card p-6 flex-1">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <UserPlus size={16} />Add New User
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="label">Full Name</label>
                  <input value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} className="input" placeholder="e.g. Dr. Julian Pierce" required />
                </div>
                <div>
                  <label className="label">Username</label>
                  <input value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} className="input" placeholder="j.pierce.admin" required />
                </div>
                <div>
                  <label className="label">Role</label>
                  <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} className="select-input w-full">
                    {ROLES.map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Department</label>
                  <select value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))} className="select-input w-full">
                    {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="label">Temporary Password</label>
                  <div className="relative">
                    <input
                      type={showPw ? 'text' : 'password'}
                      value={form.password}
                      onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                      className="input pr-10"
                      placeholder="••••••••••••"
                      required
                    />
                    <button type="button" onClick={() => setShowPw(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700">
                      <Eye size={15} />
                    </button>
                  </div>
                </div>
              </div>
              {msg && (
                <p className={`text-xs mb-3 px-3 py-2 rounded-lg border ${msg.includes('success') ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>{msg}</p>
              )}
              <button type="submit" className="btn-primary">Register User</button>
            </form>
          </div>

          {/* License allocation */}
          <div className="w-64 flex-shrink-0 space-y-4">
            <div className="card p-5">
              <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">License Allocation</div>
              <div className="space-y-4">
                {[
                  { label: 'Administrators', used: stats.admins, max: 15 },
                  { label: 'Faculty Leads', used: stats.faculty, max: 200 },
                  { label: 'Student Access', used: stats.students, max: 1200 },
                ].map(l => (
                  <div key={l.label}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-gray-700 font-medium">{l.label}</span>
                      <span className="font-bold text-gray-900">{l.used} / {l.max}</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-1.5 bg-gray-800 rounded-full" style={{ width: `${Math.min((l.used / l.max) * 100, 100)}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="card p-4 bg-purple-50 border-purple-200 flex gap-3">
              <div className="w-7 h-7 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Info size={13} className="text-purple-600" />
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">Bulk user upload is available via CSV integration in Settings &gt; Advanced Tools.</p>
            </div>
          </div>
        </div>

        {/* User directory */}
        <div className="card">
          <div className="p-5 border-b border-gray-200 flex items-center justify-between">
            <h2 className="font-bold text-gray-900">User Directory</h2>
            <div className="flex gap-2">
              <button className="btn-secondary text-xs py-2"><Filter size={13} />Filter</button>
              <button className="btn-secondary text-xs py-2"><Download size={13} />Export Ledger</button>
            </div>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Profile & Name', 'Username', 'Department', 'Role Type', 'Access Status', 'Actions'].map(h => (
                  <th key={h} className="table-th">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="table-td text-center py-12 text-gray-400">Loading users...</td></tr>
              ) : users.map(u => (
                <tr key={u._id} className="table-row">
                  <td className="table-td">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-600 flex-shrink-0">
                        {initials(u.fullName)}
                      </div>
                      <span className="font-semibold text-gray-900">{u.fullName}</span>
                    </div>
                  </td>
                  <td className="table-td font-mono text-xs text-gray-600">{u.username}</td>
                  <td className="table-td text-gray-600">{u.department}</td>
                  <td className="table-td">
                    <span className={ROLE_BADGE[u.role] || ''}>{u.role}</span>
                  </td>
                  <td className="table-td">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${STATUS_DOT[u.status] || 'bg-gray-400'}`}></div>
                      <span className={`text-sm ${u.status === 'Suspended' ? 'text-red-600 font-semibold' : u.status === 'Pending' ? 'text-amber-600' : 'text-gray-600'}`}>{u.status}</span>
                    </div>
                  </td>
                  <td className="table-td">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleStatus(u._id, u.status)}
                        title={u.status === 'Active' ? 'Suspend' : 'Activate'}
                        className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-700 transition-colors"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(u._id)}
                        className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-4 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-400">Showing 1–{users.length} of {users.length} registered users</span>
            <div className="flex gap-1">
              {['←', '1', '2', '3', '...', '245', '→'].map((p, i) => (
                <button key={i} className={`w-8 h-8 text-xs rounded-lg ${p === '1' ? 'bg-gray-900 text-white font-bold' : 'hover:bg-gray-100 text-gray-500'}`}>{p}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
