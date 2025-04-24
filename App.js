// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import "./index.css";

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import EmployerDashboard from './pages/EmployerDashboard';
import ApplicantDashboard from './pages/ApplicantDashboard';
import AdminDashboard from './pages/AdminDashboard';
import CreateJobPage from './pages/CreateJobPage';
import JobDetailsPage from './pages/JobDetailsPage';
import Navbar from './components/Navbar';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/job/:id" element={<JobDetailsPage />} />
            
            <Route 
              path="/employer/*" 
              element={
                <PrivateRoute allowedRoles={['employer']}>
                  <Routes>
                    <Route path="dashboard" element={<EmployerDashboard />} />
                    <Route path="create-job" element={<CreateJobPage />} />
                  </Routes>
                </PrivateRoute>
              } 
            />
            
            <Route 
              path="/applicant/*" 
              element={
                <PrivateRoute allowedRoles={['applicant']}>
                  <Routes>
                    <Route path="dashboard" element={<ApplicantDashboard />} />
                  </Routes>
                </PrivateRoute>
              } 
            />
            
            <Route 
              path="/admin/*" 
              element={
                <PrivateRoute allowedRoles={['admin']}>
                  <Routes>
                    <Route path="dashboard" element={<AdminDashboard />} />
                  </Routes>
                </PrivateRoute>
              } 
            />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;