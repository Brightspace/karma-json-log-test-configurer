var vui = vui || {};
vui.matchers = vui.matchers || {};

vui.matchers.jasmine = {
		toMatchRecordedObjectAt: function() {
			return {
				compare: function ( actual, recordedObjectPath, exceptions ) {

					var expectedResult;

					//@if !RECORDING
				expectedResult = vui.records.getRecord(recordedObjectPath);
					//@endif

					//@if RECORDING
					expectedResult = actual
				vui.records.setRecord(recordedObjectPath, expectedResult);
					//@endif

					for( ex in exceptions ) {
						expectedResult[ex] = exceptions[ex];
					}

		       		var retStr = "";
			        for( var p in actual ) {
						if(actual[p] != expectedResult[p]) {
		       				retStr = retStr + "Expected " + p + " to be " + expectedResult[p] + " but got " + actual[p] + " \n";
		       			}
		       			delete expectedResult[p];
		       		}

		       		for( var q in expectedResult ) {
		       			// ignore nested records
		       			if( expectedResult[q] !== Object(expectedResult[q]) ) {
		       				retStr = retStr + "Expected " + q + " to be " + expectedResult[q] + " but got undefined.\n";
		       			}
		       		}

					return {
						pass: retStr == "",
						message: retStr
					};

				}
			};
		}
};
