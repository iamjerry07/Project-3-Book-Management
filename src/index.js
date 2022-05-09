const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const route = require('./routes/route.js');
const mongoose = require('mongoose');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb+srv://ridhi:ridhi13@cluster0.dh3hp.mongodb.net/Project-3-group-10-db?retryWrites=true&w=majority", {
        useNewUrlParser: true
    })
    .then(() => console.log("MongoDb is connected"))
    .catch(err => console.log(err));

// app.use(
//     function(req, res, next) {
//         const date = new Date();
//         let currDateAndTime = date.toString().split(' ');
//         console.log(currDateAndTime[2], currDateAndTime[1], currDateAndTime[3], currDateAndTime[4], ',', req.ip, ',', req.method, ',', req.path);
//         next();
//     }
// );

app.use('/', route);

app.listen(process.env.PORT || 3000, (err) => {
    console.log("Connected to PORT 3000")
});