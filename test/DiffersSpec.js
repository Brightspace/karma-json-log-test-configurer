( function() {
	'use strict';

	describe( 'A differ to extract styles from class settings', function() {
		var elem;
		var child;

		beforeEach(function() {
			var style = document.createElement('style');
			document.head.appendChild(style);

			var styleSheet = style.sheet;
			styleSheet.insertRule(".class-style { color: #abcdef; }");
			styleSheet.insertRule(".class-style > div { color: #fedcba; }");

			elem = document.createElement("div");
			child = document.createElement("div");
			elem.appendChild(child);
			document.body.appendChild(elem);
		});

		it( 'reports no differences for an element with no class styles', function() {
			var diff = d2l.vui.differs.diffDefaultStyle( elem );
			expect(diff).toEqual({});
		});

		it( 'reports no differences for an element with a styleless class', function() {
			elem.className = "class-name";
			var diff = d2l.vui.differs.diffDefaultStyle( elem );
			expect(diff).toEqual({});
		});

		it( 'reports style difference for an element with a class style', function() {
			elem.className = "class-style";
			var diff = d2l.vui.differs.diffDefaultStyle( elem );
			for( var style in diff ) {
				expect(diff[style]).toBe('rgb(171, 205, 239)');
			}
		});

		it( 'reports style difference for an element with a class style and a styleless class', function() {
			elem.className = "class-style class-name";
			var diff = d2l.vui.differs.diffDefaultStyle( elem );
			for( var style in diff ) {
				expect(diff[style]).toBe('rgb(171, 205, 239)');
			}
		});

		it( 'compares class styles inherited from parents', function() {
			elem.className = "class-style";

			var diff = d2l.vui.differs.diffDefaultStyle( child );
			for( var style in diff ) {
				expect(diff[style]).toBe('rgb(254, 220, 186)');
			}
		});

	});

} )();
