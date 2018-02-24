const expect = require('expect');
const request = require('supertest');

const { ObjectID } = require('mongodb');
const { app } = require('./../server');
const { Todo } = require('./../models/todos');

const todos = [{
  _id: new ObjectID(),
  text: 'First test Todo'
}, {
  _id: new ObjectID(),
  text: 'Second test Todo',
  completed: 'true',
  compltedAt: '999'
}, {
  _id: new ObjectID(),
  text: 'Third test Todo'
}]


beforeEach((done) => {
  Todo.remove({}).then(() => {
    Todo.insertMany(todos).then(() => {
      done();
    });

  });

});

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













// const expect = require('expect');
// const request = require('supertest');

// const { app } = require('./../server');
// const { Todo } = require('../models/todos');

// beforeEach((done) => {
//     Todo.remove({}).then(() => {
//         done();
//     })
// });


// describe('POST /todos', () => {

//     it('Should create a new Todo', (done) => {
//         var text = 'Test todo text';

//         request(app)
//             .post('/todos')
//             .send({ text })
//             .expect(200)
//             .expect((res) => {
//                 expect(res.body.text).toBe(text);
//             })
//             .end((err, res) => {

//                 if (err) {
//                     return done(err);
//                 }

//                 Todo.find().then((todos) => {
//                     expect(todos.length).toBe(1);
//                     expect(todos[0].text).toBe(text);
//                     done();
//                 }).catch((e) => {
//                     done(e);
//                 });

//             });
//     });


//     xit('todo doesnt get created on invalid Body', (done) => {
//         request(app)
//             .post('/todos')
//             .send("")
//             .expect(400)

//             .end((err, res) => {
//                 if (err) {
//                     return done(err);
//                 }
//                 done();
//             });
//     });

// });


