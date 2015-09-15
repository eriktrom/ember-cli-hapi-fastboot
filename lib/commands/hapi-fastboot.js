var Path = require('path');
var Glob = require('glob');
var RSVP = require('rsvp');
var SilentError = require('silent-error');
var Hoek = require('hoek');
var HapiFastbootServer = require('../models/server');
var Composer = require('../models/server/manifest');

module.exports = {
  name: 'hapi-fastboot',
  description: 'Runs a server to render you app using Hapi + Fastboot',

  availableOptions: [
    { name: 'build', type: Boolean, default: true },
    { name: 'environment', type: String, default: 'development', aliases: ['e',{'dev' : 'development'}, {'prod' : 'production'}] },
    { name: 'serve-assets', type: Boolean, default: false },
    { name: 'port', type: Number, default: 3000 },
    { name: 'output-path', type: String, default: 'hapi-fastboot-dist' }
  ],

  runCommand: function(appName, options) {
    var outputPath = this.commandOptions.outputPath;

    var server = new HapiFastbootServer({
      appFile: findAppFile(outputPath, appName),
      vendorFile: findVendorFile(outputPath),
      htmlFile: findHTMLFile(outputPath),
      ui: this.ui
    });

    server.init(Composer.manifest, Composer.composeOptions, function(err, server) {

      Hoek.assert(!err, err);

      var web = server.select('web');

      console.log('Web server started at:', web.info.uri);
    });

    // block forever
    return new RSVP.Promise(function() {});
  },

  triggerBuild: function triggerBuild(commandOptions) {
    var buildTask = new this.tasks.Build({
      ui: this.ui,
      analytics: this.analytics,
      project: this.project
    });

    return buildTask.run(commandOptions);
  },

  run: function run(options, args) {
    process.env.EMBER_CLI_HAPI_FASTBOOT = true;
    require('mkdirp').sync(Path.resolve(this.project.root, 'log'));

    this.commandOptions = options;

    var runCommand = function() {
      var appName = process.env.EMBER_CLI_HAPI_FASTBOOT_APP_NAME || this.project.name();

      return this.runCommand(appName, options);
    }.bind(this);

    if (options.build) {
      return this.triggerBuild(options)
        .then(runCommand);
    }

    return runCommand();
  }
};

function findAppFile(outputPath, appName) {
  return findFile("app", Path.join(outputPath, "assets", appName + "*.js"));
}

function findVendorFile(outputPath) {
  return findFile("vendor", Path.join(outputPath, "assets", "vendor*.js"));
}

function findHTMLFile(outputPath) {
  return findFile('html', Path.join(outputPath, 'index*.html'));
}

function findFile(name, globPath) {
  var files = Glob.sync(globPath);

  assert("Found " + files.length + " " + name + " files (expected 1) when globbing '" + globPath + "'.", files.length === 1);

  return files[0];
}

function assert(message, condition) {
  if (condition === false) {
    throw new SilentError(message);
  }
}
