import { emptyStringToUndefined } from './empty-string-to-undefined.js';
import {
	deleteClassName,
	deleteRegExClassName,
	addClassName,
	existsClassName,
} from '../../utils-func/class-name';

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
