var path = require('path');

function addFileExtension (path) {
    return /\.(html|mustache|svg)$/.test(path) ? path : (path + '.mustache');
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
        origamiPartialRX = new RegExp('> *(?:' + origamiTemplatesDirectory.replace('\\', '\\\\') + '\\/)?(o\\-[a-z\\d\\-]+)((?:\\/[\\w\\d\\-_]+)*\\/[\\w\\d\\-]+)(\\.mustache|\\.html|\\.svg)?', 'gi'),
        // matches stings of the form o-modulename/path/to/template!items=path/to/partial,moreitems=path/to/other/partial
        normalPartialRX = /> *((?:\.?\/)?[a-z\d\-\/_]+)(\.mustache|\.html|\.svg)?/gi;

    if (parsedMustache = origamiPartialRX.exec(content)) {
        return {
            type: 'origamiPartial',
            module: parsedMustache[1],
            template: parsedMustache[2],
            fileExtension: parsedMustache[3] || '.mustache'
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

    var origamiTemplatesDirectory = grunt.config('o-build-templates.pathToCompiled') || 'origami-templates',
        newTemplate = grunt.file.read(template).replace(/\{\{(?!\!) *([^(?:\}\})]*) *\}\}/g, function ($0, content) {
            var action = analyzeMustacheContent(content),
                result;

                console.log(action);

            if (action.type === 'origamiPartial') {
                var newPartial = grunt.config('o-build-templates.dynamicPartials.' + action.module + '.' + action.template.replace(/^\.?\/?/, ''));

                if (newPartial) {

                    if (newPartial.indexOf('o-') === 0) {
                        result = inlineOrigamiPartials(path.join(process.cwd(), 'bower_components/' + addFileExtension(newPartial)), newPartial.split('/').shift());
                    } else {
                        result = inlineOrigamiPartials(path.join(process.cwd(), addFileExtension(newPartial)), newPartial.split('/').shift());
                    }

                    return result;
                } else {
                    result = inlineOrigamiPartials(path.join(process.cwd(),'bower_components/' + action.module + action.template + action.fileExtension), action.module, {});
                
                    if (module) {
                        return result;
                    } else {
                        return $0;
                    }
                }

            } else {
                if (action.type === 'normalPartial') {
                    // it's not an origami partial so we just treat it as a relative path
                    inlineOrigamiPartials(path.join(process.cwd(), action.template + action.fileExtension ));
                }
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

        var templates = grunt.file.expand(grunt.config('o-build-templates.files'));
        

        templates.forEach(function (tpl) {
            inlineOrigamiPartials(tpl);
        });
    });

};

task.exec = inlineOrigamiPartials;

module.exports = task;

