import { emptyStringToUndefined } from './empty-string-to-undefined.js';

export const stringToArrayClassName = ( classList ) => {
	return classList ? String( classList ).split( ' ' ) : [];
};

export const arrayToStringClassName = ( classArray ) => {
	return Array.isArray( classArray ) ? classArray.join( ' ' ) : '';
};

export const existsClassName = ( targetClassName, classList ) => {
	const classArray = Array.isArray( classList )
		? classList
		: stringToArrayClassName( classList );

	if ( Array.isArray( targetClassName ) ) {
		return targetClassName.some(
			( target ) => classArray.indexOf( target ) !== -1
		);
	}
	return classArray.indexOf( targetClassName ) !== -1;
};

export const deleteClassName = ( targetClassNames, classList ) => {
	const classArray = stringToArrayClassName( classList );
	const targetClassArray = Array.isArray( targetClassNames )
		? targetClassNames
		: [ targetClassNames ];

	targetClassArray.forEach( ( targetClassName ) => {
		if ( existsClassName( targetClassName, classList ) ) {
			const index = classArray.indexOf( targetClassName );
			classArray.splice( index, 1 );
		}
	} );
	return arrayToStringClassName( classArray );
};

export const addClassName = ( targetClassName, classList ) => {
	const classArray = Array.isArray( classList )
		? classList
		: stringToArrayClassName( classList );
	if ( ! existsClassName( targetClassName, classList ) ) {
		classArray.push( targetClassName );
	}
	return arrayToStringClassName( classArray );
};

export const deleteRegExClassName = ( regEx, classList ) => {
	const classArray = Array.isArray( classList )
		? classList
		: stringToArrayClassName( classList );
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

export const toggleClass = ( targetClassName, classList, setAttributes ) => {
	const updatedClassName = existsClassName( targetClassName, classList )
		? deleteClassName( targetClassName, classList )
		: addClassName( targetClassName, classList );

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
