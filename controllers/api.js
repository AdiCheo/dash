/**
 * Split into declaration and initialization for better startup performance.
 */
var cheerio;
var graph;
var Asana;
var Github;
var Twit;
var Linkedin;
var paypal;
var ig;
var Y;
var request;

var _ = require('lodash');
var async = require('async');
var querystring = require('querystring');

/**
 * GET /api
 * List of API examples.
 */
exports.getApi = function(req, res) {
  res.render('api/index', {
    title: 'API Examples'
  });
};

/**
 * GET /api/asana
 * Web asana example using Cheerio library.
 */
exports.getAsana = function(req, res, next) {
  Asana = require('asana');
  
  var clientId = process.env['ASANA_ID'];
  var clientSecret = process.env['ASANA_SECRET'];
  
  var links = [];
  
  // Create an Asana client. Do this per request since it keeps state that
  // shouldn't be shared across requests.
  function createClient() {
    return Asana.Client.create({
      clientId: clientId,
      clientSecret: clientSecret,
      redirectUri: 'http://dash-adicheo.c9users.io/auth/asana/callback'
    });
  }
  var client = createClient();
  // If token is in the cookie, use it to show info.
  var token = _.find(req.user.tokens, { kind: 'asana' }).accessToken;
  console.log("user tocken " + token);
  // var token = req.cookies.token;
  // console.log("cookietoken " + token);
  client.useOauth({ credentials: token });
  if (token) {

    // Here's where we direct the client to use Oauth with the credentials
    // we have acquired.
    client.useOauth({ credentials: token });
    client.users.me()
      .then(function(user) {
        var userId = user.id;
        // The user's "default" workspace is the first one in the list, though
        // any user can have multiple workspaces so you can't always assume this
        // is the one you want to work with.
        var workspaceId = user.workspaces[3].id;
        // var workspaceId = "9326536612333";
        console.log(userId);
        console.log(workspaceId);
        return client.tasks.findAll({
          assignee: userId,
          workspace: workspaceId,
          completed_since: 'now',
          opt_fields: 'id,name,assignee_status,completed'
        });
      })
      .then(function(response) {
        // There may be more pages of data, we could stream or return a promise
        // to request those here - for now, let's just return the first page
        // of items.
        console.log(response.data);
        return response.data;
    })
    .then(function(list) {
    for (var i = 0; i < list.length; i++) {
      links.push(list[i].name);
    }
    res.render('api/asana', {
      title: 'Web Asana',
      links: links
    });
  })
    .catch(function(err) {
      res.end('Error fetching user: ' + err);
    });
  } else {
    // Otherwise redirect to authorization.
    res.redirect('/auth/asana');
  }


//   // util = require('util');
//   var client = Asana.Client.create({
//     clientID: process.env.ASANA_ID,
//     clientSecret: process.env.ASANA_SECRET,
//     redirectUrl: '/auth/asana/callback',
//     redirectUri: '/auth/asana/callback'
//   });
//   var credentials = {
//     // access_token: 'my_access_token',
//     refresh_token: token.refreshToken
//   };
//   // client.useOauth({ credentials: token.accessToken });
//   client.useOauth({ credentials: credentials });
  
//   var links = [];
//   var dates = [];
// // Using the API key for basic authentication. This is reasonable to get
// // started with, but Oauth is more secure and provides more features.
// // var client = Asana.Client.create().useAccessToken(process.env.ASANA_API_KEY);
//   console.log(token);
//   console.log(client.users.me());
// client.users.me().then(function(me) {
//       res.end('Hello ' + me.name);
//     }).catch(function(err) {
//       res.end('Error fetching user: ' + err);
//     });
//   client.users.me()
//   .then(function(user) {
//     var userId = user.id;
//     // The user's "default" workspace is the first one in the list, though
//     // any user can have multiple workspaces so you can't always assume this
//     // is the one you want to work with.
//     var workspaceId = user.workspaces[3].id;
//     // var workspaceId = "9326536612333";
//     console.log(userId);
//     console.log(workspaceId);
//     return client.tasks.findAll({
//       assignee: userId,
//       workspace: workspaceId,
//       completed_since: 'now',
//       opt_fields: 'id,name,assignee_status,completed'
//     });
//   })
//   .then(function(response) {
//     // There may be more pages of data, we could stream or return a promise
//     // to request those here - for now, let's just return the first page
//     // of items.
//     console.log(response.data);
//     return response.data;
//   })
//   // .filter(function(task) {
//   //   return task.assignee_status === 'today' ||
//   //     task.assignee_status === 'new';
//   // })
//   // .then(function(list) {
//   //   console.log(util.inspect(list, {
//   //     colors: true,
//   //     depth: null
//   //   }));
//   // })
//   .then(function(list) {
//     for (var i = 0; i < list.length; i++) {
//       links.push(list[i].name);
//     }
//     res.render('api/asana', {
//       title: 'Web Asana',
//       links: links
//     });
//   })
//   .catch(function(err) {
//     res.redirect(client.app.asanaAuthorizeUrl());
//   });
};


