const mongoose = require('mongoose');

const ngoRegisterSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  NGOName: { type: String, required: true },
  Mobile: { type: String, required: true },
  NGOID: { type: String, required: true },
  NGOLocation: { type: String, required: true },
  approved: { type: Boolean, default: false } // New field for approval status
});


const NGO = mongoose.model('NGO',ngoRegisterSchema);

module.exports = NGO;