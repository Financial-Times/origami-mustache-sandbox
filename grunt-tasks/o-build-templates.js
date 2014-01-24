module.exports = function (grunt) {

    function inlineOrigamiPartials (template, outerModule) {
        var origamiTemplatesDirectory = grunt.config('o-build-templates.pathToCompiled') || 'origami-templates',
            origamiPartialsRX = '(?:' + origamiTemplatesDirectory.replace('\\', '\\\\') + '\\/)?(o\\-[a-z\\d\\-]+)((?:\\/[\\w\\d\\-]+)*\\/[\\w\\d\\-]+)',
            otherPartialsRX = '((?:\\.?\\/)?[a-z\\d\\-\\/]+)',
            parserRX = new RegExp('\\{\\{ *> *(?:' + origamiPartialsRX + '|' + otherPartialsRX +')(?:\\.mustache)? *\\}\\}', 'gi');


        var newTemplate = grunt.file.read(template).replace(parserRX, function ($0, innerModule, template, productTemplate) {
            if (innerModule && template) {
                var result = inlineOrigamiPartials('./bower_components/' + innerModule + template + '.mustache', innerModule);
                if (outerModule) {
                    return result;
                } else {
                    return $0;
                }
            } else if (productTemplate) {
                // it's not an origami partial so we just treat it as a relative path
                inlineOrigamiPartials(productTemplate + '.mustache');
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


