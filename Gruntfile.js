

module.exports = function(grunt) {
  "use strict";

  var path = require('path');

  require('load-grunt-config')(grunt, {
    configPath: path.join(process.cwd(), 'grunt-config'),
    config: {
      pkg: grunt.file.readJSON('package.json'),
      bwr: grunt.file.readJSON('bower.json')
    }
  });

  grunt.loadTasks('grunt-tasks');

  grunt.registerTask('default', ['o-build-templates']);
};