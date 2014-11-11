var vui = vui || {};
vui.differs = vui.differs || {};

vui.differs.dom = {
	_private: {
		createDeclassedClone: function( classedElement ) {
			if( classedElement == document.body ) {
				return classedElement;
			}

			var element = classedElement.cloneNode( false );
			element.className="";
			var parent = vui.differs.dom._private.createDeclassedClone( classedElement.parentNode )
				.appendChild( element );

			return element;
		},

		removeDeclassedClone: function( declassedElement ) {
			if( !declassedElement.parent ) {
				return;
			}

			declassedElement.parent.removeChild( declassedElement );
			removeDeclassedClone( declassedElement.parent );
		},

		getStyleDeclarationDiff: function( cssStyleDeclarationA, cssStyleDeclarationB ) {
			var diff = {};

			for (var i = 0; i < cssStyleDeclarationA.length; i++) {
				var aName = cssStyleDeclarationA.item(i);

				var actualValue = cssStyleDeclarationA.getPropertyValue(aName);
				var defaultValue = cssStyleDeclarationB.getPropertyValue(aName);

				if ( actualValue === defaultValue ) {
					continue;
				}

				diff[aName] = actualValue;
			}

			return diff;
		}
	},

	diffDefaultStyle: function( classStyledElement ) {
		var defaultElement = vui.differs.dom._private.createDeclassedClone( classStyledElement );

		var actualComputed = window.getComputedStyle( classStyledElement );

		var defaultComputed = window.getComputedStyle( defaultElement );

		if ( !actualComputed || !defaultComputed ) {
			d2l.vui.differs._private.removeDeclassedClone( defaultElement );
			return null;
		}

		var diff = vui.differs.dom._private.getStyleDeclarationDiff( actualComputed, defaultComputed );

		vui.differs.dom._private.removeDeclassedClone( defaultElement );

		return diff;
	},

	isUserAgentOS: function( os ) {
		return navigator.userAgent.indexOf( os ) != -1;
	}

};

vui.differs.json = {
	diffLogs: function ( actualLog, expectedLog, exceptions ) {

		var expected = JSON.parse(JSON.stringify(expectedLog));
		var diff = {};

		for( ex in exceptions ) {
			expected[ex] = exceptions[ex];
		}

		var retStr = "";
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
