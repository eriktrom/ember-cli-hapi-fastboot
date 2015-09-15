var Debug = require('debug')('ember-cli-hapi-fastboot:server');
var Boom = require('boom');
var Inert = require('inert');

var internals = {};

internals.handleFailure = function handleFailure(reply) {

  return function(error) {

    if (error.name === "UnrecognizedURLError") {
      console.error(404, 'Not Found', request.path, 'Error is:', error);
      return reply(Boom.notFound());
    } else {
      console.error(500, 'Unknown Error:', error, 'Stacktrace:', error.stack);
      return reply(Boom.badImplementation());
    }
  };
};

exports.register = function register(server, options, next) {
  server.register(Inert, function () {}); // FIXME

  server.route({
    method: 'GET',
    path: '/{assetpath*}',
    config: {
      description: 'Static Assets Route',
      handler: {
        directory: {
          path: './hapi-fastboot-dist/'
        }
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/',
    config: {
      description: 'GET /',
      handler: function(request, reply) {

        return server.app.emberApp.waitForBoot().then(function(handleURL) {

          return handleURL(request.path).then(function(result) {

            server.app.log(200, 'OK ' + request.path);
            return reply(server.app.insertIntoIndexHTML(result.title, result.body));
          });
        }).catch(internals.handleFailure(reply));
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/posts',
    config: {
      description: 'GET /posts',
      handler: function(request, reply) {

        return server.app.emberApp.waitForBoot().then(function(handleURL) {

          return handleURL(request.path).then(function(result) {

            server.app.log(200, 'OK ' + request.path);
            return reply(server.app.insertIntoIndexHTML(result.title, result.body));
          });
        }).catch(internals.handleFailure(reply));
      }
    }
  });

  return next();
};

exports.register.attributes = {
  name: 'Home'
};
