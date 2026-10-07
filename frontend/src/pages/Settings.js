import React from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { Settings as SettingsIcon, User, Bell, Shield, Database } from 'lucide-react';

export default function Settings() {
  const { user } = useAuth();

  return (
    <Layout>
      <div className="animate-slide-up max-w-2xl">
        <h1 className="text-xl font-bold text-gray-900 mb-6">Settings</h1>

        <div className="space-y-4">
          {/* Profile */}
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <User size={16} className="text-gray-500" />
              <h2 className="font-bold text-gray-900">Profile</h2>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-gray-900 rounded-full flex items-center justify-center text-white text-lg font-bold">
                {user?.fullName?.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <div className="font-semibold text-gray-900">{user?.fullName}</div>
                <div className="text-sm text-gray-500">{user?.username}</div>
                <div className="text-xs text-gray-400 mt-0.5">{user?.role} · {user?.department}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Full Name</label>
                <input className="input" defaultValue={user?.fullName} />
              </div>
              <div>
                <label className="label">Department</label>
                <input className="input" defaultValue={user?.department} />
              </div>
            </div>
            <button className="btn-primary mt-4 text-sm">Save Changes</button>
          </div>

          {/* Notifications */}
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <Bell size={16} className="text-gray-500" />
              <h2 className="font-bold text-gray-900">Notifications</h2>
            </div>
            {[
              { label: 'Conflict alerts', desc: 'Get notified when scheduling conflicts are detected' },
              { label: 'Allocation updates', desc: 'Notifications when rooms are automatically re-allocated' },
              { label: 'System maintenance', desc: 'Downtime and maintenance window alerts' },
            ].map(n => (
              <div key={n.label} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div>
                  <div className="text-sm font-medium text-gray-900">{n.label}</div>
                  <div className="text-xs text-gray-400">{n.desc}</div>
                </div>
                <div className="w-10 h-6 bg-gray-900 rounded-full relative cursor-pointer flex-shrink-0">
                  <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Security */}
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <Shield size={16} className="text-gray-500" />
              <h2 className="font-bold text-gray-900">Security</h2>
            </div>
            <div className="space-y-3">
              <div>
                <label className="label">Current Password</label>
                <input type="password" className="input" placeholder="••••••••" />
              </div>
              <div>
                <label className="label">New Password</label>
                <input type="password" className="input" placeholder="••••••••" />
              </div>
            </div>
            <button className="btn-primary mt-4 text-sm">Update Password</button>
          </div>

          {/* System */}
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <Database size={16} className="text-gray-500" />
              <h2 className="font-bold text-gray-900">System</h2>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div>
                <div className="text-sm font-medium text-gray-900">Version</div>
                <div className="text-xs text-gray-400">SmartAlloc v4.2.1-stable</div>
              </div>
              <span className="text-xs bg-green-50 text-green-700 border border-green-200 font-semibold px-2.5 py-1 rounded-full">Up to date</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <div className="text-sm font-medium text-gray-900">Database</div>
                <div className="text-xs text-gray-400">MongoDB · SmartAlloc cluster</div>
              </div>
              <span className="text-xs bg-green-50 text-green-700 border border-green-200 font-semibold px-2.5 py-1 rounded-full">Connected</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
