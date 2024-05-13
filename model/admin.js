const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({

   email: String,
   password: String,
   fullName: String,
   Mobile: Number,
})

const Admin = mongoose.model('Admin', AdminSchema);

module.exports = Admin;