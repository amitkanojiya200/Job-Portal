// src/components/Navbar.js
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">JOB-PORTAL</Link>
        
        <div className="flex items-center space-x-4">
          <Link to="/" className="hover:text-blue-200">Home</Link>
          
          {!user ? (
            <>
              <Link to="/login" className="hover:text-blue-200">Login</Link>
              <Link to="/signup" className="hover:text-blue-200">Signup</Link>
            </>
          ) : (
            <>
              {user.role === 'employer' && (
                <>
                  <Link to="/employer/dashboard" className="hover:text-blue-200">Dashboard</Link>
                  <Link to="/employer/create-job" className="hover:text-blue-200">Post Job</Link>
                </>
              )}
              
              {user.role === 'applicant' && (
                <Link to="/applicant/dashboard" className="hover:text-blue-200">Dashboard</Link>
              )}
              
              {user.role === 'admin' && (
                <Link to="/admin/dashboard" className="hover:text-blue-200">Admin</Link>
              )}
              
              <button 
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;