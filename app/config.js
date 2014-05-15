var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/test');//TODO:fix the url

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log('connected to MongoDB');
});

module.exports =  db;
