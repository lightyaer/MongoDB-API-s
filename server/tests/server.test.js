const expect = require('expect');
const request = require('supertest');

const { app } = require('./../server');
const { Todo } = require('./../models/todos');

const todos = [{
  text: 'First test Todo'
}, {
  text: 'Second test Todo'
}, {
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


