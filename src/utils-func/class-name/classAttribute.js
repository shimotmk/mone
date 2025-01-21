/**
 * External dependencies
 */
import clsx from 'clsx';

import { emptyStringToUndefined } from './empty-string-to-undefined.js';

export const stringToArrayClassName = ( className ) => {
	return className ? String( className ).split( ' ' ) : [];
};

export const arrayToStringClassName = ( classArray ) => {
	return Array.isArray( classArray ) ? classArray.join( ' ' ) : '';
};

export const existsClassName = ( classNames, targetClassName ) => {
	const classArray = Array.isArray( classNames )
		? classNames
		: stringToArrayClassName( classNames );

	if ( Array.isArray( targetClassName ) ) {
		return targetClassName.some(
			( target ) => classArray.indexOf( target ) !== -1
		);
	}
	return classArray.indexOf( targetClassName ) !== -1;
};

export const deleteClassName = ( targetClassNames, className ) => {
	const classArray = stringToArrayClassName( className );
	const targetClassArray = Array.isArray( targetClassNames )
		? targetClassNames
		: [ targetClassNames ];

	targetClassArray.forEach( ( targetClassName ) => {
		if ( existsClassName( className, targetClassName ) ) {
			const _deleteClassName = classArray.indexOf( targetClassName );
			classArray.splice( _deleteClassName, 1 );
		}
	} );
	return arrayToStringClassName( classArray );
};

export const addClassName = ( targetClassName, className ) => {
	const classArray = stringToArrayClassName( className );
	if ( ! existsClassName( className, targetClassName ) ) {
		classArray.push( targetClassName );
	}
	return arrayToStringClassName( classArray );
};

export const toggleClass = ( targetClassName, className, setAttributes ) => {
	if ( ! existsClassName( className, targetClassName ) ) {
		setAttributes( {
			className: emptyStringToUndefined(
				addClassName( targetClassName, className )
			),
		} );
	} else {
		const _className = deleteClassName( targetClassName, className );
		setAttributes( {
			className: emptyStringToUndefined( _className ),
		} );
	}
};

export const deleteClass = ( targetClassNames, className, setAttributes ) => {
	const _className = deleteClassName( targetClassNames, className );
	setAttributes( {
		className: emptyStringToUndefined( _className ),
	} );
};

export const deleteRegExClass = ( regEx, className, setAttributes ) => {
	const classArray = stringToArrayClassName( className );
	const filteredClassArray = classArray.filter(
		( classItem ) => ! regEx.test( classItem )
	);

	setAttributes( {
		className: emptyStringToUndefined( clsx( filteredClassArray ) ),
	} );
};
