var d2l = d2l || {};
d2l.vui = d2l.vui || {};

d2l.vui.records = {
	getRecord : function( path ) {
		record = __RECORDS__; // will not exist if there are no recorded objects yet.

	   	for( var i = 0; i < path.length; i++ ) {
	   		// find the expected result stored at the expected path.
			record = record[path[i]] || {};
	    };

		return record;
	},

	setRecord: function( path, record ) {
	    var recordingRoot = {};
	    var recordedLeaf = recordingRoot;
	    var recordedRoot = recordingRoot;

	   	for( var i = 0; i < path.length; i++ ) {
			recordedLeaf = recordingRoot;
			recordingRoot[path[i]] = {};
			recordingRoot = recordingRoot[path[i]];
	    };

		// Clear previous record leaf.
		dump(JSON.stringify(recordedRoot));
		// Record new leaf.
		recordedLeaf[path[path.length-1]] = record;
		dump(JSON.stringify(recordedRoot));
	},

	getElementRecordPath: function( elem, branchProperties ) {
		branchProperties = branchProperties || [];

		if(branchProperties.indexOf('className') == -1) {
			branchProperties.unshift('className');
		}

		if(branchProperties.indexOf('tagName') == -1) {
			branchProperties.unshift('tagName');
		}

		branchProperties.sort(function(a,b) {
		    if( a == 'tagName' || (a == 'className' && b != 'tagName')) return -1;
		    if( b == 'tagName' || (b == 'className' && a != 'tagName')) return 1;
		    return a > b;
		});

		var path = [];
		for( node in branchProperties ) {
			path.push(
				((branchProperties[node] != 'tagName') ? (branchProperties[node] + "=") : "")
				+ elem[branchProperties[node]]
			);
		}

		return path;

	}
};
