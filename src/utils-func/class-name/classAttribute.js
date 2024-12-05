/**
 * External dependencies
 */
import clsx from 'clsx';

import { emptyStringToUndefined } from './empty-string-to-undefined.js';

export const classStringToClassArray = ( className ) => {
	return className ? String( className ).split( ' ' ) : [];
};

export const setClassName = ( targetClassName, className, setAttributes ) => {
	const classArray = classStringToClassArray( className );
	if ( ! existsClass( className, targetClassName ) ) {
		setAttributes( {
			className: emptyStringToUndefined(
				clsx( classArray, targetClassName )
			),
		} );
	} else {
		// クラスを削除
		const deleteClass = classArray.indexOf( targetClassName );
		classArray.splice( deleteClass, 1 );
		setAttributes( {
			className: emptyStringToUndefined( clsx( classArray ) ),
		} );
	}
};

export const deleteClass = ( targetClassNames, className, setAttributes ) => {
	const classArray = classStringToClassArray( className );
	const targetClassArray = Array.isArray( targetClassNames )
		? targetClassNames
		: [ targetClassNames ];

	targetClassArray.forEach( ( targetClassName ) => {
		if ( existsClass( className, targetClassName ) ) {
			// クラスを削除
			const deleteClassName = classArray.indexOf( targetClassName );
			classArray.splice( deleteClassName, 1 );
		}
	} );

	setAttributes( {
		className: emptyStringToUndefined( clsx( classArray ) ),
	} );
};

export const existsClass = ( classNames, targetClassName ) => {
	const classArray = Array.isArray( classNames )
		? classNames
		: classStringToClassArray( classNames );
	return classArray.indexOf( targetClassName ) !== -1;
};
