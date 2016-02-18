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

var _ = require('lodash');
var async = require('async');
var querystring = require('querystring');

/**
 * GET /
 * Dash page.
 */
exports.index = function(req, res, next) {
  var data = {};
  // Asana
  Asana = require('asana');
  // util = require('util');
  var asana_client = Asana.Client.create({
      clientId: process.env.ASANA_ID,
      clientSecret: process.env.ASANA_SECRET,
      redirectUri: '/auth/asana/callback'
  });
  var token = _.find(req.user.tokens, { kind: 'asana' }).accessToken;
  console.log("user  token " + token);
  // var token = req.cookies.token;
  // console.log("cookietoken " + token);
  asana_client.useOauth({ credentials: token });
  
  var links = [];
  var dates = [];
  
  
  // IG
  ig = require('instagram-node').instagram();

  var token = _.find(req.user.tokens, { kind: 'instagram' });
  ig.use({ client_id: process.env.INSTAGRAM_ID, client_secret: process.env.INSTAGRAM_SECRET });
  ig.use({ access_token: token.accessToken });
  
  //FB
  graph = require('fbgraph');

  var token = _.find(req.user.tokens, { kind: 'facebook' });
  graph.setAccessToken(token.accessToken);
  
  // LinkedIn
  Linkedin = require('node-linkedin')(process.env.LINKEDIN_ID, process.env.LINKEDIN_SECRET, process.env.LINKEDIN_CALLBACK_URL);

  var token = _.find(req.user.tokens, { kind: 'linkedin' });
  var linkedin = Linkedin.init(token.accessToken);
  
  // Twitter
  Twit = require('twit');

  var token = _.find(req.user.tokens, { kind: 'twitter' });
  var T = new Twit({
    consumer_key: process.env.TWITTER_KEY,
    consumer_secret: process.env.TWITTER_SECRET,
    access_token: token.accessToken,
    access_token_secret: token.tokenSecret
  });
  
  async.parallel({
    searchByUsername: function(done) {
      ig.user_search('adicheo', function(err, users, limit) {
        done(err, users);
      });
    },
    getAsanaTasks: function(done) {
      asana_client.users.me()
        .then(function(user) {
          var userId = user.id;
          // The user's "default" workspace is the first one in the list, though
          // any user can have multiple workspaces so you can't always assume this
          // is the one you want to work with.
          var workspaceId = user.workspaces[3].id;
          // var workspaceId = "9326536612333"; //example
          // var workspaceId = "91311471379643";
          // console.log(userId);
          // console.log(workspaceId);
          return asana_client.tasks.findAll({
            assignee: userId,
            workspace: workspaceId,
            completed_since: 'now',
            opt_fields: 'id,name,assignee_status,completed,due_on'
          });
        })
        .then(function(response) {
          // There may be more pages of data, we could stream or return a promise
          // to request those here - for now, let's just return the first page
          // of items.
          // console.log(response.data);
          return response.data;
        })
        // .filter(function(task) {
        //   return task.assignee_status === 'today' ||
        //     task.assignee_status === 'new';
        // })
        // .then(function(list) {
        //   console.log(util.inspect(list, {
        //     colors: true,
        //     depth: null
        //   }));
        // })
        .then(function(list) {
          for (var i = 0; i < list.length; i++) {
            links.push(list[i].name);
            dates.push(list[i].due_on);
          }
          done(null, links, dates);
      });
    },
    getMe: function(done) {
      graph.get(req.user.facebook + "?fields=id,name,email,first_name,last_name,gender,link,locale,timezone", function(err, me) {
        done(err, me);
      });
    },
    getTwitter: function(done) {
      T.get('search/tweets', { q: 'happy since:2013-01-01', geocode: '40.71448,-74.00598,5mi', count: 4 }, function(err, reply) {
        done(err, reply);
      });
    },
    getLinkedIn: function(done) {
      linkedin.people.me(function(err, $in) {
        done(err, $in);
      });
    },
    getMyFriends: function(done) {
      graph.get(req.user.facebook + '/friends', function(err, friends) {
        done(err, friends.data);
      });
    }
  },
  function(err, results) {
    if (err) {
      return next(err);
    }
    res.render('dash', {
      title: 'Dashboard',
      // data: data
      links: links,
      dates: dates,
      
      me: results.getMe,
      friends: results.getMyFriends,
      
      profile: results.getLinkedIn,
      
      tweets: results.getTwitter.statuses,
      
      usernames: results.searchByUsername,
      userById: results.searchByUserId,
      popularImages: results.popularImages,
      myRecentMedia: results.myRecentMedia
    });
  });
};