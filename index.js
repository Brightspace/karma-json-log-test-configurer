'use strict';

var fs = require( 'fs' );
var karma = require('karma').server;
var objectMerge = require('object-merge');
var Q = require('q');
var dumper = require('vui-karma-json-log-reporter');
var kConfig = JSON.parse(fs.readFileSync(__dirname + '/karmaConfig.json').toString());


var test = function( karmaConfig, isRecordingResults ) {

	var recordingDir = 'test/rec/';
	var recordedJSON = recordingDir + "*.json";

	karmaConfig = objectMerge( karmaConfig, kConfig );

	karmaConfig.directivesPreprocess.flags.js = { RECORDING : isRecordingResults == true };
	karmaConfig.jsonLogReporter = { "outputPath" : recordingDir };
	karmaConfig.jsonFixturesPreprocessor.stripPrefix = recordingDir;

	if( isRecordingResults ) {
		karmaConfig.plugins.push(dumper);
		karmaConfig.reporters = ['json-log'];
	}

	karmaConfig.files = karmaConfig.files || [];
	karmaConfig.files.push( __dirname + '/differs.js' );
	karmaConfig.files.push( __dirname + '/matchers.js' );
	karmaConfig.files.push( __dirname + '/records.js' );

	karmaConfig.preprocessors[recordedJSON] = ['json_fixtures'];
	karmaConfig.preprocessors[__dirname + '/matchers.js'] = ["directives"];

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
