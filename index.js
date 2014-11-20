'use strict';

var fs = require( 'fs' );

var getConfig = function( isRecording ) {

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
			{ pattern: './rec/**/*.json', served: true, included: true, watched: false }
		],
		jsonFixturesPreprocessor : {
			variableName: "__RECORDS__",
			stripPrefix: 'rec/'
		},
		jsonLogReporter : {
			"outputPath" : './rec/'
		},
		reporters: [ ],
		plugins: [
			require("karma-json-fixtures-preprocessor"),
			require("karma-directives-preprocessor"),
			require("vui-karma-json-log-reporter")
		],
		preprocessors: { }
	};

	config.preprocessors[__dirname + "/matchers.js"] = ['directives'];
	config.preprocessors["./rec/**/*.json"] = ['json_fixtures'];
	if( isRecording == true ) {
		config.reporters = config.reporters.concat('json-log');
	}

	return config;
}

var addConfig = function( config, isRecording ) {
	var vuiKarmaConfig = getConfig( isRecording );
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
