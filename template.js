/*
 * grunt-init-mvcapp
 */

'use strict';

// Basic template description.
exports.description = 'Create a basic Gruntfile for an ASP.NET MVC app.';

// Any existing file or directory matching this wildcard will cause a warning.
exports.warnOn = 'Gruntfile.js';

// The actual init template.
exports.template = function(grunt, init, done) {

  init.process({}, [
    // Prompt for these values.
    init.prompt('name'),
    {
      name: 'package_json',
      message: 'Will you have a package.json file?',
      default: 'Y/n',
      warning: 'This changes how filenames are determined and banners are generated.'
    }
  ], function(err, props) {
    props.package_json = /y/i.test(props.package_json);
    props.file_name = props.package_json ? '<%= pkg.name %>' : 'FILE_NAME';

    // Files to copy (and process).
    var files = init.filesToCopy(props);

    // Actually copy (and process) files.
    init.copyAndProcess(files, props);

    // If is package_json true, generate package.json
    if (props.package_json) {
      var devDependencies = {
        'grunt': '~0.4.5',
        'load-grunt-tasks': '~1.0.0',
        'grunt-contrib-jshint': '~0.10.0',
        'grunt-contrib-watch': '~0.6.1',
        'grunt-contrib-qunit': '~0.5.2',
        'grunt-contrib-concat': '~0.4.0',
        'grunt-contrib-uglify': '~0.5.0',
        'grunt-contrib-copy': '~0.7.0',
        'grunt-bower-task': '~0.4.0',
        'grunt-bower-install': '~1.6.0',
        'bower': '~1.3.12',
        'grunt-shell': '~1.1.2'
      };

      // Generate package.json file, used by npm and grunt.
      init.writePackageJSON('package.json', {
        name: props.name,
        node_version: '>= 0.10.0',
        devDependencies: devDependencies
      });
    }

    // All done!
    done();
  });

};