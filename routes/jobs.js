const express = require('express');
const router = express.Router();
const Job = require('../models/job');
const authMiddleware = require('../middleware/authMiddleware');

// Create a job post (Employer only)
router.post('/create', authMiddleware, async (req, res) => {
  if (req.user.role !== 'employer') {
    return res.status(403).json({ message: 'Only employers can post jobs' });
  }

  const { title, description, company, location } = req.body;

  try {
    const job = new Job({
      title,
      description,
      company,
      location,
      createdBy: req.user._id,
    });

    await job.save();
    res.status(201).json({ message: 'Job posted successfully', job });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Function to Get all jobs here....
router.get('/', async (req, res) => {
    try {
      const jobs = await Job.find().populate('createdBy', 'name email');
      res.json(jobs);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });


// Function to Apply to a job (Applicant only)
router.post('/:id/apply', authMiddleware, async (req, res) => {
    if (req.user.role !== 'applicant') {
      return res.status(403).json({ message: 'Only applicants can apply' });
    }
  
    try {
      const job = await Job.findById(req.params.id);
      if (!job) return res.status(404).json({ message: 'Job not found' });
  
      // Prevent duplicate applications
      if (job.applicants.includes(req.user._id)) {
        return res.status(400).json({ message: 'You have already applied to this job' });
      }
  
      job.applicants.push(req.user._id);
      await job.save();
  
      res.json({ message: 'Applied successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  
// Function to Get jobs created by the logged-in employer
router.get('/employer', authMiddleware, async (req, res) => {
    if (req.user.role !== 'employer') {
      return res.status(403).json({ message: 'Only employers can view their jobs' });
    }
  
    try {
      const jobs = await Job.find({ createdBy: req.user._id });
      res.json(jobs);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });
  

// Function to Get jobs applied to by the logged-in applicant
router.get('/applied', authMiddleware, async (req, res) => {
    if (req.user.role !== 'applicant') {
      return res.status(403).json({ message: 'Only applicants can view their applications' });
    }
  
    try {
      const jobs = await Job.find({ applicants: req.user._id });
      res.json(jobs);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });
  

// Function to Get a single job by ID
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('createdBy', 'name email');
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
