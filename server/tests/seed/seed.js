const jwt = require('jsonwebtoken');
const { ObjectID } = require('mongodb');
const { Todo } = require('../../models/todos');
const { User } = require('../../models/user');

const userOneID = new ObjectID();
const userTwoID = new ObjectID();

const users = [
    {
        _id: userOneID,
        email: 'example@example.com',
        password: 'userOnePass',
        tokens: [{
            access: 'auth',
            token: jwt.sign({ _id: userOneID, access: 'auth' }, 'ABC123').toString()
        }]
    }, {
        _id: userTwoID,
        email: 'example@gmail.com',
        password: 'userTwoPass',
        tokens: [{
            access: 'auth',
            token: jwt.sign({ _id: userTwoID, access: 'auth' }, 'ABC123').toString()
        }]
    }
]

const todos = [
    {
        _id: new ObjectID(),
        text: 'First test Todo',
        _author: userOneID
    }, {
        _id: new ObjectID(),
        text: 'Second test Todo',
        completed: 'true',
        compltedAt: '999',
        _author: userTwoID
    }
]

const populateTodos = (done) => {
    Todo.remove({}).then(() => {
        Todo.insertMany(todos).then(() => {
            done();
        });
    });
}

const populateUsers = (done) => {
    User.remove({}).then(() => {
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();

        return Promise.all([userOne, userTwo]);
    }).then(() => {
        done();
    })
}

module.exports = {
    todos,
    populateTodos,
    users,
    populateUsers
}