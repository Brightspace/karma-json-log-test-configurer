var vui = vui || {};
vui.differs = vui.differs || {};

vui.differs.json = {
	diffLogs: function ( actualLog, expectedLog, exceptions ) {

		var expected = JSON.parse(JSON.stringify(expectedLog));
		var diff = {};

		for( ex in exceptions ) {
			expected[ex] = exceptions[ex];
		}

		for( var p in actualLog ) {
			if(actualLog[p] != expected[p]) {
				diff[p] = {
					"expected" : expected[p],
					"actual" : actualLog[p]
				};
			}
			delete expected[p];
		}

		for( var q in expected ) {
			// ignore nested objects
			if( expected[q] !== Object(expected[q]) ) {
				diff[p] = {
					"expected" : expected[q],
					"actual": "undefined"
				};
			}
		}

		return diff;
	}
};
