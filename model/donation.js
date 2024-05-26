const mongoose = require('mongoose');

const DonationSchema = new mongoose.Schema({
  type: String,
  quantity: Number,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Donation', DonationSchema);
