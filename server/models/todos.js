var mongoose = require('mongoose');

var Todo = mongoose.model('Todo', {
    text: {
        type: String,
        required: [true, 'Text is required'],
        minlength: 2,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Number,
        default: null
    },
    _author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    }
});

module.exports = { Todo }