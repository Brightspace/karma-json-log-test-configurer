var d2l = d2l || {};
d2l.vui = d2l.vui || {};

d2l.vui.differs = {

	diffDefaultStyle: function( classStyledElement, pseudoElt ) {
		var defaultElement = classStyledElement.cloneNode(true);
		defaultElement.className="";
		classStyledElement.parentNode.appendChild( defaultElement );

    	var actualComputed = window.getComputedStyle( classStyledElement, pseudoElt || null );

		var defaultComputed = window.getComputedStyle( defaultElement, pseudoElt || null );

        if (!actualComputed || !defaultComputed) {
			classStyledElement.parentNode.removeChild( defaultElement );
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

		classStyledElement.parentNode.removeChild( defaultElement );

		return diff;
	}

};
