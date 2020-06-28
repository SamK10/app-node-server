const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    details: {
        type: String,
        required: true
    },
    avatar_url: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

var Posts = mongoose.model('Post', postSchema);

module.exports = Posts;