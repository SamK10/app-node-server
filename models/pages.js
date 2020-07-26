const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pageSchema = new Schema({
    cover_url: {
        type: String,
        required: false
    },
    src: {
        type: String,
        required: false
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