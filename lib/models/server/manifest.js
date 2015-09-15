var Config = require('./config');

var composer = module.exports = {};

composer.manifest = {
  connections: [
    {
      host: 'localhost',
      port: '3000',
      labels: ['web']
    }
  ],
  plugins: {
    './home': [{
      'select': ['web']
    }],
    'good': Config.monitor,
    'vision': {},
    'lout': {}
  }
};

composer.composeOptions = {
  relativeTo: __dirname
};
