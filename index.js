'use strict';

var fs = require( 'fs' );
var karma = require('karma').server;
var objectMerge = require('object-merge');
var Q = require('q');
var dumper = require('./json-dumper')


var test = function( karmaConfig, isRecordingResults ) {

	var recordingDir = 'test/rec/';
	var recordedJSON = recordingDir + "*.json";

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
			stripPrefix: recordingDir
		},
		junitReporter: {
			outputFile: 'test/output/unit.xml',
			suite: 'unit'
		},
		jsonDumper: {
			outputDirectory: recordingDir
		},
		plugins: [
			'karma-coverage',
			'karma-directives-preprocessor',
			'karma-jasmine',
			'karma-json-fixtures-preprocessor',
			'karma-junit-reporter',
			'karma-phantomjs-launcher',
			dumper
		],
		preprocessors: {
			'node_modules/vui-karma-jasmine-tester/matchers.js': ['directives'],
		},
		reporters: isRecordingResults ? ['json-dumper'] : ['progress','junit','coverage'],
		singleRun: true
	})

	karmaConfig.files = karmaConfig.files || [];
	karmaConfig.files.push( 'node_modules/vui-karma-jasmine-tester/differs.js' );
	karmaConfig.files.push( 'node_modules/vui-karma-jasmine-tester/matchers.js' );
	karmaConfig.files.push( 'node_modules/vui-karma-jasmine-tester/records.js' );

	karmaConfig.preprocessors[recordedJSON] = ['json_fixtures'];

	if( fs.existsSync( recordingDir ) ) {
		if( fs.readdirSync( recordingDir ).length != 0 ) {
        	karmaConfig.files.push( recordedJSON );
    	}
	} else {
		fs.mkdirSync( recordingDir );
	}

	var deferred = Q.defer();
	karma.start(karmaConfig, function(exitCode) {
		if( exitCode ) {
			deferred.reject();
		} else {
			deferred.resolve();
		}
	});
	return deferred.promise;
};

module.exports.test = test;
