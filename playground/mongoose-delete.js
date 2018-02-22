const { ObjectID } = require('mongodb');

const { mongoose } = require('../server/db/mongoose');
const { Todo } = require('../server/models/todos');
const { User } = require('../server/models/user');


// Todo.remove({}).then(res => {
//     console.log(res);
// })

//find one and remove
// Todo.findOneAndRemove({ _id: '5a8ef83eb79c900690348fd8' }).then(todo => {
//     console.log(todo);
// })


//find by id and remove
Todo.findByIdAndRemove('5a8efd6106944723b8170604').then(todo => {
    console.log(todo);
})