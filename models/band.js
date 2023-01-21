const mongoose = require('mongoose');

const bandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    votes: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Band', bandSchema);
