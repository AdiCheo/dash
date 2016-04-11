/**
 * GET /
 * Home page.
 */
/**
 * Split into declaration and initialization for better startup performance.
 */
var validator;
var cheerio;
var graph;
var LastFmNode;
var tumblr;
var foursquare;
var Github;
var Twit;
var stripe;
var twilio;
var Linkedin;
var BitGo;
var clockwork;
var paypal;
var lob;
var ig;
var Y;
var request;
var Asana;
// var util;
// var passport = require('passport');
var passportConf = require('../config/passport');
var apiController = require('./api');

var _ = require('lodash');
var async = require('async');
var querystring = require('querystring');

exports.index = function(req, res, next) {
  async.parallel({
    instagram: function(done) {
      apiController.getInstagram(req, res, function(err, results, limit) {
        done(err, results);
      });
    },
    // asana: function(done) {
    //   apiController.getAsana(req, res, function(err, results, limit) {
    //     done(err, results);
    //   });
    // },
    nyt: function(done) {
      apiController.getNewYorkTimes(req, res, function(err, results, limit) {
        done(err, results);
      });
    },
    twitter: function(done) {
      apiController.getTwitter(req, res, function(err, results, limit) {
        done(err, results);
      });
    },
    linkedin: function(done) {
      apiController.getLinkedin(req, res, function(err, results, limit) {
        done(err, results);
      });
    },
    facebook: function(done) {
      apiController.getFacebook(req, res, function(err, results, limit) {
        done(err, results);
      });
    }
  },
  function(err, results) {
    if (err) {
      return next(err);
    }
    res.render('home', {
      title: 'Dashboard',
      
      // links: results.asana.getAsanaTasks.links,
      // dates: results.asana.getAsanaTasks.dates,
      
      me: results.facebook.getMe,
      friends: results.facebook.getMyFriends,
      
      profile: results.getLinkedIn,
      
      // tweets: results.getTwitter.statuses,
      
      usernames: results.instagram.searchByUsername,
      userById: results.instagram.searchByUserId,
      popularImages: results.instagram.popularImages,
      myRecentMedia: results.instagram.myRecentMedia
    });
  });
};