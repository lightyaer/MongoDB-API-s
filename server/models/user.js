var mongoose = require('mongoose');

var User = mongoose.model('User',{
    email: {
        type: String,
        minlength:2,
        required:[true, 'Email not entered'],
        trim: true
    }
});

module.exports.User = User;