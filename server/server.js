var express = require('express');
var bodyParser = require('body-parser');


var { mongoose } = require('./db/mongoose');
var { Todo } = require('./models/todos');
var { User } = require('./models/user');
var { ObjectID } = require('mongodb');
var app = express();

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
        res.status(404).send("ID not Valid")
        return console.log('ID not valid');
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



app.listen(3000, () => {
    console.log('Started on Port 3000');
});

module.exports = {
    app
}