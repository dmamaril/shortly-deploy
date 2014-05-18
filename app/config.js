var mongoose = require('mongoose');

//mongoose.connect('mongodb://joe:joe@ds030827.mongolab.com:30827/MongoLab-x06');//TODO:fix the url
mongoose.connect('mongodb://localhost/test');//TODO:fix the url

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log('connected to MongoDB');
});

module.exports =  db;
