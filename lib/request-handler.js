var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');

var db = require('../app/config');
var User = require('../app/models/user');
var Link = require('../app/models/link');
// var Users = require('../app/collections/users');
// var Links = require('../app/collections/links');

exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function(){
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  Link.find({}, function(err, links) {
    res.send(200, links);
  });
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.send(404);
  }

  Link.findOne({ url: uri }, 'url', function(error, link){
    if (link) {
      res.send(200, found.attributes);
    } else {
      util.getUrlTitle(uri, function(err, title) {
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.send(404);
        }
        var newlink = new Link({
          url: uri,
          title: title,
          baseUrl: req.headers.origin
        });

        newlink.save(function(err,addedlink){
          res.send(200, addedlink);
        });
      });
    }
  });
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  console.log('user db', User);

  User.findOne({username: username}, 'username password', function(err, user){
    if (!user) {
      console.log('user does not exist');
      res.redirect('/login');
    } else {
      console.log('comparing password', password, user);
      user.comparePassword(password, function(match) {
        if (match) {
          util.createSession(req, res, user);
        } else {
          console.log('wrong password');
          res.redirect('/login');
        }
      });
    }
  });
};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({ username: username }, 'username', function(err, user){
    if (!user) {
      var newUser = new User({
        username: username,
        password: password
      });
      newUser.hashPassword();

      console.log('new user', newUser);

      newUser.save(function(err, saveduser){
        util.createSession(req, res, saveduser);
        console.log('saved user password', saveduser);
      });
    } else {
      console.log('Account already exists');
      res.redirect('/signup');
    }
  });
};

exports.navToLink = function(req, res) {
  Link.findOne({ code: req.params[0] }, 'url visit', function(error, link){
    if (!link) {
      res.redirect('/');
    } else {
      link.visit += 1;
      link.save(function(error, savedlink) {
        return res.redirect(savedlink.url);
      });
    }
  });
};
