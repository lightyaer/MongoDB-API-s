const { MongoClient, ObjectID } = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {

    if (err) {
        return console.log('Unable to Connect to MongoDB Server')
    }
    console.log('Connected to MongoDb Server');
    var db = client.db('TodoApp');

    //delete  Many 

    // db.collection('Users')
    //     .deleteMany({ name : 'Dhananjay' })
    //     .then(result => {
    //         console.log(result);
    //     })

    //delete one

    // db.collection('Todos').deleteOne({ text: 'Eat lunch' })
    //     .then(result => {
    //         console.log(result);
    //     });



    //find one and delete

    // db.collection('Users')
    //     .findOneAndDelete({ _id: new ObjectID('5a8941e025f442071888767a') })
    //     .then((doc) => {
    //         console.log(doc);
    //     })



    client.close();
});