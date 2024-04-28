
const mongoose = require('mongoose');

const indexQuerySchema = mongoose.Schema({
    name: String,
    email: String,
    subject: String,
    message: String
}, { timestamps: true });


const Query = new mongoose.model("Query", indexQuerySchema);

module.exports={
    Query
}