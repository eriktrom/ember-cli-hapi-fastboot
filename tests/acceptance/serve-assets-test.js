/*jshint node:true, -W064*/
/*globals describe, before, it, after*/

var expect = require('chai').expect;
var RSVP = require('rsvp');
var Request = RSVP.denodeify(require('request'));
var Path = require('path');
var StartServer = require('../helpers/start-server');
var Delay = require('../helpers/delay');
// var Server = new require('../../lib/models/server')({
//   appFile: 'fake'
// });

var internals = {};

describe('serve assets acceptance', function() {

  before(function(done) {
    // start the server once for all tests
    this.timeout(300000);

    function grabChild(child) {
      console.log('saving child');
      internals.server = child;
      done();
    }

    return StartServer(grabChild, {
      additionalArguments: ['--serve-assets']
    });
  });

  after(function() {
    internals.server.kill('SIGINT');

    return Delay(500);
  });

  // it('/assets/vendor.js', function(done) {

  //   // Server.init(internals.manifest, internals.composeOptions, function(err, server) {

  //     internals.server.inject({ method: 'GET', url: '/assets/vendor.js' }, function (res) {

  //       expect(res.statusCode).to.equal(200);
  //       expect(res.headers["content-type"]).to.equal("application/javascript; charset=utf-8");
  //       expect(res.body).to.contain("Ember =");

  //       done();
  //     });
  //   // });
  // });

  it('/assets/vendor.js', function() {
    return Request('http://localhost:3000/assets/vendor.js')
      .then(function(response) {
        expect(response.statusCode).to.equal(200);
        expect(response.headers["content-type"]).to.eq("application/javascript; charset=utf-8");
        expect(response.body).to.contain("Ember =");
      });
  });

  it('/assets/dummy.js', function() {
    return Request('http://localhost:3000/assets/dummy.js')
      .then(function(response) {
        expect(response.statusCode).to.equal(200);
        expect(response.headers["content-type"]).to.eq("application/javascript; charset=utf-8");
        expect(response.body).to.contain("this.route('posts')");
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
