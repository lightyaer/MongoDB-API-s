require('./config/config');
const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const { ObjectID } = require('mongodb');
const bcrypt = require('bcryptjs');
const cors = require('cors');

var { mongoose } = require('./db/mongoose');
var { Todo } = require('./models/todos');
var { User } = require('./models/user');
var { authenticate } = require('./middleware/authenticate');
var app = express();
var port = process.env.PORT;

app.use(bodyParser.json());
app.use(cors())


//#region Todo

app.post('/todos', authenticate, async (req, res) => {

    try {
        var todo = new Todo({
            text: req.body.text,
            _author: req.user._id
        });
        const doc = await todo.save()
        res.status(200).send(doc);
    } catch (e) {
        res.status(400).send(e);
    }

});


app.get('/todos', authenticate, async (req, res) => {

    try {
        const todos = await Todo.find({ _author: req.user._id })
        res.status(200).send({ todos })
    } catch (e) {
        res.status(400).send(e);
    }

});


app.get('/todos/:id', authenticate, async (req, res) => {


    try {
        var id = req.params.id;

        if (!ObjectID.isValid(id)) {
            return res.status(404).send("ID not Valid")

        }
        const todo = await Todo.findOne({ _id: id, _author: req.user._id })
        if (todo) {
            return res.status(200).send({ todo });
        }
        return res.status(404).send();
    } catch (e) {
        return res.status(404).send();
    }


});


app.delete('/todos/:id', authenticate, async (req, res) => {

    try {
        var id = req.params.id;

        if (!ObjectID.isValid(id)) {
            return res.status(404).send("ID not Valid")

        }

        const todo = await Todo.findOneAndRemove({ _id: id, _author: req.user._id })
        if (!todo) {
            return res.status(404).send('Todo not found');
        }
        return res.status(200).send({ todo });

    } catch (e) {
        return res.status(400).send();
    }

});


app.patch('/todos/:id', authenticate, async (req, res) => {

    try {
        var id = req.params.id;
        var body = _.pick(req.body, ['text', 'completed']);
        if (!ObjectID.isValid(id)) {
            return res.status(404).send("ID not Valid")
        }

        if (_.isBoolean(body.completed) && body.completed) {
            body.completedAt = new Date().getTime();

        } else {
            body.completed = false;
            body.completedAt = null;
        }
        const todo = await Todo.findOneAndUpdate({ _id: id, _author: req.user._id }, { $set: body }, { new: true })
        if (!todo) {
            return res.status(404).send();
        }
        return res.send({ todo });
    } catch (e) {
        res.status(400).send();
    }

});

//#endregion

//#region User

//SIGN UP, add new user and generate token for user
app.post('/users', async (req, res) => {

    try {
        var body = _.pick(req.body, ['email', 'password']);
        var newUser = new User(body);
        await newUser.save()
        const token = await newUser.generateAuthToken();
        res.status(200).header('x-auth', token).send(newUser);
    } catch (e) {
        res.status(400).send(e);
    }

});

//Authenticate the token in the Header && get the user credential for the token
app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

//LOGIN, get the user from db, generate a new token for user and send it in the response
app.post('/users/login', async (req, res) => {

    try {
        const body = _.pick(req.body, ['email', 'password']);
        const user = await User.findByCredentials(body.email, body.password)
        const token = await user.generateAuthToken()
        res.status(200).header('x-auth', token).send(user);
    } catch (e) {
        res.status(400).send();
    }

});

//LOGOUT , remove the token assoiated with the user
app.delete('/users/me/token', authenticate, async (req, res) => {
    try {
        await req.user.removeToken(req.token)
        res.status(200).send();
    } catch (e) {
        res.status(400).send();
    }

});

//#endregion

app.listen(port, () => {
    console.log(`Started on port ${port}`);
});


module.exports = {
    app
}


