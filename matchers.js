var d2l = d2l || {};
d2l.vui = d2l.vui || {};

d2l.vui.matchers = {
	jasmine: {
		toMatchRecordedObjectAt: function() {
			return {
				compare: function ( actual, recordedObjectPath, exceptions ) {

					var expectedResult;

					//@if !RECORDING
					expectedResult = d2l.vui.records.getRecord(recordedObjectPath);
					//@endif

					//@if RECORDING
					expectedResult = actual
					d2l.vui.records.setRecord(recordedObjectPath, expectedResult);
					//@endif

					for( ex in exceptions ) {
						expectedResult[ex] = exceptions[ex];
					}

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
