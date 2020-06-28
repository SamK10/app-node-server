var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var saveSchema = new Schema({
    user: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post'
        }
    ]
},
    {
        timestamps: true
    }
);

var Saves = mongoose.model('Save', saveSchema);

module.exports = Saves;