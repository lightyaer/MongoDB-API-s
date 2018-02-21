const { mongoose } = require('../server/db/mongoose');
const { Todo } = require('../server/models/todos');
const { ObjectID } = require('mongodb');
const { User } = require('../server/models/user');

var UserID = '5a89b6a2a6eb5618acdc0bea';
var id = '5a8c6bbf8db09911544a1288';
if (ObjectID.isValid(id) && ObjectID.isValid(UserID)) {


    // Todo.find({
    //     _id: id
    // }).then((todos) => {
    //     if(!todos){
    //         return console.log('ID not found')
    //     }
    //     console.log('Todos', todos);
    // });

    // Todo.findOne({
    //     _id: id
    // }).then((todo) => {
    //     if(!todo){
    //         return console.log('ID not found')
    //     }
    //     console.log('Todo', todo);
    // })

    Todo.findById(id).then((todo) => {
        if (!todo) {
            return console.log('ID not found')
        }
        console.log('Todo by ID', todo);
    }).catch((e) => console.log(e))



    User.findById(UserID).then((user) => {
        if (!user) {
            return console.log('User not found');
        } console.log('User by ID ', user);
    }).catch((e) => console.log(e));

} else {
    console.log('ID not Valid');
}
