const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const artSchema = new Schema({
    image: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

var Arts = mongoose.model('Art', artSchema);

module.exports = Arts;