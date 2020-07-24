const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pageSchema = new Schema({
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

var Pages = mongoose.model('Page', pageSchema);

module.exports = Pages;