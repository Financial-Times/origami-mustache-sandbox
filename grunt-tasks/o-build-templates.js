module.exports = function (grunt) {

	function inlineOrigamiPartials (template, module) {
		var newTemplate = grunt.file.read(template).replace(/\{\{ *> *(o\-[a-z\d\-]+)\/([\w\d\-]+)(?:\.mustache)? *\}\}/g, function ($0, module, template) {
			return inlineOrigamiPartials('./bower_components/' + module + '/' + template + '.mustache', module);
		});
		if (module) {
			grunt.file.write('origami-templates/' + module + '/' + template.split('/').pop(), newTemplate);
		} else {
			grunt.file.write('origami-templates/' + template, newTemplate);			
		}
		return newTemplate;
	}

	grunt.registerTask('o-build-templates', function () {
		grunt.config.requires('o-build-templates.files');

		var templates = grunt.config('o-build-templates.files');

		templates.forEach(inlineOrigamiPartials);
	});

};