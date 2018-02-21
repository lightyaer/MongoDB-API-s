var mongoose = require('mongoose');
var { Todo } = require('../models/todos');
var { User } = require('../models/user');


mongoose.Promise = global.Promise;

let db = {
    localhost: 'mongodb://localhost:27017/TodoApp',
    mlab: 'mongodb://todoappuser:lightyaer@mlab@ds245228.mlab.com:45228/todos-app'
  };

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp');

module.exports = {
    mongoose
};