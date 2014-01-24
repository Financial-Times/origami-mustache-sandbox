module.exports = function (grunt) {

    function inlineOrigamiPartials (template, outerModule) {
        var origamiTemplatesDirectory = grunt.config('o-build-templates.pathToCompiled') || 'origami-templates',
            origamiDynamicPartialRX = '(o\\-[a-z\\d\\-]+)#!([a-z\\d\\-]+)',
            origamiPartialRX = '(?:' + origamiTemplatesDirectory.replace('\\', '\\\\') + '\\/)?(o\\-[a-z\\d\\-]+)((?:\\/[\\w\\d\\-]+)*\\/[\\w\\d\\-]+)',
            otherPartialRX = '((?:\\.?\\/)?[a-z\\d\\-\\/]+)',
            parserRX = new RegExp('\\{\\{ *> *(?:' + origamiDynamicPartialRX + '|' + origamiPartialRX + '|' + otherPartialRX +')(?:\\.mustache)? *\\}\\}', 'gi');


        var newTemplate = grunt.file.read(template).replace(parserRX, function ($0, innerModuleA, dynamicPartial, innerModuleB, template, productTemplate) {
            if (innerModuleA && dynamicPartial) {
                if (innerModuleA !==  outerModule) {
                    grunt.fail.fatal('Incorrect attempt to include a dynamic partial of ' + innerModuleA + ' in a template of ' + (outerModule ? outerModule : 'your product') + '. ' +
                        'Dynamic partials should only be used within the origami module that defines them.');
                }
                var newPartial = grunt.config('o-build-templates.dynamicPartials.' + innerModuleA + '.' + dynamicPartial);
                var result = inlineOrigamiPartials('./bower_components/' + newPartial + '.mustache', innerModuleA );
                return result;

            } else if (innerModuleB && template) {
                var result = inlineOrigamiPartials('./bower_components/' + innerModuleB + template + '.mustache', innerModuleB);
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


