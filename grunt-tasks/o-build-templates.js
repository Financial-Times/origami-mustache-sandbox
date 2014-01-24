module.exports = function (grunt) {
	grunt.registerTask('o-build-templates', function () {
		grunt.config.requires('o-build-templates.files');

		var templates = grunt.config('o-build-templates.files');

		templates.forEach(function (template) {
			var newTemplate = grunt.file.read(template).replace(/\{\{ *> *(o\-[a-z\d\-]+)\/([\w\d\-]+)(?:\.mustache)? *\}\}/g, function ($0, module, template) {

				return grunt.file.read('./bower_components/' + module + '/' + template + '.mustache');

				//return 'origami-templates/' + module + '/' + template + '.mustache';


			});

			grunt.file.write('origami-templates/' + template, newTemplate);
		});
	});

};