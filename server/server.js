/******************************* DEFAULT MODULES ******************************/

var path = require('path');

/******************************* NPM MODULES **********************************/

var express = require('express');
var Mongoose = require('mongoose');
var bodyParser = require('body-parser');

/*************************** IMPORT ROUTES/WEBHOOKS ***************************/

var routes = {
  'createPayment': require('./routes/createPayment.js').createPayment,
  'updatePayment': require('./routes/updatePayment.js').updatePayment
};

/**************************** ENVIRONMENT VARIABLES ***************************/

var mongo_host = process.env.MONGOLAB_URI;
var port = process.env.PORT;

/****************************** CONFIGURE SERVER ******************************/

// 1. Connect to MongoDB
Mongoose.connect(mongo_host);
var db = Mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to MongoDB.');
});

// 2. Instantiate the express object
var app = express();

// 3. Set up middleware
app.use(express.static(path.join(__dirname, '../client')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/*************************** HANDLE ROUTES/WEBHOOKS ***************************/

// GET Requests
app.get('/:key/:lookup', routes.updatePayment);

// POST Requests
app.post('/payment/create', routes.createPayment);

/******************************** START SERVER ********************************/

var server = app.listen(port, function() {
  console.log('Listening on port:', port);
});
