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
	isCustomIcon,
} from '../../components/icon-search-popover/ReactIcon';
import { parseIcon } from '../../components/icon-search-popover/utils/parse-icon';

export default function save( props ) {
	const { attributes } = props;
	const {
		iconSVG,
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
			'wp-block-mone-icon-wrapper': ! iconColor && ! gradientValue,
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

	let SVG;
	if ( iconName && isCustomIcon( iconName ) ) {
		SVG = iconSVG;
	} else if ( iconName ) {
		SVG = renderToString( <ReactIcon iconName={ iconName } /> );
	} else {
		SVG = renderToString( <ReactIcon iconName="FaWordpress" /> );
	}

	const renderIcon = () => {
		if ( iconName && isCustomIcon( iconName ) && !! SVG ) {
			return parseIcon( SVG );
		} else if ( iconName ) {
			return <ReactIcon iconName={ iconName } />;
		}
		return <ReactIcon iconName="FaWordpress" />;
	};

	const renderingIcon =
		iconColor || gradientValue ? (
			<>
				<span
					className="wp-block-mone-icon-mask-image wp-block-mone-icon-wrapper"
					aria-hidden="true"
					style={ {
						'--the-icon-svg': `url(${ createSvgUrl( SVG ) })`,
					} }
				>
					{ renderIcon() }
				</span>
			</>
		) : (
			<>{ renderIcon() }</>
		);

	return (
		<div { ...blockProps }>
			{ !! url ? (
				<a
					{ ...linkAttributes }
					href={ url }
					target={ linkTarget }
					rel={ rel }
				>
					{ renderingIcon }
				</a>
			) : (
				<>{ renderingIcon }</>
			) }
		</div>
	);
}
