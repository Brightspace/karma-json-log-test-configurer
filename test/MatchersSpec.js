( function() {
	'use strict';

	var test_record_path;
	var test_record_object;

	describe( 'A matcher to match recorded objects', function() {
		beforeEach(function() {
			test_record_path = ['file', 'branch', 'leaf'];
			test_record_object = { 'branch' : { 'leaf': {
				'key1' : 'value1',
				'key2' : 'value2'
			} } };
			spyOn(vui.records, 'getRecord').and.returnValue(test_record_object.branch.leaf);
			spyOn(vui.records, 'setRecord').and.stub();
		});

		//@if RECORDING
		describe( 'in record mode', function() {
			it( 'records expected results', function() {
				vui.matchers.jasmine.toMatchRecordedObjectAt().compare(
					{ 'key1' : 'value1', 'key2' : 'value2' },
					test_record_path
				);
				expect(vui.records.setRecord).toHaveBeenCalled();
				expect(vui.records.getRecord).not.toHaveBeenCalled();
			});
		});
		//@endif

		//@if !RECORDING
		describe( 'in testing mode', function() {
			it( 'retrieves expected results', function() {
				 vui.matchers.jasmine.toMatchRecordedObjectAt().compare(
					{ 'key1' : 'value1',
					  'key2' : 'value2' },
					test_record_path
				);
				expect(vui.records.getRecord).toHaveBeenCalled();
				expect(vui.records.setRecord).not.toHaveBeenCalled();
			});

			it( 'returns a pass on matching record', function() {
				var ret = vui.matchers.jasmine.toMatchRecordedObjectAt().compare(
					{ 'key1' : 'value1',
					  'key2' : 'value2' },
					test_record_path
				);
				expect(ret.pass).toBeTruthy();
			});

			it( 'returns a failure on mismatched record value', function() {
				var ret = vui.matchers.jasmine.toMatchRecordedObjectAt().compare(
					{ 'key1' : 'bad',
					  'key2' : 'value2' },
					test_record_path
				);
				expect(ret.pass).toBeFalsy();
			});

			it( 'returns a failure on missing record key', function() {
				var ret = vui.matchers.jasmine.toMatchRecordedObjectAt().compare(
					{ 'key1' : 'value1',
					  'key2' : 'value2',
					  'bad' : 'bad' },
					test_record_path
				);
				expect(ret.pass).toBeFalsy();
			});

			it( 'fails on additional record key', function() {
				var ret = vui.matchers.jasmine.toMatchRecordedObjectAt().compare(
					{ 'key2' : 'value2' },
					test_record_path
				);
				expect(ret.pass).toBeFalsy();
			});

			it( 'passes on a maching exception for a stored record key', function() {
				var ret = vui.matchers.jasmine.toMatchRecordedObjectAt().compare(
					{ 'key1' : 'except',
					  'key2' : 'value2' },
					test_record_path,
					{ 'key1' : 'except' }
				);
				expect(ret.pass).toBeTruthy();
			});

			it( 'fails on mismatched exception for a stored record key', function() {
				var ret = vui.matchers.jasmine.toMatchRecordedObjectAt().compare(
					{ 'key1' : 'value1',
					  'key2' : 'value2' },
					test_record_path,
					{ 'key1' : 'except' }
				);
				expect(ret.pass).toBeFalsy();
			});

		});
		//@endif

	});

} )();
