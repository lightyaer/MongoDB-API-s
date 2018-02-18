var mongoose = require('mongoose');
var { Todo } = require('../models/todos');
var { User } = require('../models/user');


mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');




module.exports = {
    mongoose
};