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
} from '../../../components/icon-search-popover/ReactIcon';

function migrateV1ToV2( attributes ) {
	if ( ! attributes.iconSVG ) {
		const SVG = attributes.iconName
			? renderToString( <ReactIcon iconName={ attributes.iconName } /> )
			: renderToString( <ReactIcon iconName="FaWordpress" /> );
		attributes = {
			...attributes,
			iconSVG: SVG,
		};
	}
	return {
		...attributes,
	};
}

export const v1 = {
	migrate: migrateV1ToV2,
	attributes: {
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
			? renderToString( <ReactIcon iconName={ iconName } /> )
			: renderToString( <ReactIcon iconName="FaWordpress" /> );

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
								'--the-icon-svg': `url(${ createSvgUrl(
									SVG
								) })`,
							} }
						>
							{ iconName ? (
								<ReactIcon iconName={ iconName } />
							) : (
								<ReactIcon iconName="FaWordpress" />
							) }
						</span>
					</a>
				) : (
					<>
						<span
							className="wp-block-mone-icon-mask-image"
							aria-hidden="true"
							style={ {
								'--the-icon-svg': `url(${ createSvgUrl(
									SVG
								) })`,
							} }
						>
							{ iconName ? (
								<ReactIcon iconName={ iconName } />
							) : (
								<ReactIcon iconName="FaWordpress" />
							) }
						</span>
					</>
				) }
			</div>
		);
	},
};
