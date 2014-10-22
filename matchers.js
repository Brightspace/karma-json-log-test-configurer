var d2l = d2l || {};
d2l.vui = d2l.vui || {};

d2l.vui.matchers = {
	jasmine: {
		toMatchER: function() {
			return {
				compare: function ( actual, expected ) {

					var expectedResult;
					var path = expected.split(".");

					// @if !ER_GEN
					expectedResult = __ER__; // will not exist if there are no ERs yet.
					// @endif

					// @if ER_GEN
					expectedResult = actual;
				    var recordingRoot = {};
				    var recordedActual = recordingRoot;
				    // @endif

				   	for( var i = 0; i < path.length; i++ ) {

				   		// @if !ER_GEN
				   		// find the expected result stored at the expected path.
				       	expectedResult = expectedResult[path[i]] || {};
				   		// @endif

						// @if ER_GEN
				       	// record a destination path containing the result at the leaf.
						recordingRoot[path[i]] = (i != path.length - 1) ? {} : expectedResult;
						recordingRoot = recordingRoot[path[i]];
					    // @endif

				    };

		       		// @if ER_GEN
					dump(JSON.stringify(recordedActual));
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
