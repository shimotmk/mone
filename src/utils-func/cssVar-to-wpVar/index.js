import { isValueSpacingPreset } from '@wordpress/block-editor';

export function getCssVarToWpVar( value ) {
	if ( ! value || isValueSpacingPreset( value ) || value === '0' ) {
		return value;
	}

	const output = value.replace(
		/var\(--wp--preset--(.*?)--(.*?)\)/,
		'var:preset|$1|$2'
	);

	return output;
}
