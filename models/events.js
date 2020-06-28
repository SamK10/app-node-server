const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    src: {
        type: String,
        required: true
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
    }
}, {
    timestamps: true
});

var Events = mongoose.model('Event', eventSchema);

module.exports = Events;