/* jshint node: true */
'use strict';

var HapiFastboot = require('./lib/commands/hapi-fastboot');
var HapiFastbootBuild = require('./lib/commands/hapi-fastboot-build');

module.exports = {
  name: 'ember-cli-hapi-fastboot',

  includedCommands: function includedCommands() {
    return {
      'hapi-fastboot': HapiFastboot,
      'hapi-fastboot:build': HapiFastbootBuild
    };
  },

  contentFor: function(type) {
    if (!process.env.EMBER_CLI_HAPI_FASTBOOT) { return; }

    if (type === 'body') {
      return "<!-- EMBER_CLI_HAPI_FASTBOOT_BODY -->";
    }

    if (type === 'head') {
      return "<!-- EMBER_CLI_HAPI_FASTBOOT_TITLE -->";
    }

    if (type === 'vendor-prefix') {
      return '// Added from ember-cli-hapi-fastboot \n' +
             'EmberENV.FEATURES = EmberENV.FEATURES || {};\n' +
             'EmberENV.FEATURES["ember-application-visit"] = true;\n';
    }
  },

  included: function() {
    if (!process.env.EMBER_CLI_HAPI_FASTBOOT) { return; }

    this.app.options.storeConfigInMeta = false;
    process.env.EMBER_CLI_HAPI_FASTBOOT_APP_NAME = this.app.name;
  }
};
