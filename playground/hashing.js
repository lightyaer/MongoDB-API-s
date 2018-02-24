const { SHA256 } = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = '123abc!';

bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
        console.log(hash);
    });
});

var hashedPassword = '$2a$10$HbMl.MBCUPyZ8ux5gqgq.uSE7PoP6sNTMw.MW/y/5P1jw3r2SwNjK';
bcrypt.compare('123abc', hashedPassword, (err, res) => {
    
        console.log(res);
    
})

// var data ={
//     id : 10
// }

// var token = jwt.sign(data, '123abc');
// console.log(token);

// var decoded = jwt.verify(token,'123abc')
// console.log('Decoded : '+ JSON.stringify(decoded));

// var message = 'I am Dhananjay Naik';

// var hash = SHA256(message).toString();

// console.log(`Message : ${message}`);
// console.log(`HASH : ${hash}`);


// var data = {
//     id: 4
// }

// var token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// }

// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(token.data)).toString();

// var resulthash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();

// if (resulthash === token.hash) {
//     console.log('Data was not changed');
// } else {
//     console.log('Data was changed , Dont trust');
// }