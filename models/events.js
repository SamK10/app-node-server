const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    src: {
        type: String,
        required: false
    },
    title: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
}, {
    timestamps: true
});

var Events = mongoose.model('Event', eventSchema);

module.exports = Events;