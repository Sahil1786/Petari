const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  item: String,
  quantity: Number,
  donatedAt: { type: Date, default: Date.now }
});

const Donation = mongoose.model('Donation', donationSchema);

module.exports = Donation;
