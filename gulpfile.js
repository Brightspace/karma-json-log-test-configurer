var fs = require('fs');
var gulp = require('gulp');
var karma = require('karma').server;
var Q = require('q');
var kConfig = JSON.parse(fs.readFileSync(__dirname + '/karmaConfig.json').toString());

var recordingDir = 'test/rec/';
var recordedJSON = recordingDir + "*.json";

kConfig.files = [
	__dirname + '/test/*Spec.js',
	__dirname + '/differs.js',
	__dirname + '/matchers.js',
	__dirname + '/records.js'
];

kConfig.jsonFixturesPreprocessor.stripPrefix = recordingDir;

kConfig.preprocessors[recordedJSON] = ['json_fixtures'];
kConfig.preprocessors[__dirname + '/matchers.js'] = ["directives"];
kConfig.preprocessors[__dirname + '/test/*Spec.js'] = ["directives"];

if( fs.existsSync( recordingDir ) ) {
	if( fs.readdirSync( recordingDir ).length != 0 ) {
    	kConfig.files.push( recordedJSON );
	}
} else {
	fs.mkdirSync( recordingDir );
}

gulp.task( 'testRecording', function( ) {
	kConfig.directivesPreprocess.flags.js = { RECORDING : true };
	var deferred = Q.defer();
	karma.start(kConfig, function(exitCode) {
		if( exitCode ) {
			deferred.reject();
		} else {
			deferred.resolve();
		}
	});
	return deferred.promise;
});

gulp.task( 'testTesting', ['testRecording'], function( ) {
	kConfig.directivesPreprocess.flags.js = { RECORDING : false };
	var deferred = Q.defer();
	karma.start(kConfig, function(exitCode) {
		if( exitCode ) {
			deferred.reject();
		} else {
			deferred.resolve();
		}
	});
	return deferred.promise;
});

gulp.task( 'test', ['testTesting', 'testRecording'] );
