const mongoose = require('mongoose');

const ngoRegisterSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  NGOName: { type: String, required: true },
  Mobile: { type: String, required: true },
  NgoID: { type: String, required: true },
  NgoLocation: { type: String, required: true },
  approved: { type: Boolean, default: false },
  resetTokenExpiration: Date,
  resetToken:String // New field for approval status
});


const NGO = mongoose.model('NGO',ngoRegisterSchema);

module.exports = NGO;