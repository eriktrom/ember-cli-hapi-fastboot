var Debug = require('debug')('ember-cli-hapi-fastboot:server');
var Chalk = require('chalk');
var Boom = require('boom');

exports.register = function register(server, options, next) {

  server.route({
    method: 'GET',
    path: '/{assetpath*}',
    config: {
      description: 'Static Assets Route',
      handler: {
        directory: {
          path: './dist/'
        }
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/*',
    config: {
      description: 'Catch all route',
      handler: function(request, reply) {

        function handleFailure(error) {
          if (error.name === "UnrecognizedURLError") {
            console.error(404, 'Not Found', request.path, 'Error is:', error);
            return reply(Boom.notFound());
          } else {
            console.error(500, 'Unknown Error:', error, 'Stacktrace:', error.stack);
            return reply(Boom.badImplementation());
          }
        }

        return server.app.emberApp.waitForBoot().then(function(handleURL) {

          Debug('Handling url; url=%s', request.path);

          return handleURL(request.path)
            .then(function(res, path, result) {

              this.log(200, 'OK ' + path);
              return reply(this.insertIntoIndexHTML(result.title, result.body));
            })
            .catch(handleFailure)
            .finally(function() { Debug('Finished handling; url=%s', request.path); });
        })
        .catch(handleFailure);
      }
    }
  });

  return next();
};

exports.register.attributes = {
  name: 'Home'
};
