import { emptyStringToUndefined } from './empty-string-to-undefined.js';

export const stringToArrayClassName = ( classList ) => {
	if ( Array.isArray( classList ) ) {
		return classList;
	}
	return classList ? String( classList ).split( ' ' ) : [];
};

export const arrayToStringClassName = ( classArray ) => {
	return Array.isArray( classArray ) ? classArray.join( ' ' ) : '';
};

export const existsClassName = ( targetClassList, classList ) => {
	const classArray = stringToArrayClassName( classList );

	if ( Array.isArray( targetClassList ) ) {
		return targetClassList.some(
			( target ) => classArray.indexOf( target ) !== -1
		);
	}
	return classArray.indexOf( targetClassList ) !== -1;
};

export const deleteClassName = ( targetClassList, classList ) => {
	const classArray = stringToArrayClassName( classList );
	const targetClassArray = Array.isArray( targetClassList )
		? targetClassList
		: [ targetClassList ];

	targetClassArray.forEach( ( className ) => {
		if ( existsClassName( className, classList ) ) {
			const index = classArray.indexOf( className );
			classArray.splice( index, 1 );
		}
	} );
	return arrayToStringClassName( classArray );
};

export const addClassName = ( targetClassList, classList ) => {
	const classArray = stringToArrayClassName( classList );
	if ( ! existsClassName( targetClassList, classList ) ) {
		classArray.push( targetClassList );
	}
	return arrayToStringClassName( classArray );
};

export const deleteRegExClassName = ( regEx, classList ) => {
	const classArray = stringToArrayClassName( classList );
	const filteredClassArray = classArray.filter(
		( classItem ) => ! regEx.test( classItem )
	);

	return arrayToStringClassName( filteredClassArray );
};

export const addClass = ( targetClassNames, classList, setAttributes ) => {
	const updatedClassName = addClassName( targetClassNames, classList );
	setAttributes( {
		className: emptyStringToUndefined( updatedClassName ),
	} );
};

export const toggleClass = ( targetClassList, classList, setAttributes ) => {
	const updatedClassName = existsClassName( targetClassList, classList )
		? deleteClassName( targetClassList, classList )
		: addClassName( targetClassList, classList );

	setAttributes( {
		className: emptyStringToUndefined( updatedClassName ),
	} );
};

export const deleteClass = ( targetClassNames, classList, setAttributes ) => {
	const updatedClassName = deleteClassName( targetClassNames, classList );
	setAttributes( {
		className: emptyStringToUndefined( updatedClassName ),
	} );
};

export const deleteRegExClass = ( regEx, classList, setAttributes ) => {
	setAttributes( {
		className: emptyStringToUndefined(
			deleteRegExClassName( regEx, classList )
		),
	} );
};
