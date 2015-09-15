/*jshint node:true*/
/*globals describe, before, it, after*/

var expect = require('chai').expect;
var RSVP = require('rsvp');
var startServer = require('../helpers/start-server');
var request = RSVP.denodeify(require('request'));

describe('simple acceptance', function() {
  var server;

  before(function(done) {
    // start the server once for all tests
    this.timeout(300000);

    function grabChild(child) {
      console.log('saving child');
      server = child;
      done();
    }

    return startServer(grabChild);
  });

  after(function() {
    server.kill('SIGINT');
  });

  it('/ HTML contents', function() {
    return request('http://localhost:3000/')
      .then(function(response) {
        expect(response.statusCode).to.equal(200);
        expect(response.headers["content-type"]).to.eq("text/html; charset=utf-8");
        expect(response.body).to.contain('<title>Application Route -- Title</title>');
        expect(response.body).to.contain("Welcome to Ember");
      });
  });

  it('/posts HTML contents', function() {
    return request('http://localhost:3000/posts')
      .then(function(response) {
        expect(response.statusCode).to.equal(200);
        expect(response.headers["content-type"]).to.eq("text/html; charset=utf-8");
        expect(response.body).to.contain('<title>Application Route -- Title</title>');
        expect(response.body).to.contain("Welcome to Ember");
        expect(response.body).to.contain("Posts Route!");
      });
  });

  it('/not-found HTML contents', function() {
    return request('http://localhost:3000/not-found')
      .then(function(response) {
        expect(response.statusCode).to.equal(404);
        expect(response.headers["content-type"]).to.eq("text/plain; charset=utf-8");
        expect(response.body).to.equal("Not Found");
      });
  });

  it('/boom HTML contents', function() {
    return request('http://localhost:3000/boom')
      .then(function(response) {
        expect(response.statusCode).to.equal(500);
        expect(response.headers["content-type"]).to.eq("text/plain; charset=utf-8");
        expect(response.body).to.equal("Internal Server Error");
      });
  });

  it('/assets/vendor.js', function() {
    return request('http://localhost:3000/assets/vendor.js')
      .then(function(response) {
        // Asset servering is off by default
        expect(response.statusCode).to.equal(404);
        expect(response.headers["content-type"]).to.eq("text/plain; charset=utf-8");
        expect(response.body).to.equal("Not Found");
      });
  });
});
