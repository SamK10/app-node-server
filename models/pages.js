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
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
}, {
    timestamps: true
});

var Pages = mongoose.model('Page', pageSchema);

module.exports = Pages;