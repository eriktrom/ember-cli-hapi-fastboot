/*jshint node:true, -W064*/
/*globals describe, before, it, after*/

var expect = require('chai').expect;
var RSVP = require('rsvp');
var Request = RSVP.denodeify(require('request'));
var Path = require('path');
var StartServer = require('../helpers/start-server');
// var Server = require('../../lib/models/server');

var internals = {};

describe('simple acceptance', function() {

  before(function(done) {
    // start the server once for all tests
    this.timeout(300000);

    function grabChild(child) {
      console.log('saving child');
      internals.server = child;
      done();
    }

    return StartServer(grabChild);
  });

  after(function() {
    internals.server.kill('SIGINT');
  });

  it('/ HTML contents', function() {
    return Request('http://localhost:3000/')
      .then(function(response) {
        expect(response.statusCode).to.equal(200);
        expect(response.headers["content-type"]).to.eq("text/html; charset=utf-8");
        expect(response.body).to.contain('<title>Application Route -- Title</title>');
        expect(response.body).to.contain("Welcome to Ember");
      });
  });

  it('/posts HTML contents', function() {
    return Request('http://localhost:3000/posts')
      .then(function(response) {
        expect(response.statusCode).to.equal(200);
        expect(response.headers["content-type"]).to.eq("text/html; charset=utf-8");
        expect(response.body).to.contain('<title>Application Route -- Title</title>');
        expect(response.body).to.contain("Welcome to Ember");
        expect(response.body).to.contain("Posts Route!");
      });
  });

  it('/not-found HTML contents', function() {
    return Request('http://localhost:3000/not-found')
      .then(function(response) {
        expect(response.statusCode).to.equal(404);
        expect(response.headers["content-type"]).to.eq("text/plain; charset=utf-8");
        expect(response.body).to.equal("Not Found");
      });
  });

  it('/boom HTML contents', function() {
    return Request('http://localhost:3000/boom')
      .then(function(response) {
        expect(response.statusCode).to.equal(500);
        expect(response.headers["content-type"]).to.eq("text/plain; charset=utf-8");
        expect(response.body).to.equal("Internal Server Error");
      });
  });

  it('/assets/vendor.js', function() {
    return Request('http://localhost:3000/assets/vendor.js')
      .then(function(response) {
        // Asset servering is off by default
        expect(response.statusCode).to.equal(404);
        expect(response.headers["content-type"]).to.eq("text/plain; charset=utf-8");
        expect(response.body).to.equal("Not Found");
      });
  });
});


internals.manifest = {
  connections: [
    {
      host: 'localhost',
      port: 0,
      labels: ['web']
    },
  ],
  plugins: {
    './home': [{
      'select': ['web']
    }]
  }
};

internals.composeOptions = {
  relativeTo: Path.resolve(__dirname, '../../lib/models/server')
};
