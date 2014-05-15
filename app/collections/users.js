// NOTE: this file is not needed when using MongoDB
var db = require('../config');
var User = require('../models/user');

var Users = Backbone.Collection.extend({
  model: User
});

module.exports = Users;
