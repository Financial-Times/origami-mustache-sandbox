module.exports = function (grunt) {

	function inlineOrigamiPartials (template, outerModule) {
		var compiledFolder = grunt.config('o-build-templates.pathToCompiled') || 'origami-templates',
			origamiPartialRX = new RegExp('\\\{\\\{ *> *(?:' + compiledFolder + '\\\/)?(o\-[a-z\\\d\\\-]+)((?:\\\/[\\\w\d\\\-]+)*\\\/[\\\w\\\d\\\-]+)(?:\\\.mustache)? *\\\}\\\}', 'gi');


		var newTemplate = grunt.file.read(template).replace(origamiPartialRX, function ($0, innerModule, template) {
			var result = inlineOrigamiPartials('./bower_components/' + innerModule + template + '.mustache', innerModule);
			if (outerModule) {
				return result;
			} else {
				return $0;
			}
		});
		if (outerModule) {
			grunt.file.write('origami-templates/' + outerModule + template.split(outerModule).pop(), newTemplate);
		}
		return newTemplate;
	}

	grunt.registerTask('o-build-templates', function () {
		grunt.config.requires('o-build-templates.files');

		var templates = grunt.config('o-build-templates.files');

		templates.forEach(inlineOrigamiPartials);
	});

};