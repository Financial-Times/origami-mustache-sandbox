module.exports = function (grunt) {

	function inlineOrigamiPartials (template, outerModule) {
		var newTemplate = grunt.file.read(template).replace(/\{\{ *> *(o\-[a-z\d\-]+)((?:\/[\w\d\-]+)*\/[\w\d\-]+)(?:\.mustache)? *\}\}/g, function ($0, innerModule, template) {
			// if (innerModule === outerModule) {

			// } else {
				return inlineOrigamiPartials('./bower_components/' + innerModule + template + '.mustache', innerModule);	
			// }

			
		});
		if (outerModule) {
			grunt.file.write('origami-templates/' + outerModule + template.split(outerModule).pop(), newTemplate);
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