import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, ArrowRight, Info } from 'lucide-react';

export default function AuthPage() {
  const [tab, setTab] = useState('signin');
  const [form, setForm] = useState({ fullName: '', username: '', password: '', confirmPassword: '', role: 'Administrator', department: '', agreed: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (tab === 'register' && form.password !== form.confirmPassword) return setError('Passwords do not match');
    if (tab === 'register' && !form.agreed) return setError('Please agree to terms');
    setLoading(true);
    try {
      if (tab === 'signin') await login({ username: form.username, password: form.password, role: form.role });
      else await register({ fullName: form.fullName, username: form.username, password: form.password, role: form.role, department: form.department });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {tab === 'signin' ? (
        <div className="w-full max-w-md animate-slide-up">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-10 h-10 bg-gray-700 rounded-xl flex items-center justify-center">
              <Sparkles size={18} className="text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-700">SmartAlloc</span>
          </div>

          <div className="card p-8 shadow-sm">
            <h1 className="text-2xl font-bold text-gray-900 text-center mb-1">Sign in</h1>
            <p className="text-gray-500 text-sm text-center mb-6">College room allocation system</p>

            {/* Tabs */}
            <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
              <button onClick={() => setTab('signin')} className="flex-1 py-2 text-sm font-semibold rounded-md bg-white text-gray-900 shadow-sm">Sign in</button>
              <button onClick={() => setTab('register')} className="flex-1 py-2 text-sm font-medium rounded-md text-gray-500 hover:text-gray-700 transition-colors">Register</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Role</label>
                <div className="relative">
                  <select name="role" value={form.role} onChange={handleChange} className="select-input w-full pr-8">
                    <option>Administrator</option>
                    <option>Faculty</option>
                    <option>Student</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="label">Username</label>
                <input name="username" value={form.username} onChange={handleChange} className="input" placeholder="e.g. j.doe@college.edu" required />
              </div>
              <div>
                <label className="flex items-center justify-between">
                  <span className="label mb-0">Password</span>
                  <span className="text-xs text-gray-400 cursor-pointer hover:text-gray-600">Forgot?</span>
                </label>
                <input name="password" type="password" value={form.password} onChange={handleChange} className="input mt-1.5" placeholder="••••••••••" required />
              </div>
              {error && <p className="text-red-600 text-xs bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}
              <button type="submit" disabled={loading} className="w-full btn-primary justify-center py-3 text-base">
                {loading ? 'Signing in...' : <><span>Continue</span><ArrowRight size={16} /></>}
              </button>
            </form>
          </div>

          {/* Demo access hint */}
          <div className="mt-4 bg-purple-50 border border-purple-200 rounded-xl p-4 flex gap-3">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Info size={14} className="text-purple-600" />
            </div>
            <div>
              <div className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Demo Access</div>
              <p className="text-xs text-gray-600">Use <strong>admin_demo</strong> and <strong>smart_alloc_2024</strong> to explore the institutional dashboard.</p>
            </div>
          </div>
        </div>
      ) : (
        /* Register — split layout */
        <div className="w-full max-w-5xl min-h-screen md:min-h-0 md:rounded-2xl overflow-hidden flex shadow-xl animate-fade-in">
          {/* Left panel */}
          <div className="hidden md:flex w-1/2 bg-gray-100 flex-col justify-between p-10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                <Sparkles size={14} className="text-white" />
              </div>
              <span className="font-bold text-gray-900">SmartAlloc</span>
            </div>
            <div>
              <h2 className="text-4xl font-black text-gray-900 leading-tight mb-4">
                Orchestrate your institution<br />
                with <span className="text-gray-500">architectural</span><br />
                <span className="italic">precision.</span>
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed">Join the ecosystem of institutional intelligence. Manage rooms, courses, and schedules through a unified ledger designed for efficiency.</p>
            </div>
            <div className="flex gap-8">
              <div><div className="text-3xl font-black text-gray-900">98%</div><div className="text-xs text-gray-400 uppercase tracking-wider">Efficiency Gain</div></div>
              <div><div className="text-3xl font-black text-gray-900">0</div><div className="text-xs text-gray-400 uppercase tracking-wider">Conflict Errors</div></div>
            </div>
          </div>
          {/* Right panel */}
          <div className="flex-1 bg-white p-10 flex flex-col justify-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Create account</h1>
            <p className="text-gray-500 text-sm mb-6">Enter your details to register for institutional access.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Full Name</label>
                <input name="fullName" value={form.fullName} onChange={handleChange} className="input" placeholder="E.g. Dr. Julian Thorne" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Username</label>
                  <input name="username" value={form.username} onChange={handleChange} className="input" placeholder="j.thorne" required />
                </div>
                <div>
                  <label className="label">Role</label>
                  <select name="role" value={form.role} onChange={handleChange} className="select-input w-full">
                    <option>Administrator</option>
                    <option>Faculty</option>
                    <option>Student</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="label">Department</label>
                <input name="department" value={form.department} onChange={handleChange} className="input" placeholder="e.g. Department of Architecture" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Password</label>
                  <input name="password" type="password" value={form.password} onChange={handleChange} className="input" placeholder="••••••••" required />
                </div>
                <div>
                  <label className="label">Confirm Password</label>
                  <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} className="input" placeholder="••••••••" required />
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="agreed" checked={form.agreed} onChange={handleChange} className="rounded border-gray-300" />
                <span className="text-xs text-gray-500">I agree to the <span className="underline cursor-pointer">Institutional Terms of Service</span> and <span className="underline cursor-pointer">Privacy Policy</span>.</span>
              </label>
              {error && <p className="text-red-600 text-xs bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}
              <button type="submit" disabled={loading} className="w-full btn-primary justify-center py-3">
                {loading ? 'Creating...' : <><span>Create account</span><ArrowRight size={16} /></>}
              </button>
              <p className="text-center text-sm text-gray-500">Already have an institutional account? <button type="button" onClick={() => setTab('signin')} className="font-semibold text-gray-900 hover:underline">Log in here</button></p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
