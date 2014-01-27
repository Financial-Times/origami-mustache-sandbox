var path = require('path');


function addFileExtension (path) {
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


function analyzeMustacheContent (content) {
    
    var parsedMustache,
        origamiTemplatesDirectory = grunt.config('o-build-templates.pathToCompiled') || 'origami-templates',
        origamiPartialRX = '> *(?:' + origamiTemplatesDirectory.replace('\\', '\\\\') + '\\/)?(o\\-[a-z\\d\\-]+)((?:\\/[\\w\\d\\-]+)*\\/[\\w\\d\\-]+)',
        // matches stings of the form o-modulename/path/to/template!items=path/to/partial,moreitems=path/to/other/partial
        origamiPartialWithSettingsRX = new RegExp(origamiPartialRX + '(?:!(\\w+=[\\w\\/\\-]+(?:,\\w+=[\\w\\/\\-.]+)+))?(\\.(?:mustache|html))?', 'gi'),
        dynamicPartialRX = /(o\-[a-z\d\-]+) *!> *([a-z\d\-]+)/gi,
        normalPartialRX = /> *((?:\.?\/)?[a-z\d\-\/]+)(\.mustache|\.html)?/gi;

    if (parsedMustache = dynamicPartialRX.exec(content)) {
        return {
            type: 'dynamicPartial',
            module: parsedMustache[1],
            property: parsedMustache[2]
        };
    } else if (parsedMustache = origamiPartialWithSettingsRX.exec(content)) {
        return {
            type: 'origamiPartial',
            module: parsedMustache[1],
            template: parsedMustache[2],
            settings: parseSettings(parsedMustache[3]),
            fileExtension: parsedMustache[4] || '.mustache'
        };
    } else if (parsedMustache = normalPartialRX.exec(content)) {
        return {
            type: 'normalPartial',
            template: parsedMustache[1],
            fileExtension: parsedMustache[2] || '.mustache'
        };
    }
    return {};

}

function inlineOrigamiPartials (template, module, settings) {

    settings = settings || {};

    var origamiTemplatesDirectory = grunt.config('o-build-templates.pathToCompiled') || 'origami-templates';

    var newTemplate = grunt.file.read(template).replace(/\{\{ *([^(?:\}\})]*) *\}\}/g, function ($0, content) {
        var action = analyzeMustacheContent(content),
            result;
        if (action.type === 'dynamicPartial') {
            if (action.module !== module) {
                grunt.fail.fatal('Incorrect attempt to include a dynamic partial of ' + action.module + ' in a template of ' + (module ? module : 'your product') + '. ' +
                    'Dynamic partials should only be used within the origami module that defines them.');
            }

            var newPartial = grunt.config('o-build-templates.dynamicPartials.' + action.module + '.' + action.property) || settings[action.property];

            if (newPartial) {

                if (newPartial.indexOf('o-') === 0) {
                    result = inlineOrigamiPartials(path.join(process.cwd(), 'bower_components/' + addFileExtension(newPartial)), newPartial.split('/').shift());
                } else {
                    result = inlineOrigamiPartials(path.join(process.cwd(), addFileExtension(newPartial)), newPartial.split('/').shift());
                }

                return result;
            } else {
                return '';
            }
        } else if (action.type === 'origamiPartial') {
            if (action.settings) {
                
                result = inlineOrigamiPartials(path.join(process.cwd(),'bower_components/' + action.module + action.template + action.fileExtension), action.module, action.settings);
            } else {
                result = inlineOrigamiPartials(path.join(process.cwd(),'bower_components/' + action.module + action.template + action.fileExtension), action.module, {});
            }
            
            if (module) {
                return result;
            } else {
                return $0;
            }
        } else if (action.type === 'normalPartial') {
            // it's not an origami partial so we just treat it as a relative path
            inlineOrigamiPartials(path.join(process.cwd(), action.template + action.fileExtension ));
            return $0;
        } else {
            return $0;
        }

    });

    if (module) {
        grunt.file.write(origamiTemplatesDirectory + '/' + module + template.split(module).pop(), newTemplate);
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

