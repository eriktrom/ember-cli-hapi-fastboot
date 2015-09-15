var Config = require('./config');

var composer = module.exports = {};

composer.manifest = {
  connections: [
    {
      host: 'localhost',
      port: 8000,
      labels: ['web']
    }
  ],
  plugins: {
    './home': [{
      'select': ['web']
    }],
    'good': Config.monitor,
    'inert': {},
    'lout': {}
  }
};

composer.composeOptions = {
  relativeTo: __dirname
};
