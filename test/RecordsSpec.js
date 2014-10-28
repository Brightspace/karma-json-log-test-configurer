( function() {
	'use strict';

	describe( 'A recorder to record and retrieve objects', function() {
		beforeEach(function() {
			__RECORDS__.file = { "branch" : { "leaf" : {"key" : "value" } } };
		});

		describe( 'A get records function', function() {
			it( 'retrieves a record', function() {
				var rec = d2l.vui.records.getRecord( ["file", "branch", "leaf"] );
				expect(rec.key).toBe("value");
			});
		});

		describe( 'A set records function', function() {
			beforeEach( function() {
				spyOn(window, 'dump');
			})

			it( 'dumps a JSON object with the specified key/value leaf', function() {
				var rec = d2l.vui.records.setRecord( ["file", "branch", "leaf"], {"key": "new"} );
				expect(window.dump).toHaveBeenCalledWith("{\"file\":{\"branch\":{\"leaf\":{\"key\":\"new\"}}}}");
			});

			it( 'dumps a JSON object with an empty leaf to clear the current value', function() {
				var rec = d2l.vui.records.setRecord( ["file", "branch", "leaf"], {"key": "new"} );
				expect(window.dump).toHaveBeenCalledWith("{\"file\":{\"branch\":{\"leaf\":{}}}}");
			});
		});

		describe( 'A function to get a standardized record path given an element', function() {
			var elem;

			beforeEach(function() {
				elem = document.createElement("div");
				elem.className="class-name";
				document.body.appendChild(elem);
			});

			it( 'provides a path starding with tag name then class name', function() {
				var path = d2l.vui.records.getElementRecordPath( elem );
				expect(path.length).toBe(2);
				expect(path[0]).toBe("DIV");
				expect(path[1]).toBe("className=class-name");
			});

			it( 'will provide className and tagName only once', function() {
				var path = d2l.vui.records.getElementRecordPath( elem, ['className', 'tagName'] );
				expect(path.length).toBe(2);
				expect(path[0]).toBe("DIV");
				expect(path[1]).toBe("className=class-name");
			});

			it( 'will will append to tagName and className any branch properties specified', function() {
				elem.id = "id";
				var path = d2l.vui.records.getElementRecordPath( elem, ['id'] );
				expect(path.length).toBe(3);
				expect(path[0]).toBe("DIV");
				expect(path[1]).toBe("className=class-name");
				expect(path[2]).toBe("id=id");
			});

			it( 'will reorder className and tagName to be ahead of any branch properties', function() {
				elem.id = "id";
				var path = d2l.vui.records.getElementRecordPath( elem, ['id', 'className', 'tagName'] );
				expect(path.length).toBe(3);
				expect(path[0]).toBe("DIV");
				expect(path[1]).toBe("className=class-name");
				expect(path[2]).toBe("id=id");
			});

			it( 'will still provide branch property values if unspecified in the node', function() {
				var path = d2l.vui.records.getElementRecordPath( elem, ['id'] );
				expect(path.length).toBe(3);
				expect(path[0]).toBe("DIV");
				expect(path[1]).toBe("className=class-name");
				expect(path[2]).toBe("id=");
			});

		});

	});

} )();
