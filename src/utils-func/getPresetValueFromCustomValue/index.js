import { isValueSpacingPreset } from '@wordpress/block-editor';

/**
 * Converts a custom value to preset value if one can be found.
 *
 * Returns value as-is if no match is found.
 *
 * @param {string} value        Value to convert
 * @param {Array}  spacingSizes Array of the current spacing preset objects
 *
 * @return {string} The preset value if it can be found.
 */
export function getPresetValueFromCustomValue( value, spacingSizes ) {
	// Return value as-is if it is undefined or is already a preset, or '0';
	if ( ! value || isValueSpacingPreset( value ) || value === '0' ) {
		return value;
	}

	const spacingMatch = spacingSizes.find(
		( size ) => String( size.size ) === String( value )
	);

	if ( spacingMatch?.slug ) {
		return `var:preset|spacing|${ spacingMatch.slug }`;
	}

	return value;
}
