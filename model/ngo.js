const mongoose = require('mongoose');

const ngoRegisterSchema = new mongoose.Schema({
  username: String,
  password: String,
  NGOName: String,
  Mobile: Number,
  NgoID: String,
  NgoLocation: String,
  approved: { type: Boolean, default: false }
});

const NGO = mongoose.model('NGO',ngoRegisterSchema);

module.exports = NGO;