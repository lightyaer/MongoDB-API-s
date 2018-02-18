const { MongoClient, ObjectID } = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {

    if (err) {
        return console.log('Unable to Connect to MongoDB Server')
    }
    console.log('Connected to MongoDb Server');
    var db = client.db('TodoApp');

    // db.collection('Todos').findOneAndUpdate({
    //     _id: new ObjectID('5a8951b8d718ff009411f7e1')
    // }, {
    //         $set: {
    //             completed: true
    //         }
    //     }, {
    //         returnOriginal: false
    //     }).then(result => {
    //         console.log(result);
    //     });

    db.collection('Users').findOneAndUpdate({
        name: 'Dhananjay'
    }, {
            $set: {
                Location: 'Mumbai'
            },
            $inc: {
                age: -1
            },

        }, {
            returnOriginal: false
        }).then(result => {
            console.log(result);
        })

    client.close();
});