/**
 * GET /api/facebook
 * Facebook API example.
 */
exports.getFacebook = function(req, res, next) {
  graph = require('fbgraph');

  var token = _.find(req.user.tokens, { kind: 'facebook' });
  graph.setAccessToken(token.accessToken);
  async.parallel({
    getMe: function(done) {
      graph.get(req.user.facebook + "?fields=id,name,email,first_name,last_name,gender,link,locale,timezone", function(err, me) {
        done(err, me);
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
    res.render('api/facebook', {
      title: 'Facebook API',
      me: results.getMe,
      friends: results.getMyFriends
    });
  });
};


/**
 * GET /api/scraping
 * Web scraping example using Cheerio library.
 */
exports.getScraping = function(req, res, next) {
  cheerio = require('cheerio');
  request = require('request');

  request.get('https://news.ycombinator.com/', function(err, request, body) {
    if (err) {
      return next(err);
    }
    var $ = cheerio.load(body);
    var links = [];
    $('.title a[href^="http"], a[href^="https"]').each(function() {
      links.push($(this));
    });
    res.render('api/scraping', {
      title: 'Web Scraping',
      links: links
    });
  });
};

/**
 * GET /api/github
 * GitHub API Example.
 */
exports.getGithub = function(req, res, next) {
  Github = require('github-api');

  var token = _.find(req.user.tokens, { kind: 'github' });
  var github = new Github({ token: token.accessToken });
  var repo = github.getRepo('sahat', 'requirejs-library');
  repo.show(function(err, repo) {
    if (err) {
      return next(err);
    }
    res.render('api/github', {
      title: 'GitHub API',
      repo: repo
    });
  });

};
/**
 * GET /api/nyt
 * New York Times API example.
 */
exports.getNewYorkTimes = function(req, res, next) {
  request = require('request');

  var query = querystring.stringify({
    'api-key': process.env.NYT_KEY,
    'list-name': 'science'
  });
  var url = 'http://api.nytimes.com/svc/books/v2/lists?' + query;

  request.get(url, function(err, request, body) {
    if (err) {
      return next(err);
    }
    if (request.statusCode === 403) {
      return next(Error('Missing or Invalid New York Times API Key'));
    }
    var bestsellers = JSON.parse(body);
    if (req.path == "/api/nyt") {
      res.render('api/nyt', {
        title: 'New York Times API',
        books: bestsellers.results
      });
    } else {
      next(err, bestsellers.results);
    }
  });
};


/**
 * GET /api/twitter
 * Twiter API example.
 */
exports.getTwitter = function(req, res, next) {
  Twit = require('twit');

  var token = _.find(req.user.tokens, { kind: 'twitter' });
  var T = new Twit({
    consumer_key: process.env.TWITTER_KEY,
    consumer_secret: process.env.TWITTER_SECRET,
    access_token: token.accessToken,
    access_token_secret: token.tokenSecret
  });
  T.get('search/tweets', { q: 'nodejs since:2013-01-01', geocode: '40.71448,-74.00598,5mi', count: 10 }, function(err, reply) {
    if (err) {
      return next(err);
    }
    res.render('api/twitter', {
      title: 'Twitter API',
      tweets: reply.statuses
    });
  });
};

/**
 * POST /api/twitter
 * Post a tweet.
 */
exports.postTwitter = function(req, res, next) {
  Twit = require('twit');
  req.assert('tweet', 'Tweet cannot be empty.').notEmpty();

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/api/twitter');
  }

  var token = _.find(req.user.tokens, { kind: 'twitter' });
  var T = new Twit({
    consumer_key: process.env.TWITTER_KEY,
    consumer_secret: process.env.TWITTER_SECRET,
    access_token: token.accessToken,
    access_token_secret: token.tokenSecret
  });
  T.post('statuses/update', { status: req.body.tweet }, function(err, data, response) {
    if (err) {
      return next(err);
    }
    req.flash('success', { msg: 'Tweet has been posted.'});
    res.redirect('/api/twitter');
  });
};

/**
 * GET /api/linkedin
 * LinkedIn API example.
 */
exports.getLinkedin = function(req, res, next) {
  Linkedin = require('node-linkedin')(process.env.LINKEDIN_ID, process.env.LINKEDIN_SECRET, process.env.LINKEDIN_CALLBACK_URL);

  var token = _.find(req.user.tokens, { kind: 'linkedin' });
  var linkedin = Linkedin.init(token.accessToken);
  linkedin.people.me(function(err, $in) {
    if (err) {
      return next(err);
    }
    res.render('api/linkedin', {
      title: 'LinkedIn API',
      profile: $in
    });
  });
};

/**
 * GET /api/instagram
 * Instagram API example.
 */
exports.getInstagram = function(req, res, next) {
  ig = require('instagram-node').instagram();

  var token = _.find(req.user.tokens, { kind: 'instagram' });
  ig.use({ client_id: process.env.INSTAGRAM_ID, client_secret: process.env.INSTAGRAM_SECRET });
  ig.use({ access_token: token.accessToken });
  async.parallel({
    searchByUsername: function(done) {
      ig.user_search('adicheo', function(err, users, limit) {
        done(err, users);
      });
    },
    searchByUserId: function(done) {
      ig.user('173801854', function(err, user) {
        done(err, user);
      });
    // },
    // popularImages: function(done) {
    //   ig.media_popular(function(err, medias) {
    //     done(err, medias);
    //   });
    },
    myRecentMedia: function(done) {
      ig.user_self_media_recent(function(err, medias, pagination, limit) {
        done(err, medias);
      });
    }
  }, function(err, results) {
    if (err) {
      return next(err);
    }
    if (req.path == "/api/instagram") {
      res.render('api/instagram', {
        title: 'Instagram API',
        usernames: results.searchByUsername,
        userById: results.searchByUserId,
        popularImages: results.popularImages,
        myRecentMedia: results.myRecentMedia
      });
    } else {
      next(err, results);
    }
  });
};

/**
 * GET /api/paypal
 * PayPal SDK example.
 */
exports.getPayPal = function(req, res, next) {
  paypal = require('paypal-rest-sdk');

  paypal.configure({
    mode: 'sandbox',
    client_id: process.env.PAYPAL_ID,
    client_secret: process.env.PAYPAL_SECRET
  });

  var paymentDetails = {
    intent: 'sale',
    payer: {
      payment_method: 'paypal'
    },
    redirect_urls: {
      return_url: '/api/paypal/success',
      cancel_url: '/api/paypal/cancel'
    },
    transactions: [{
      description: 'Life Dashboard',
      amount: {
        currency: 'USD',
        total: '1.99'
      }
    }]
  };

  paypal.payment.create(paymentDetails, function(err, payment) {
    if (err) {
      return next(err);
    }
    req.session.paymentId = payment.id;
    var links = payment.links;
    for (var i = 0; i < links.length; i++) {
      if (links[i].rel === 'approval_url') {
        res.render('api/paypal', {
          approvalUrl: links[i].href
        });
      }
    }
  });
};

/**
 * GET /api/paypal/success
 * PayPal SDK example.
 */
exports.getPayPalSuccess = function(req, res) {
  var paymentId = req.session.paymentId;
  var paymentDetails = { payer_id: req.query.PayerID };
  paypal.payment.execute(paymentId, paymentDetails, function(err) {
    if (err) {
      res.render('api/paypal', {
        result: true,
        success: false
      });
    } else {
      res.render('api/paypal', {
        result: true,
        success: true
      });
    }
  });
};

/**
 * GET /api/paypal/cancel
 * PayPal SDK example.
 */
exports.getPayPalCancel = function(req, res) {
  req.session.paymentId = null;
  res.render('api/paypal', {
    result: true,
    canceled: true
  });
};
