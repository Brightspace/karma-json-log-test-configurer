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
			reporters: [ { type: 'lcov', dir: 'test/output/coverage/' } ]

		},
		directivesPreprocess: {
			flags: {
				js: {
					RECORDING: isRecordingResults == true
				}
			}
		},
		frameworks: ['jasmine'],
		jsonFixturesPreprocessor: {
			variableName: '__RECORDS__',
			stripPrefix: 'test/rec/'
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
			'test/rec/*.json': ['json_fixtures']
		},
		reporters: isRecordingResults ? ['json-dumper'] : ['progress','junit','coverage'],
		singleRun: true
	})

	karmaConfig.files = karmaConfig.files || [];
	karmaConfig.files.push( 'node_modules/vui-karma-jasmine-tester/differs.js' );
	karmaConfig.files.push( 'node_modules/vui-karma-jasmine-tester/matchers.js' );
	karmaConfig.files.push( 'node_modules/vui-karma-jasmine-tester/records.js' );


	if( fs.existsSync( 'test/rec/' ) ) {
		if( fs.readdirSync( 'test/rec/' ).length != 0 ) {
        	karmaConfig.files.push( 'test/rec/*.json' );
    	}
	} else {
		fs.mkdirSync( 'test/rec/' );
	}

	var deferred = Q.defer();
	karma.start(karmaConfig, function() {
		deferred.notify();
	});
	return deferred.promise;
};

module.exports.test = test;
