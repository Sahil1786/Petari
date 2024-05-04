const mongoose = require('mongoose');

const querySchema = new mongoose.Schema({
    name: String,
    email: String,
    subject: String,
    message: String
}, { timestamps: true });

const Query = mongoose.model('Query', querySchema);

module.exports = Query;
