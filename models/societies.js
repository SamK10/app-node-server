const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const societySchema = new Schema({
    src: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

var Societies = mongoose.model('Society', societySchema);

module.exports = Societies;