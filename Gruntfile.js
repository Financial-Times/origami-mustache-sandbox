

module.exports = function(grunt) {
  "use strict";

  var path = require('path');

  require('load-grunt-config')(grunt, {
    configPath: path.join(process.cwd(), 'grunt-config')
  });

  grunt.loadTasks('grunt-tasks');

  grunt.registerTask('default', ['clean', 'o-build-templates']);
};