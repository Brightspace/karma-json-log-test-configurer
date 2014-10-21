var fs = require('fs');

var mergeObjects = function ( prevObj, currObj ) {
	var mObj = {};

    for (var key in prevObj) {
		if( currObj.hasOwnProperty( key ) ) {
			if ( prevObj[key]!=null && prevObj[key].constructor==Object ) {
				mObj[key] = mergeObjects( prevObj[key], currObj[key] );
			} else {
				mObj[key] = currObj[key];
			}
		} else {
			mObj[key] = prevObj[key];
		}
	}

	// store remaining keys.
	for (var key in currObj) {
		if( !prevObj.hasOwnProperty( key ) ) {
			mObj[key] = currObj[key];
		}
	}

	return mObj;
}

var JSONDumper = function() {
	this.onBrowserLog = function(browser, log, type) {
		if( type != "dump" ) {
			return;
		}

		var logObj = JSON.parse(log.substring(1, log.length-1));
		var fileObj;
		for( file in logObj ) {
			fs.readFile("test/er/" + file + ".json", { "flag": "w+"}, function (err, data) {
				fileObj = data.toJSON();
				fileObj = mergeObjects( fileObj, logObj[file] );
				fs.writeFileSync("test/er/" + file + ".json", JSON.stringify(fileObj));
			});
		}
	};

};

module.exports = {
  'reporter:json-dumper': ['type', JSONDumper]
};
