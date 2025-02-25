/** Type representing a class name as a string or array of strings */
type ClassList = string | string[];

/**
 * Convert class list to array of strings
 * @param classList - Class list to convert
 * @return Class list converted to string array
 */
export const stringToArrayClassName = ( classList: ClassList ): string[] => {
	if ( Array.isArray( classList ) ) {
		return classList;
	}
	return classList ? String( classList ).split( ' ' ) : [];
};

/**
 * Join array of strings into a single string
 * @param classList - Class list to join
 * @return Space-separated string
 */
export const arrayToStringClassName = ( classList: ClassList ): string => {
	if ( Array.isArray( classList ) ) {
		const filteredClassList = classList.filter(
			( className ) => className !== ''
		);
		return filteredClassList.join( ' ' );
	}
	return '';
};

/**
 * Check if specified class exists
 *
 * @param targetClassList - Class to search for
 * @param classList       - Class list to search in
 * @return True if class exists
 */
export const existsClassName = (
	targetClassList: ClassList,
	classList: ClassList
): boolean => {
	const classArray = stringToArrayClassName( classList );
	const targets = stringToArrayClassName( targetClassList );
	return targets.some( ( target ) => classArray.includes( target ) );
};

/**
 * Remove specified classes
 *
 * @param targetClassList - Classes to remove
 * @param classList       - Class list to remove from
 * @return Updated class string
 */
export const deleteClassName = (
	targetClassList: ClassList,
	classList: ClassList
): string => {
	const classArray = stringToArrayClassName( classList );
	const targetArray = stringToArrayClassName( targetClassList );
	const filteredClasses = classArray.filter(
		( className ) => ! targetArray.includes( className )
	);
	return arrayToStringClassName( filteredClasses );
};

/**
 * Add class
 *
 * @param targetClassList - Class to add
 * @param classList       - Class list to add to
 * @return Updated class string
 */
export const addClassName = (
	targetClassList: ClassList,
	classList: ClassList
): string => {
	const classArray = stringToArrayClassName( classList );
	if ( ! existsClassName( targetClassList, classList ) ) {
		classArray.push( targetClassList as string );
	}
	return arrayToStringClassName( classArray );
};

/**
 * Remove classes matching regular expression
 * @param regEx     - Regular expression for removal
 * @param classList - Class list to remove from
 * @return Updated class string
 */
export const deleteRegExClassName = (
	regEx: RegExp,
	classList: ClassList
): string => {
	const classArray = stringToArrayClassName( classList );
	const filteredClassArray = classArray.filter(
		( classItem ) => ! regEx.test( classItem )
	);
	return arrayToStringClassName( filteredClassArray );
};
