'use strict';

var fs = require( 'fs' );
var karma = require('karma').server;
var objectMerge = require('object-merge');
var Q = require('q');

var test = function( karmaConfig, isRecordingResults ) {

	karmaConfig = objectMerge( karmaConfig, {
		action: 'run',
		autoWatch: false,
		browsers: ['PhantomJS'],
		coverageReporter: {
			reporters: [
				{ type: 'html', dir: 'test/output/coverage/' },
				{ type: 'cobertura', dir: 'test/output/coverage/' }
			]
		},
		directivesPreprocess: {
			flags: {
				js: {
					ER_GEN: isRecordingResults == true
				}
			}
		},
		frameworks: ['jasmine'],
		jsonFixturesPreprocessor: {
			variableName: '__ER__',
			stripPrefix: 'test/er/'
		},
		junitReporter: {
			outputFile: 'test/output/unit.xml',
			suite: 'unit'
		},
		plugins: [
			'karma-coverage',
			'karma-directives-preprocessor',
			'karma-jasmine',
			'karma-json-fixtures-preprocessor',
			'karma-junit-reporter',
			'karma-phantomjs-launcher',
			require('./json-dumper.js')
		],
		preprocessors: {
			'node_modules/vui-karma-jasmine-tester/matchers.js': ['directives'],
			'test/er/*.json': ['json_fixtures']
		},
		reporters: isRecordingResults ? ['json-dumper'] : ['progress','junit','coverage'],
		singleRun: true
	})

	karmaConfig.files = karmaConfig.files || [];
	karmaConfig.files.push( 'node_modules/vui-karma-jasmine-tester/matchers.js' );
	karmaConfig.files.push( 'node_modules/vui-karma-jasmine-tester/differs.js' );

	if( fs.existsSync( 'test/er/' ) ) {
		if( fs.readdirSync( 'test/er/' ).length != 0 ) {
        	karmaConfig.files.push( 'test/er/*.json' );
    	}
	} else {
		fs.mkdirSync( 'test/er/' );
	}

	var deferred = Q.defer();
	karma.start(karmaConfig, function() {
		deferred.notify();
	});
	return deferred.promise;
};

module.exports.test = test;
