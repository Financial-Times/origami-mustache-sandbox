/*

Rudimentary tests for o-asset path resolver

To run, 

  sudo npm install -g nodeunit;nodeunit tests/tests.js

*/

var grunt = require('grunt'),
    task = require('../grunt-tasks/o-build-templates'),
    fs = require('fs');

task(grunt);

function read (path) {
    return fs.readFileSync(path, {encoding: 'utf8'});
}

function exists (path) {
    return fs.existsSync(path);
}

function deleteFolderRecursive (path) {
  if( fs.existsSync(path) ) {
    fs.readdirSync(path).forEach(function(file,index){
      var curPath = path + "/" + file;
      if(fs.statSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

function finish (test, path) {
    deleteFolderRecursive(path || './origami-templates');
    test.done();
}

module.exports = [
    // basic inclusion of a template and being forgiving of whitespace
    function (test) { 
        task.exec('./tests/test1.mustache');
        test.ok(exists('./origami-templates/o-test1/main.mustache'));
        test.ok(exists('./origami-templates/o-test2/main.mustache'));
        test.equals(read('./tests/test1.mustache'), '{{ > origami-templates/o-test1/main }}{{>origami-templates/o-test2/main}}{{ > origami-templates/o-test2/main.mustache }}');
        finish(test);
    },

    // inclusion of a template via a product's partial 
    function (test) { 
        task.exec('./tests/test1b.mustache');
        test.ok(exists('./origami-templates/o-test1/main.mustache'));
        test.ok(exists('./origami-templates/o-test2/main.mustache'));
        test.equals(read('./tests/test1.mustache'), '{{ > origami-templates/o-test1/main }}{{>origami-templates/o-test2/main}}{{ > origami-templates/o-test2/main.mustache }}');
        test.equals(read('./tests/test1b.mustache'), '{{ > ./tests/test1.mustache }}');
        finish(test);
    },

    // configuring where templates get stored
    function (test) {
        grunt.config.set('o-build-templates.pathToCompiled', 'alternative');
        task.exec('./tests/test2.mustache');
        test.ok(!exists('./origami-templates/o-test1/main.mustache'));
        test.ok(!exists('./origami-templates/o-test2/main.mustache'));
        test.ok(exists('./alternative/o-test1/main.mustache'));
        test.ok(exists('./alternative/o-test2/main.mustache'));
        test.equals(read('./tests/test2.mustache'), '{{ > alternative/o-test1/main }}{{>alternative/o-test2/main}}{{ > alternative/o-test2/main.mustache }}');
        grunt.config('o-build-templates.pathToCompiled', null);
        finish(test, 'alternative');
    },

    // using an origami template that contains partials from the same module
    function (test) {
        task.exec('./tests/test3.mustache');
        test.ok(exists('./origami-templates/o-test3/main.mustache'));
        test.equals(read('./origami-templates/o-test3/main.mustache'), 'rootsubdirectorysubdirectoryhtmlsvg');
        finish(test);
    },

    // using an origami template that contains other origami modules' templates
    function (test) {
        task.exec('./tests/test4.mustache');
        test.ok(exists('./origami-templates/o-test4/main.mustache'));
        test.equals(read('./origami-templates/o-test4/main.mustache'), 'test1test2-partial');
        finish(test);
    },
    
    // using an origami template that can have arbitrary content injected into a region (specified using config)
    function (test) {
        grunt.config.set('o-build-templates.dynamicPartials.o-test5.dynamicPartial1', 'o-test4/main');
        grunt.config.set('o-build-templates.dynamicPartials.o-test5.dynamicPartial2', './tests/test5.html');
        task.exec('./tests/test5.mustache');
        test.ok(exists('./origami-templates/o-test5/main.mustache'));
        test.equals(read('./origami-templates/o-test5/main.mustache'), 'test1test2-partialtest5not-overriden');
        grunt.config.set('o-build-templates.dynamicPartials', null);
        finish(test);
    },

    // // using an origami template that can have arbitrary content injected into a region, specified using the template
    // function (test) {
    //     task.exec('./tests/test6.mustache');
    //     test.ok(exists('./origami-templates/o-test6/main.mustache'));
    //     test.equals(read('./origami-templates/o-test6/main.mustache'), 'test1test2-partialtest5');
    //     finish(test);
    // }
];


