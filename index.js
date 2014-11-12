'use strict';

var fs = require( 'fs' );

var getConfig = function( recordPath, isRecording ) {
	var config = {
		directivesPreprocess: {
			"flags" : {
				"js" : {
					"RECORDING" : isRecording
				}
			}
		},
		files : [
			{ pattern: __dirname + '/differs.js', served: true,	included: true,	watched: false },
			{ pattern: __dirname + '/matchers.js', served: true, included: true, watched: false },
			{ pattern: __dirname + '/records.js', served: true, included: true, watched: false },
			{ pattern: recordPath + '**/*.json', served: true, included: true, watched: false }
		],
		jsonFixturesPreprocessor : {
			variableName: "__RECORDS__",
			stripPrefix: recordPath
		},
		jsonLogReporter : {
			"outputPath" : recordPath
		},
		reporters: [ ],
		plugins: [
			"karma-json-fixtures-preprocessor",
			"karma-directives-preprocessor",
			"vui-karma-json-log-reporter"
		],
		preprocessors: { }
	};

	config.preprocessors[__dirname + "/matchers.js"] = ['directives'];
	config.preprocessors[recordPath + "**/*.json"] = ['json_fixtures'];
	if( isRecording == true ) {
		config.reporters.concat('json-log');
	}

	return config;
}

var addConfig = function( config, recordPath, isRecording ) {
	var vuiKarmaConfig = getConfig(recordPath, isRecording);
	var karmaConfig = JSON.parse(JSON.stringify(config));

	karmaConfig.files = karmaConfig.files.concat(vuiKarmaConfig.files);
	karmaConfig.plugins = karmaConfig.plugins.concat(vuiKarmaConfig.plugins);
	karmaConfig.reporters = karmaConfig.reporters.concat(vuiKarmaConfig.reporters);
	karmaConfig.directivesPreprocess = vuiKarmaConfig.directivesPreprocess;
	karmaConfig.jsonFixturesPreprocessor = vuiKarmaConfig.jsonFixturesPreprocessor;
	karmaConfig.jsonLogReporter = vuiKarmaConfig.jsonLogReporter;

	for( var p in vuiKarmaConfig.preprocessors ) {
		karmaConfig.preprocessors[p] = vuiKarmaConfig.preprocessors[p];
	}

	return karmaConfig;
};

module.exports.addConfig = addConfig;
