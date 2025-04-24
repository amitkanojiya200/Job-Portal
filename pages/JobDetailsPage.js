// src/pages/JobDetailsPage.js
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const JobDetailsPage = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applying, setApplying] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/jobs/${id}`);
        setJob(res.data);
        
        // Check if user has already applied
        if (user && user.role === 'applicant' && res.data.applicants) {
          const hasApplied = res.data.applicants.includes(user.id);
          setApplicationStatus(hasApplied ? 'applied' : null);
        }
        
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch job details');
        setLoading(false);
      }
    };

    fetchJob();
  }, [id, user]);

  const handleApply = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    try {
      setApplying(true);
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/jobs/${id}/apply`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApplicationStatus('applied');
      setApplying(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to apply');
      setApplying(false);
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
  if (!job) return <div className="text-center py-10">Job not found</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
        <div className="mb-2 text-xl text-gray-600">{job.company}</div>
        <div className="mb-6 text-gray-500">{job.location}</div>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Job Description</h2>
          <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Posted on {new Date(job.createdAt).toLocaleDateString()}
          </div>
          
          {user && user.role === 'applicant' && (
            applicationStatus === 'applied' ? (
              <div className="bg-green-100 text-green-700 px-4 py-2 rounded">
                You have applied to this job
              </div>
            ) : (
              <button
                onClick={handleApply}
                disabled={applying}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-blue-400"
              >
                {applying ? 'Applying...' : 'Apply Now'}
              </button>
            )
          )}
          
          {user && user.role === 'employer' && job.createdBy === user.id && (
            <div className="text-blue-600">
              Your posting • {job.applicants?.length || 0} applicants
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetailsPage;