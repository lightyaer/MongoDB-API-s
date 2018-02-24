var express = require('express');
var bodyParser = require('body-parser');


var { mongoose } = require('./db/mongoose');
var { Todo } = require('./models/todos');
var { User } = require('./models/user');
var { ObjectID } = require('mongodb');
var app = express();
var port = process.env.PORT || 3000;

// var env = process.env.NODE_ENV || 'development';
// console.log('env *****', env);
// if( env === 'development') {
//   process.env.PORT = 3000;
//   process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';

// } else if( env === 'test') {
//   process.env.PORT = 3000;
//   process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
// } else if( env === 'production' ) {
//   process.env.MONGODB_URI = 'mongodb://todoappuser:todoappuser@mlab@ds245228.mlab.com:45228/todos-app'
// }



app.use(bodyParser.json());



app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text
    });
    todo.save().then((doc) => {
        res.status(200).send(doc);
    }, (e) => {
        res.status(400).send(e);
    })
});

app.get('/todos', (req, res) => {

    Todo.find().then(todos => {
        res.status(200).send({ todos })
    }, (e) => {
        res.status(400).send(e);
    });

});

app.get('/todos/:id', (req, res) => {

    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send("ID not Valid")

    }

    Todo.findById(id).then((todo) => {
        if (todo) {
            return res.status(200).send({ todo });
        }
        return res.status(404).send();
    }).catch((e) => {
        return res.status(404).send();
    });

});


app.delete('/todos/:id', (req, res) => {
    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send("ID not Valid")

    }
    Todo.findByIdAndRemove(id).then((todo) => {

        if (!todo) {
            return res.status(404).send('Todo not found');
        }
        return res.status(200).send({ todo });


    }).catch((e) => {
        return res.status(400).send();
    });

});


app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

module.exports = {
    app
}


