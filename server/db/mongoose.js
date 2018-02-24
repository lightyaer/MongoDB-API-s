var mongoose = require('mongoose');
var { Todo } = require('../models/todos');
var { User } = require('../models/user');


mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGODB_URI);

module.exports = {
    mongoose
};

