var Path = require('path');

module.exports = {
  name: 'hapi-fastboot:build',
  description: 'Build your assets for Hapi Fastboot',

  availableOptions: [
    { name: 'environment', type: String, default: 'development', aliases: ['e',{'dev' : 'development'}, {'prod' : 'production'}] },
    { name: 'output-path', type: String, default: 'fastboot-dist' }
  ],

  run: function run(options, args) {
    process.env.EMBER_CLI_HAPI_FASTBOOT = true;

    var BuildTask = this.tasks.Build;
    var buildTask = new BuildTask({
      ui: this.ui,
      analytics: this.analytics,
      project: this.project
    });

    return buildTask.run(options);
  }
};
