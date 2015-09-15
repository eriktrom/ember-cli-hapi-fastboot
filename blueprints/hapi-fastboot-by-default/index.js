var Fs = require('fs');
var Path = require('path');
var RSVP = require('rsvp');

module.exports = {
  name: 'hapi-fastboot-by-default',
  description: 'Install `ember hapi-fastboot` as `npm start`.',

  normalizeEntityName: function() {
    // prevents error when entity name is not specified, b/c that doesn't matter
    // for this
  },

  install: function install(options) {
    var project = options.project;
    var packagePath = Path.join(project.root, 'package.json');
    var contents = Fs.readFileSync(packagePath, { encoding: 'utf8' });
    var pkg = JSON.parse(contents);

    pkg.scripts.start = 'ember hapi-fastboot --serve-assets';

    var newContents = JSON.stringify(pkg, null, 2);
    Fs.writeFileSync(packagePath, newContents, { encoding: 'utf8' });

    return RSVP.resolve();
  }
};
