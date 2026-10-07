import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import Rooms from './pages/Rooms';
import Courses from './pages/Courses';
import Allocation from './pages/Allocation';
import Timetable from './pages/Timetable';
import Conflicts from './pages/Conflicts';
import Reports from './pages/Reports';
import Users from './pages/Users';
import Settings from './pages/Settings';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<AuthPage />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/rooms" element={<ProtectedRoute roles={['Administrator', 'Faculty']}><Rooms /></ProtectedRoute>} />
          <Route path="/courses" element={<ProtectedRoute roles={['Administrator', 'Faculty']}><Courses /></ProtectedRoute>} />
          <Route path="/allocation" element={<ProtectedRoute roles={['Administrator']}><Allocation /></ProtectedRoute>} />
          <Route path="/timetable" element={<ProtectedRoute><Timetable /></ProtectedRoute>} />
          <Route path="/conflicts" element={<ProtectedRoute roles={['Administrator']}><Conflicts /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute roles={['Administrator']}><Reports /></ProtectedRoute>} />
          <Route path="/users" element={<ProtectedRoute roles={['Administrator']}><Users /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
