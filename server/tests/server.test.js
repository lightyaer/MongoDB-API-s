const expect = require('expect');
const request = require('supertest');

const { ObjectID } = require('mongodb');
const { app } = require('./../server');
const { Todo } = require('./../models/todos');
const { User } = require('./../models/user');
const { todos, populateTodos, users, populateUsers } = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    var text = 'Test todo text';

    request(app)
      .post('/todos')
      .send({ text })
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find({ text }).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should not create todo with invalid body data', (done) => {
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(3);
          done();
        }).catch((e) => done(e));
      });
  });
});


describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(3);
      })
      .end(done);
  })
})


describe('GET /todos:id', () => {
  it('should return todo doc', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text)
      })
      .end(done);
  });


  it('should return 404 if todo not found', (done) => {

    request(app)
      .get(`/todos/${new ObjectID().toHexString()}`)
      .expect(404)
      .end(done);

  })

  it('should return 404 on non ObjectIDs', (done) => {

    request(app)
      .get(`/todos/123`)
      .expect(404)
      .end(done);

  })
});


describe('DELETE /todos/:id', () => {

  it('Should delete the todo by id', (done) => {
    var hexID = todos[1]._id.toHexString();
    request(app)
      .delete(`/todos/${hexID}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(hexID);
      }).end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.findById(hexID).then((todo) => {
          expect(todo).toBeFalsy();
          done();
        }).catch((e) => {
          done(e);
        });


      })


  });

  it('Should return 404 id todo not found', (done) => {
    request(app)
      .delete(`/todos/${new ObjectID().toHexString()}`)
      .expect(404)
      .end(done);

  });

  it('return 404 if ObjectID is not valid', (done) => {
    request(app)
      .delete(`/todos/123`)
      .expect(404)
      .end(done);
  });



});


describe('PATCH /todos/:id', () => {

  it('should update the Todo', (done) => {
    var id = todos[0]._id.toHexString();
    var updatedTodo = {
      text: 'Updated from test',
      completed: true
    }

    request(app)
      .patch(`/todos/${id}`)
      .send(updatedTodo)
      .expect(200)
      .expect((res) => {

        expect(typeof res.body.todo.completedAt).toBe('number');

        expect(res.body.todo.text)
          .toBe(updatedTodo.text)


      }).end(done);
  });


  it('should clear completedAt when todo is not completed', (done) => {

    var body = todos[1];
    body.completed = false;
    body.text = "testing for completedAt"

    request(app)
      .patch(`/todos/${body._id}`)
      .send(body)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(body.text);
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toBeFalsy();

      }).end(done);

  });


})


describe('GET /users/me', () => {

  it('should return user if authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it('should return a 401 if not authenticated', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});
      })
      .end(done);
  });
})


describe('POST /user', () => {
  it('should create a user', (done) => {
    var email = 'example@exam.com';
    var password = '123mnb!';

    request(app)
      .post('/users')
      .send({ email, password })
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeTruthy();
        expect(res.body._id).toBeTruthy();
        expect(res.body.email).toBe(email);
      })
      .end(err => {
        if (err) {
          return done(err);
        }

        User.findOne({ email }).then((user) => {
          expect(user).toBeTruthy();
          expect(user.password).not.toBe(password);
          done();
        }).catch((e) => {
          done(e);
        });

      });

  });

  it('should return validation error if request in valid', (done) => {

    var email = 'examplexam.com';
    var password = '123mnb!';

    request(app)
      .post('/users')
      .send({ email, password })
      .expect(400)
      .expect(res => {
        expect(res.body.errors.email.message).toBe(`${email} is not a valid email`);
      }).end(done);
  });

  it('should not create a user if email in use ', (done) => {
    var email = 'example@example.com';
    var password = '123mnb!';

    request(app)
      .post('/users')
      .send({ email, password })
      .expect(400)
      .expect(res => {
        expect(res.body.code).toBe(11000);
      }).end(done);

  });


});

describe('POSt /users/login ', () => {

  it('should login user adn return auth token ', (done) => {

    request(app)
      .post('/users/login')
      .send({

        email: users[1].email,
        password: users[1].password
      })
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeTruthy();

      }).end((err, res) => {
        if (err) {
          done(err);
        }

        User.findById(users[1]._id).then((user) => {

          expect(user.tokens[0]).toMatchObject({
            access: 'auth',
            token: res.headers['x-auth']
          });

          done();
        }).catch((e) => {
          done(e);
        });

      })

  });

  it('should reject invalid login ', (done) => {

    request(app)
      .post('/users/login')
      .send({

        email: users[1].email,
        password: users[1].password + '1'
      })
      .expect(400)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeFalsy();

      }).end((err, res) => {
        if (err) {
          done(err);
        }

        User.findById(users[1]._id).then((user) => {

          expect(user.tokens.length).toBe(0)

          done();
        }).catch((e) => {
          done(e);
        });

      })

  });

});