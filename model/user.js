const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  // username: {
  //     type: String,
  //     unique: true,
  //     required: true,
  // },
  email: String,
  password: String,
  fullName: String,
  address: String,
  Mobile: Number,
  dob: String,
  gender: {
    type: String,
    enum: ["male", "female", "other"],
  },
  flatNo: { type: String },
  addressLine1: { type: String },
  addressLine2: { type: String },
  city: { type: String },
  state: { type: String },
  zip: { type: String },
  foodInventory: [
    {
      foodItem: { type: String },
      quantity: { type: Number },
    },
  ],
  approved: { type: Boolean, default: false },
  // googleId: String,
  // profile: String,
  resetTokenExpiration: Date,
  resetToken:String
});

const User = new mongoose.model("User", userSchema);
module.exports = User;
