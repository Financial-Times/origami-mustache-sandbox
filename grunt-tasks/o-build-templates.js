var path = require('path');


function addFileExtension (path) {
    console.log('path', path);
    return /\.(html|mustache)$/.test(path) ? path : (path + '.mustache');
}

function parseSettings(settings) {
    var obj = {};
    if (settings) {
        settings = settings.split(',').forEach(function (setting) {
            setting = setting.split('=');
            obj[setting[0]] = setting[1];
        });
    }
    return obj;
}

function inlineOrigamiPartials (template, outerModule, outerSettings) {

    outerSettings = outerSettings || {};
    var origamiTemplatesDirectory = grunt.config('o-build-templates.pathToCompiled') || 'origami-templates',
        // matches stings of the form o-modulename !> path/to/partial (forgiving of whitespace)
        origamiDynamicPartialRX = '(o\\-[a-z\\d\\-]+) *!> *([a-z\\d\\-]+)',
        // matches stings of the form o-modulename/path/to/template 
        origamiPartialRX = '(?:' + origamiTemplatesDirectory.replace('\\', '\\\\') + '\\/)?(o\\-[a-z\\d\\-]+)((?:\\/[\\w\\d\\-]+)*\\/[\\w\\d\\-]+)',
        // matches stings of the form o-modulename/path/to/template!items=path/to/partial,moreitems=path/to/other/partial
        origamiPartialWithSettingsRX = origamiPartialRX + '(?:!(\\w+=[\\w\\/\\-]+(?:,\\w+=[\\w\\/\\-.]+)+))?',
         // matches stings of the form [./]path/to/template 
        otherPartialRX = '((?:\\.?\\/)?[a-z\\d\\-\\/]+)',
        staticPartialRX = '> *(?:' + origamiPartialWithSettingsRX + '|' + otherPartialRX +')(?:\\.mustache)?',
        parserRX = new RegExp('\\{\\{ *' + '(?:' + origamiDynamicPartialRX + '|' + staticPartialRX + ') *\\}\\}', 'gi');


    var newTemplate = grunt.file.read(template).replace(parserRX, function ($0, innerModuleA, dynamicPartial, innerModuleB, innerTemplate, templateSettings, productTemplate) {
        if (innerModuleA && dynamicPartial) {
            if (innerModuleA !== outerModule) {
                grunt.fail.fatal('Incorrect attempt to include a dynamic partial of ' + innerModuleA + ' in a template of ' + (outerModule ? outerModule : 'your product') + '. ' +
                    'Dynamic partials should only be used within the origami module that defines them.');
            }

            var newPartial = grunt.config('o-build-templates.dynamicPartials.' + innerModuleA + '.' + dynamicPartial) || outerSettings[dynamicPartial];

            if (newPartial) {

                if (newPartial.indexOf('o-') === 0) {
                    var result = inlineOrigamiPartials(path.join(process.cwd(), 'bower_components/' + addFileExtension(newPartial)), newPartial.split('/').shift());     
                } else {
                    var result = inlineOrigamiPartials(path.join(process.cwd(), addFileExtension(newPartial)), newPartial.split('/').shift());     
                }

                return result;
            } else {
                return '';
            }

        } else if (innerModuleB && innerTemplate) {
            if (templateSettings) {
                
                var result = inlineOrigamiPartials(path.join(process.cwd(),'bower_components/' + innerModuleB + addFileExtension(innerTemplate)), innerModuleB, parseSettings(templateSettings));
            } else {
                var result = inlineOrigamiPartials(path.join(process.cwd(),'bower_components/' + innerModuleB + addFileExtension(innerTemplate)), innerModuleB, {});    
            }
            
            if (outerModule) {
                return result;
            } else {
                return $0;
            }
        } else if (productTemplate) {
            // it's not an origami partial so we just treat it as a relative path
            inlineOrigamiPartials(path.join(process.cwd(), addFileExtension(productTemplate) ));
        }
    });
    if (outerModule) {
        grunt.file.write(origamiTemplatesDirectory + '/' + outerModule + template.split(outerModule).pop(), newTemplate);
    }
    return newTemplate;
}

var grunt,
    task = function (aGrunt) {

    grunt = aGrunt;

    grunt.registerTask('o-build-templates', function () {
        grunt.config.requires('o-build-templates.files');

        var templates = grunt.config('o-build-templates.files');

        templates.forEach(inlineOrigamiPartials);
    });

};

task.exec = inlineOrigamiPartials;

module.exports = task;

