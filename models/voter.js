const mongoose = require("mongoose");

const VoterSchema = new mongoose.Schema({
    voterId: {
        type: String,
        required: true,
        unique: true
        },
    voterName: {
        type: String,
        required: true,
    },
});

const Voter = mongoose.model("Voter", VoterSchema);
module.exports = Voter;