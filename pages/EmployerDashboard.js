// src/pages/EmployerDashboard.js
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const EmployerDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchEmployerJobs = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/jobs/employer', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setJobs(res.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch your job listings');
        setLoading(false);
      }
    };

    fetchEmployerJobs();
  }, []);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Employer Dashboard</h1>
        <Link 
          to="/employer/create-job" 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Post New Job
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold mb-2">Welcome, {user?.name}!</h2>
        <p className="text-gray-600">Manage your job postings and view applicants from this dashboard.</p>
      </div>
      
      <h2 className="text-xl font-semibold mb-4">Your Job Listings</h2>
      
      {jobs.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-600 mb-4">You haven't posted any jobs yet.</p>
          <Link 
            to="/employer/create-job" 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Post Your First Job
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map(job => (
            <div key={job._id} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-2">{job.title}</h3>
              <div className="mb-2 text-gray-600">{job.company}</div>
              <div className="mb-4 text-gray-500">{job.location}</div>
              <p className="mb-4 text-gray-700 line-clamp-2">{job.description}</p>
              
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-sm text-gray-500">Posted: {new Date(job.createdAt).toLocaleDateString()}</span>
                  <span className="ml-4 text-sm text-blue-600">{job.applicants?.length || 0} applicants</span>
                </div>
                <Link 
                  to={`/job/${job._id}`} 
                  className="text-blue-600 hover:underline"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmployerDashboard;