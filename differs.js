var d2l = d2l || {};
d2l.vui = d2l.vui || {};

d2l.vui.differs = {
	_private: {
		createDeclassedClone: function( classedElement ) {
			if( classedElement == document.body ) {
				return classedElement;
			}

			var element = classedElement.cloneNode(false);
			element.className="";
			var parent = d2l.vui.differs._private.createDeclassedClone( classedElement.parentNode )
				.appendChild( element );

			return element;
		},

		removeDeclassedClone: function( declassedElement ) {
			if( !declassedElement.parent ) {
				return;
			}

			declassedElement.parent.removeChild( declassedElement );
			removeDeclassedClone( declassedElement.parent );
		}
	},

	diffDefaultStyle: function( classStyledElement, pseudoElt ) {
		var defaultElement = d2l.vui.differs._private.createDeclassedClone(classStyledElement);

		var actualComputed = window.getComputedStyle( classStyledElement, pseudoElt || null );

		var defaultComputed = window.getComputedStyle( defaultElement, pseudoElt || null );

		if (!actualComputed || !defaultComputed) {
			d2l.vui.differs._private.removeDeclassedClone( defaultElement );
			return null;
		}

		var diff = {};

		for (var i = 0; i < actualComputed.length; i++) {
			var aName = actualComputed.item(i);

			var actualValue = actualComputed.getPropertyValue(aName);
			var defaultValue = defaultComputed.getPropertyValue(aName);

			if ( actualValue === defaultValue ) {
				continue;
			}

			diff[aName] = actualValue;
		}

		d2l.vui.differs._private.removeDeclassedClone( defaultElement );

		return diff;
	},

	isUserAgentOS: function( os ) {
		return navigator.userAgent.indexOf( os ) != -1;
	}

};
