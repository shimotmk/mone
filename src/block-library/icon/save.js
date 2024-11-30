/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import {
	useBlockProps,
	__experimentalGetSpacingClassesAndStyles as getSpacingClassesAndStyles,
} from '@wordpress/block-editor';
import { renderToString } from '@wordpress/element';

import { isHexColor } from '../../utils-func/is-hex-color';
import {
	ReactIcon,
	createSvgUrl,
} from '../../components/icon-search-popover/ReactIcon';

export default function save( props ) {
	const { attributes } = props;
	const {
		width,
		height,
		iconColor,
		url,
		linkTarget,
		rel,
		hoverBackgroundColor,
		iconGradient,
		iconCustomGradient,
		iconName,
	} = attributes;
	const spacingProps = getSpacingClassesAndStyles( attributes );

	const gradientValue = iconGradient || iconCustomGradient;

	const blockProps = useBlockProps.save( {
		className: clsx( {
			'has-icon-color': iconColor,
			'has-icon-gradient-color': gradientValue,
		} ),
		style: {
			width,
			height,
			'--hover-background-color': hoverBackgroundColor
				? ( isHexColor( hoverBackgroundColor )
						? hoverBackgroundColor
						: `var(--wp--preset--color--${ hoverBackgroundColor })` ) ||
				  undefined
				: undefined,
			'--the-icon-color': iconGradient
				? `var(--wp--preset--gradient--${ iconGradient })`
				: iconCustomGradient ||
				  ( iconColor &&
						( isHexColor( iconColor )
							? iconColor
							: `var(--wp--preset--color--${ iconColor })` ) ),
			...( !!! url ? spacingProps.style : {} ),
		},
	} );

	const linkAttributes = {
		className: 'wp-block-mone-icon__link',
		style: {
			...spacingProps.style,
		},
	};

	const SVG = iconName
		? renderToString( <ReactIcon icon={ iconName } /> )
		: renderToString( <ReactIcon icon="FaWordpress" /> );

	return (
		<div { ...blockProps }>
			{ !! url ? (
				<a
					{ ...linkAttributes }
					href={ url }
					target={ linkTarget }
					rel={ rel }
				>
					<span
						className="wp-block-mone-icon-mask-image"
						aria-hidden="true"
						style={ {
							'--the-icon-svg': `url(${ createSvgUrl( SVG ) })`,
						} }
					>
						{ iconName ? (
							<ReactIcon icon={ iconName } />
						) : (
							<ReactIcon icon="FaWordpress" />
						) }
					</span>
				</a>
			) : (
				<>
					<span
						className="wp-block-mone-icon-mask-image"
						aria-hidden="true"
						style={ {
							'--the-icon-svg': `url(${ createSvgUrl( SVG ) })`,
						} }
					>
						{ iconName ? (
							<ReactIcon icon={ iconName } />
						) : (
							<ReactIcon icon="FaWordpress" />
						) }
					</span>
				</>
			) }
		</div>
	);
}
