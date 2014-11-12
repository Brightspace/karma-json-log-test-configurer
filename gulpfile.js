var fs = require('fs');
var gulp = require('gulp');
var karma = require('karma').server;
var Q = require('q');

gulp.task( 'testRecording', function( ) {
	var deferred = Q.defer();
	karma.start({
			configFile: __dirname + "/test/recording.karma.conf.js"
		},
		function(exitCode) {
			exitCode ? deferred.reject() : deferred.resolve();
		}
	);
	return deferred.promise;
});

gulp.task( 'testTesting', ['testRecording'], function( ) {
	var deferred = Q.defer();
	karma.start({
			configFile: __dirname + "/test/testing.karma.conf.js"
		},
		function(exitCode) {
			exitCode ? deferred.reject() : deferred.resolve();
		}
	);
	return deferred.promise;
});

gulp.task( 'test', ['testTesting', 'testRecording'] );
