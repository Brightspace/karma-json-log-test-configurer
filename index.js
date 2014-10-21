'use strict';

var fs = require( 'fs' );
var karma = require('karma').server;
var Q = require('q');

var test = function( karmaConfig, isRecordingResults ) {

	karmaConfig.files = karmaConfig.files || files;
	karmaConfig.files.push( 'node_modules/vui-tester/jasmine/matchers.js' );
	karmaConfig.files.push( 'node_modules/vui-tester/jasmine/differs.js' );

	karmaConfig.preprocessors = karmaConfig.preprocessors || {};
	karmaConfig.preprocessors['node_modules/vui-tester/jasmine/matchers.js'] = ['directives'];
	karmaConfig.preprocessors['test/er/*.json'] = ['json_fixtures'];

	karmaConfig.directivesPreProcess = karmaConfig.directivesPreProcess || {};
	karmaConfig.directivesPreProcess.flags = karmaConfig.directivesPreProcess.flags || {};
	karmaConfig.directivesPreProcess.flags.js = karmaConfig.directivesPreProcess.flags.js || {};
	karmaConfig.directivesPreProcess.flags.js.ER_GEN = isRecordingResults == true;

	karmaConfig.jsonFixturesPreprocessor = karmaConfig.jsonFixturesPreprocessor || {};
	karmaConfig.jsonFixturesPreprocessor.variableName = '__ER__';
	karmaConfig.jsonFixturesPreprocessor.stripPrefix = 'test/er/';

	karmaConfig.action = 'run';
	karmaConfig.autoWatch = false;
	karmaConfig.browsers = ['PhantomJS'];
	karmaConfig.coverageReporter = {
		reporters: [
			{ type: 'html', dir: 'test/output/coverage/' },
			{ type: 'cobertura', dir: 'test/output/coverage/' }
		]
	};
	karmaConfig.frameworks = ['jasmine'];
	karmaConfig.junitReporter = {
		outputFile: 'test/output/unit.xml',
		suite: 'unit'
	};
	karmaConfig.plugins = [
		require('./json-dumper.js'),
		'karma-coverage',
		'karma-directives-preprocessor',
		'karma-jasmine',
		'karma-json-fixtures-preprocessor',
		'karma-junit-reporter',
		'karma-phantomjs-launcher',
		'karma-script-launcher'
	];
	karmaConfig.reporters = isRecordingResults ? ['json-dumper'] : ['progress','junit','coverage'];
	karmaConfig.debugLevel = 'config.LOG_DEBUG';
	karmaConfig.singleRun = true;

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
