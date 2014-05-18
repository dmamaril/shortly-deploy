var db = require('../config');
var crypto = require('crypto');
var mongoose = require('mongoose');

var link = mongoose.Schema({
  url: String,
  id : Number,
  baseUrl: String,
  code: String,
  title: String,
  visit: Number
});

link.pre('save', function(next){
  var shasum = crypto.createHash('sha1');
  shasum.update(this.get('url'));
  this.set('code', shasum.digest('hex').slice(0, 5));
  next();
});

var Link = mongoose.model('Link', link);


// var Link = db.Model.extend({
//   tableName: 'urls',
//   hasTimestamps: true,
//   defaults: {
//     visits: 0
//   },
//   initialize: function(){
//     this.on('creating', function(model, attrs, options){
//       var shasum = crypto.createHash('sha1');
//       shasum.update(model.get('url'));
//       model.set('code', shasum.digest('hex').slice(0, 5));
//     });
//   }
// });

module.exports = Link;
