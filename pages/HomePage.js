// src/pages/HomePage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const HomePage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/jobs');
        setJobs(res.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch jobs');
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div>
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2">Find Your Dream Job</h1>
        <p className="text-gray-600">Browse through hundreds of job opportunities</p>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map(job => (
          <div key={job._id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-bold mb-2">{job.title}</h2>
            <div className="mb-2 text-gray-600">{job.company}</div>
            <div className="mb-4 text-gray-500">{job.location}</div>
            <p className="mb-4 text-gray-700 line-clamp-3">{job.description}</p>
            <Link 
              to={`/job/${job._id}`} 
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
      
      {jobs.length === 0 && (
        <div className="text-center py-10 text-gray-500">No jobs available at the moment</div>
      )}
    </div>
  );
};

export default HomePage;