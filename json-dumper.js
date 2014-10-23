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
			data = fs.readFileSync("test/rec/" + file + ".json", { "flag": "a+"});
			fileObj = data.length != 0 ? JSON.parse(data.toString()) : {};
			fileObj = objectMerge( fileObj, logObj[file] );
			fs.writeFileSync("test/rec/" + file + ".json", JSON.stringify(fileObj, null, " "));
		}
	};

};

module.exports = {
  'reporter:json-dumper': ['type', JSONDumper]
};
