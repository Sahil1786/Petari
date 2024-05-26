const express = require('express');
const Donation = require('../model/donation');
const router = express.Router();
const { spawn } = require('child_process');

router.post('/voice-command', (req, res) => {
  const { command } = req.body;
  
  // Call the Python script for NLP
  const pythonProcess = spawn('python', ['./python/nlp.py', command]);

  pythonProcess.stdout.on('data', (data) => {
    const result = JSON.parse(data.toString());
    if (result.action === 'donate') {
      const donation = new Donation(result.details);
      donation.save((err) => {
        if (err) return res.status(500).send(err);
        return res.status(200).send('Donation recorded successfully.');
      });
    } else {
      return res.status(200).send('Action not recognized.');
    }
  });
});

module.exports = router;
