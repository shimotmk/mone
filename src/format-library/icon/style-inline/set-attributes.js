/**
 * WordPress dependencies
 */
import {
	getColorObjectByColorValue,
	__experimentalGetGradientObjectByGradientValue,
} from '@wordpress/block-editor';
import { parseWithAttributeSchema } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import { parseCSS } from '../parse';

const processColorStyles = ( {
	iconColor,
	iconGradientColor,
	backgroundColor,
	background,
	borderColor,
	colorSettings,
	flattenGradients,
} ) => {
	const styles = [];

	if ( iconColor ) {
		const colorObject = getColorObjectByColorValue(
			colorSettings,
			iconColor
		);
		const colorValue = colorObject
			? `var(--wp--preset--color--${ colorObject.slug })`
			: iconColor;
		styles.push( `--the-icon-color:${ colorValue }` );
	}

	if ( iconGradientColor ) {
		const iconGradientObject =
			__experimentalGetGradientObjectByGradientValue(
				flattenGradients,
				iconGradientColor
			);
		const iconGradientValue = iconGradientObject
			? `var(--wp--preset--gradient--${ iconGradientObject.slug })`
			: iconGradientColor;
		styles.push( `--the-icon-gradient-color:${ iconGradientValue }` );
	}

	if ( backgroundColor ) {
		const colorObject = getColorObjectByColorValue(
			colorSettings,
			backgroundColor
		);
		const colorValue = colorObject
			? `var(--wp--preset--color--${ colorObject.slug })`
			: backgroundColor;
		styles.push( `background-color:${ colorValue }` );
	}

	if ( background ) {
		const bgGradientObject = __experimentalGetGradientObjectByGradientValue(
			flattenGradients,
			background
		);
		const bgGradientValue = bgGradientObject
			? `var(--wp--preset--gradient--${ bgGradientObject.slug })`
			: background;
		styles.push( `background:${ bgGradientValue }` );
	}

	if ( borderColor ) {
		const colorObject = getColorObjectByColorValue(
			colorSettings,
			borderColor
		);
		const colorValue = colorObject
			? `var(--wp--preset--color--${ colorObject.slug })`
			: borderColor;
		styles.push( `border-color:${ colorValue }` );
	}

	return {
		styles,
		hasColor: Boolean( iconColor || iconGradientColor ),
	};
};

export function setAttributes( {
	value,
	name,
	colorSettings,
	gradientSettings,
	newValueObj,
	activeObjectAttributes,
} ) {
	const flattenGradients = gradientSettings
		.map( ( setting ) => setting.gradients )
		.flat();
	const parsedStyles = parseCSS(
		activeObjectAttributes.style,
		colorSettings,
		flattenGradients
	);

	const {
		'--the-icon-color': iconColor,
		'--the-icon-gradient-color': iconGradientColor,
		'border-color': borderColor,
		'background-color': backgroundColor,
		background: background,
		className: attributesClassNames = '',
		...declaration
	} = {
		...parsedStyles,
		...newValueObj,
	};

	const styles = [];
	const attributes = {};

	Object.entries( declaration ).forEach( ( [ property, _value ] ) => {
		if ( _value ) {
			styles.push( `${ property }:${ _value }` );
		}
	} );

	const { styles: colorStyles, hasColor } = processColorStyles( {
		iconColor,
		iconGradientColor,
		backgroundColor,
		background,
		borderColor,
		colorSettings,
		flattenGradients,
	} );
	styles.push( ...colorStyles );

	if ( styles.length ) {
		attributes.style = styles.length ? `${ styles.join( ';' ) };` : '';
	}

	if ( attributesClassNames ) {
		attributes.class = 'mone-inline-icon-wrapper ' + attributesClassNames;
	} else {
		attributes.class = 'mone-inline-icon-wrapper';
	}

	const innerHTMLWrapTag = parseWithAttributeSchema(
		value.replacements[ value.start ].innerHTML,
		{
			source: 'tag',
			selector: ':nth-child(1)',
		}
	);

	const svgHTML = parseWithAttributeSchema(
		value.replacements[ value.start ].innerHTML,
		{
			type: 'string',
			source: 'html',
			selector: '.mone-inline-icon-svg-wrapper',
		}
	);

	let newInnerHTML;
	if ( hasColor ) {
		if ( innerHTMLWrapTag === 'svg' ) {
			newInnerHTML =
				'<span class="mone-inline-icon-svg-wrapper">' +
				value.replacements[ value.start ].innerHTML +
				'</span>';
		} else {
			newInnerHTML = value.replacements[ value.start ].innerHTML;
		}
	} else if ( svgHTML ) {
		newInnerHTML = svgHTML;
	} else {
		newInnerHTML = value.replacements[ value.start ].innerHTML;
	}

	const newReplacements = value.replacements.slice();
	newReplacements[ value.start ] = {
		type: name,
		attributes: {
			style: attributes.style,
			class: attributes.class,
		},
		innerHTML: newInnerHTML,
	};
	const returnObj = {
		...value,
		replacements: newReplacements,
	};

	return returnObj;
}
