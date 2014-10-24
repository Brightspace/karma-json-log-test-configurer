var jsonDumper = function( config ) {
	var path = config['jsonDumper']['outputDirectory'] || 'json-dumper/';

	this.onBrowserLog = function(browser, log, type) {

		if( type != "dump" ) {
			return;
		}

		var objectMerge = require( 'object-merge' );
		var fs = require( 'fs' );

		var logObj = JSON.parse(log.substring(1, log.length-1));
		var fileObj;
		var data;
		for( var file in logObj ) {
			data = fs.readFileSync( path + file + ".json", { "flag": "a+"});
			fileObj = data.length != 0 ? JSON.parse(data.toString()) : {};
			fileObj = objectMerge( fileObj, logObj[file] );
			fs.writeFileSync( path + file + ".json", JSON.stringify(fileObj, null, " "));
		}
	};
};

jsonDumper.$inject = ['config'];

module.exports['reporter:json-dumper'] =  ['type', jsonDumper];
