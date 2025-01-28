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

import { isHexColor } from '../../../utils-func/is-hex-color';
import {
	ReactIcon,
	createSvgUrl,
	isCustomIcon,
} from '../../../components/icon-search-popover/ReactIcon';
import { parseIcon } from '../../../components/icon-search-popover/utils/parse-icon';

export const v1 = {
	attributes: {
		iconSVG: {
			type: 'string',
			source: 'html',
			selector: '.wp-block-mone-icon-mask-image',
		},
		iconName: {
			type: 'string',
		},
		iconColor: {
			type: 'string',
		},
		iconGradient: {
			type: 'string',
		},
		iconCustomGradient: {
			type: 'string',
		},
		width: {
			type: 'string',
		},
		height: {
			type: 'string',
		},
		url: {
			type: 'string',
			role: 'content',
		},
		linkTarget: {
			type: 'string',
			role: 'content',
		},
		rel: {
			type: 'string',
			role: 'content',
		},
		hoverBackgroundColor: {
			type: 'string',
		},
	},
	supports: {
		color: {
			text: false,
			background: true,
			gradients: true,
		},
		spacing: {
			padding: true,
			__experimentalSkipSerialization: true,
			__experimentalDefaultControls: {
				padding: false,
			},
		},
		__experimentalBorder: {
			color: true,
			radius: true,
			width: true,
			style: true,
			__experimentalDefaultControls: {
				color: true,
				radius: true,
				width: true,
				style: true,
			},
		},
		shadow: true,
	},
	save( props ) {
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

		const renderIconSpan = () => (
			<span
				className="wp-block-mone-icon-mask-image"
				aria-hidden="true"
				style={ {
					'--the-icon-svg': `url(${ createSvgUrl( SVG ) })`,
				} }
			>
				{ renderIcon() }
			</span>
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
						{ renderIconSpan() }
					</a>
				) : (
					<>{ renderIconSpan() }</>
				) }
			</div>
		);
	},
};
