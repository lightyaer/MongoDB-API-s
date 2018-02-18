const { MongoClient, ObjectID } = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {

    if (err) {
        return console.log('Unable to Connect to MongoDB Server')
    }
    console.log('Connected to MongoDb Server');
    var db = client.db('TodoApp');

    // db.collection('Todos').find().count().then(count => {
    //     console.log('Todos Count');
    //     console.log(count);
    // }, (err) => {
    //     console.log(err);
    // })


    db.collection('Users').find({
        name: 'Jen'
    }).toArray().then(docs => {
        console.log('Todos');
        console.log(JSON.stringify(docs, undefined, 2))
    }, (err) => {
        console.log(err);
    })
    // db.collection('Todos').insertOne({
    //     text: 'Something to do',
    //     completed: false
    // }, (err, result) => {
    //     if (err) {
    //         return console.log('Unable to insert Todos', err)
    //     }
    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // })

    // db.collection('Users').insertOne({
    //     name: 'Dhananjay',
    //     age: 23,
    //     Location: 'Bangalore'
    // }, (err, result) => {
    //     if (err) {
    //         return console.log('Unable to insert Users', err)
    //     }
    //     console.log(JSON.stringify(result.ops[0]._id.getTimestamp(), undefined, 2));
    // })

    client.close();
});