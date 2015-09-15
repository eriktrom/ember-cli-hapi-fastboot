var Glue = require('glue');
var Fs = require('fs');
var Chalk = require('chalk');
var EmberApp = require('../ember-app');

var internals = {};

internals.onPreStart = function onPreStart(server, next) {

  server.app.emberApp = this.emberApp;

  server.app.insertIntoIndexHTML = function insertIntoIndexHTML(title, body) {
    var html = this.html.replace("<!-- EMBER_CLI_HAPI_FASTBOOT_BODY -->", body);

    if (title) {
      html = html.replace("<!-- EMBER_CLI_HAPI_FASTBOOT_TITLE -->", "<title>" + title + "</title>");
    }

    return html;
  }.bind(this);

  server.app.log = function log(statusCode, message) {
    var color = statusCode === 200 ? 'green' : 'red';

    return this.ui.writeLine(Chalk[color](statusCode) + " " + message);
  }.bind(this);

  return next();
};

function HapiFastbootServer(options) {
  this.emberApp = new EmberApp({
    appFile: options.appFile,
    vendorFile: options.vendorFile
  });
  this.html = Fs.readFileSync(options.htmlFile, 'utf8');
  this.ui = options.ui;
}

HapiFastbootServer.prototype.init = function HapiFastbootServer_init(manifest, composeOptions, next) {

  var self = this;
  Glue.compose(manifest, composeOptions, function(err, server) {

    if (err) { return next(err); }

    server.select('web').ext('onPreStart', internals.onPreStart, { before: './home', bind: self });

    server.start(function (err) {

      return next(err, server);
    });
  });
};

module.exports = HapiFastbootServer;
