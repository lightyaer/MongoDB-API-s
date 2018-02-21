var mongoose = require('mongoose');
var { Todo } = require('../models/todos');
var { User } = require('../models/user');


mongoose.Promise = global.Promise;

let db = {
    localhost: 'mongodb://localhost:27017/TodoApp',
    mlab: 'mongodb://todoappuser:todoappuser@ds245228.mlab.com:45228/todos-app'
  };
//'mongodb://todoappuser:todoappuser@ds245228.mlab.com:45228/todos-app'
//process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp'
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp');

module.exports = {
    mongoose
};