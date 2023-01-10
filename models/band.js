const mongoose = require('mongoose');

const bandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  votes: {
    type: Number,
  }
});

const Band = mongoose.model('Band', bandSchema);

module.exports = Band;
