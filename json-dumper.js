var JSONDumper = function() {
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
			data = fs.readFileSync("test/er/" + file + ".json", { "flag": "a+"});
			fileObj = JSON.parse(data.toString());
			fileObj = objectMerge( fileObj, logObj[file] );
			fs.writeFileSync("test/er/" + file + ".json", JSON.stringify(fileObj));
		}
	};

};

module.exports = {
  'reporter:json-dumper': ['type', JSONDumper]
};
