'use strict';

var Jasmine = require('jasmine');
var jasmine = new Jasmine();

jasmine.loadConfig({
    spec_dir: 'spec/unit',
    spec_files: ['**/*[sS]pec.js'],
    helpers: ['helpers/**/*.js']
});


jasmine.execute();
