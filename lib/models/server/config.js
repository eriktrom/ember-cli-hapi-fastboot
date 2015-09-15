var Path = require('path');
var Fs = require('fs');
var Mkdirp = require('mkdirp');

Mkdirp.sync(Path.resolve(__dirname, '..', '..', '..', 'logs'));

var config = module.exports = {};

config.monitor = {
  opsInterval: 1000,
  reporters: [{
    reporter: require('good-console'),
    events: {
      log: '*',
      response: '*'
    }
  }, {
    reporter: require('good-file'),
    events: {
      // ops: '*'
      log: '*',
      response: '*'
    },
    config: './logs/development.log'
  }]
};
