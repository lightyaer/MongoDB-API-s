require('./config/config');
const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const { ObjectID } = require('mongodb');
const bcrypt = require('bcryptjs');

var { mongoose } = require('./db/mongoose');
var { Todo } = require('./models/todos');
var { User } = require('./models/user');
var { authenticate } = require('./middleware/authenticate');
var app = express();
var port = process.env.PORT;

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


app.patch('/todos/:id', (req, res) => {

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

    Todo.findByIdAndUpdate(id, { $set: body }, { new: true })
        .then((todo) => {
            if (!todo) {
                res.status(404).send();
            }
            res.send({ todo });
        }).catch((e) => {
            res.status(400).send();
        })

});

//SIGN UP, add new user and generate token for user
app.post('/users', (req, res) => {

    var body = _.pick(req.body, ['email', 'password']);

    var newUser = new User(body);

    newUser.save().then(() => {
        return newUser.generateAuthToken();

    }).then((token) => {
        res.status(200).header('x-auth', token).send(newUser);
    }).catch((e) => {
        res.status(400).send(e);
    });
});

//Authenticate the token in the Header && get the user credential for the token
app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

//LOGIN, get the user from db, generate a new token for user and send it in the reponse
app.post('/users/login', (req, res) => {

    var body = _.pick(req.body, ['email', 'password']);

    User.findByCredentials(body.email, body.password).then((user) => {
        user.generateAuthToken().then((token) => {
            res.status(200).header('x-auth', token).send(user);
        });

    }).catch(() => {
        res.send(400).send();
    });

});

//LOGOUT , remove the token assoiated with the user
app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }, () => {
        res.status(400).send();
    })
});

app.listen(port, () => {
    console.log(`Started on port ${port}`);
});


module.exports = {
    app
}


