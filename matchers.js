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

				var diff = vui.differs.json.diffLogs( actual, expectedResult, exceptions );

	       		var retStr = "";
				for( d in diff ) {
					retStr = retStr + "Expected " + d + " to be " + diff[d].expected + " but got " + diff[d].actual + "\n";
				}

				return {
					pass: retStr == "",
					message: retStr
				};

			}
		};
	}
};
