// src/pages/ApplicantDashboard.js
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const ApplicantDashboard = () => {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/jobs/applied', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAppliedJobs(res.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch your applications');
        setLoading(false);
      }
    };

    fetchAppliedJobs();
  }, []);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div>
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold mb-2">Applicant Dashboard</h1>
        <p className="text-gray-600">Welcome, {user?.name}! Track your job applications here.</p>
      </div>
      
      <h2 className="text-xl font-semibold mb-4">Your Applications</h2>
      
      {appliedJobs.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-600 mb-4">You haven't applied to any jobs yet.</p>
          <Link 
            to="/" 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Browse Jobs
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {appliedJobs.map(job => (
            <div key={job._id} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-2">{job.title}</h3>
              <div className="mb-2 text-gray-600">{job.company}</div>
              <div className="mb-4 text-gray-500">{job.location}</div>
              <p className="mb-4 text-gray-700 line-clamp-2">{job.description}</p>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-green-600">Applied: {new Date(job.updatedAt).toLocaleDateString()}</span>
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
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Recommended Jobs</h2>
        <Link 
          to="/" 
          className="text-blue-600 hover:underline"
        >
          Browse all available jobs
        </Link>
      </div>
    </div>
  );
};

export default ApplicantDashboard;