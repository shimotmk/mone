/**
 * WordPress dependencies
 */
import {
	getColorObjectByAttributeValues,
	getGradientValueBySlug,
} from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import { stringToArrayClassName } from '../../utils-func/class-name/classAttribute';

export function parseCSS( css = '', colorSettings, colorGradientSettings ) {
	const rules = splitRules( css );
	const obj = {};

	rules.forEach( ( rule ) => {
		const [ property, ...valueParts ] = rule.split( ':' );
		const value = valueParts.join( ':' ).trim();

		if ( property && value ) {
			if (
				property === '--the-icon-color' ||
				property === '--the-icon-gradient-color' ||
				property === 'border-color'
			) {
				obj[ property.trim() ] = processColorValue(
					property,
					value,
					colorSettings,
					colorGradientSettings
				);
			} else {
				obj[ property ] = value;
			}
		}
	} );

	return obj;
}

export function parseClassName( className = '' ) {
	const classArray = stringToArrayClassName( className );
	const obj = {};

	const filteredClasses = classArray.filter(
		( _className ) => _className !== 'mone-inline-icon-wrapper'
	);

	if ( filteredClasses.length ) {
		obj.className = filteredClasses.join( ' ' );
	}

	return obj;
}

function splitRules( css ) {
	const rules = [];
	let rule = '';
	let insideUrl = false;

	for ( let i = 0; i < css.length; i++ ) {
		const char = css[ i ];
		if ( char === ';' && ! insideUrl ) {
			rules.push( rule.trim() );
			rule = '';
		} else {
			rule += char;
			if ( char === '(' && rule.includes( 'url' ) ) {
				insideUrl = true;
			} else if ( char === ')' ) {
				insideUrl = false;
			}
		}
	}
	if ( rule.trim() ) {
		rules.push( rule.trim() );
	}
	return rules;
}

function processColorValue(
	property,
	value,
	colorSettings,
	colorGradientSettings
) {
	if ( property === '--the-icon-color' ) {
		const colorSlug = value
			.replace( 'var(--wp--preset--color--', '' )
			.replace( ')', '' );
		return value.startsWith( 'var(--wp--preset--color--' )
			? getColorObjectByAttributeValues( colorSettings, colorSlug ).color
			: value;
	}

	if ( property === '--the-icon-gradient-color' ) {
		return value.startsWith( 'var(--wp--preset--gradient--' )
			? colorGradientSettings &&
					getGradientValueBySlug(
						colorGradientSettings,
						value
							.replace( 'var(--wp--preset--gradient--', '' )
							.replace( ')', '' )
					)
			: value;
	}

	if ( property === 'border-color' ) {
		const colorSlug = value
			.replace( 'var(--wp--preset--color--', '' )
			.replace( ')', '' );
		return value.startsWith( 'var(--wp--preset--color--' )
			? getColorObjectByAttributeValues( colorSettings, colorSlug ).color
			: value;
	}

	return value;
}
