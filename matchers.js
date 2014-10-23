var d2l = d2l || {};
d2l.vui = d2l.vui || {};

d2l.vui.matchers = {
	jasmine: {
		toMatchRecordedObject: function() {
			return {
				compare: function ( actual, expected ) {

					var expectedResult;
					var path = expected.split(".");

					// @if !RECORDING
					expectedResult = __RECORDS__; // will not exist if there are no recorded objects yet.
					// @endif

					// @if RECORDING
				    var recordingRoot = {};
				    var recordedLeaf = recordingRoot;
				    var recordedRoot = recordingRoot;
				    // @endif

				   	for( var i = 0; i < path.length; i++ ) {

				   		// @if !RECORDING
				   		// find the expected result stored at the expected path.
						expectedResult = expectedResult[path[i]] || {};
				   		// @endif

						// @if RECORDING
				       	// record a destination path containing the result at the leaf.
						recordedLeaf = recordingRoot;
						recordingRoot[path[i]] = {};
						recordingRoot = recordingRoot[path[i]];
					    // @endif

				    };

		       		// @if RECORDING
					// Clear previous record leaf.
					dump(JSON.stringify(recordedRoot));
					// Record new leaf.
					recordedLeaf[path[path.length-1]] = actual;
					dump(JSON.stringify(recordedRoot));

					expectedResult = actual;
					// @endif

		       		var retStr = "";
			        for( var p in actual ) {
						if(actual[p] === expectedResult[p]) {
							continue;
						}
		       			retStr = retStr + "Expected " + p + " to be " + expectedResult[p] + " but got " + actual[p] + " \n";
		       		}

					return {
						pass: retStr == "",
						message: retStr
					};

				}
			};
		}
	}
};
