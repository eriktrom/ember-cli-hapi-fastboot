/*jshint node:true*/

var RSVP = require('rsvp');
var path = require('path');
var runCommand = require('ember-cli/tests/helpers/run-command');

module.exports = function runServer(callback, options) {
  options = options || { };

  if (!options.port) {
    options.port = '3000';
  }

  var args = [
    path.join('.', 'node_modules', 'ember-cli', 'bin', 'ember'),
    'hapi-fastboot',
    '--port', options.port
  ];

  if (options.additionalArguments) {
    args = args.concat(options.additionalArguments);
  }

  var commandOptions = {
    verbose: true,

    onOutput: function(output, child) {
      console.log('output: ' + output);

      if (output.indexOf('Web server started at:') > -1) {
        callback(child);
      }
    }
  };

  args.push(commandOptions);

  return new RSVP.Promise(function(resolve/*, reject*/) {
    runCommand.apply(null, args)
      .then(function() {
        throw new Error('The server should not have exited successfully.');
      })
      .catch(function(/*err*/) {
        // This error was just caused by us having to kill the program
        resolve();
      });
  })
  .catch(function(error) {
    console.error(error);
  });
};
