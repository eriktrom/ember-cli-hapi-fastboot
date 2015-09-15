var Fs = require('fs');

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
