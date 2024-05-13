const mongoose = require("mongoose");

const querySchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    subject: String,
    message: String,
    approved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Query = mongoose.model("Query", querySchema);

module.exports = Query;
