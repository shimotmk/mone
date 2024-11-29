/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import { useBlockProps } from '@wordpress/block-editor';
import { Icon } from '@wordpress/icons';

import { isHexColor } from '../../utils-func/is-hex-color';
import { blockCategoryIcon as icon } from './sample-icon';

export default function save( props ) {
	const { attributes } = props;
	const { width, iconColor, url, linkTarget, rel, hoverBackgroundColor } =
		attributes;

	const blockProps = useBlockProps.save( {
		className: clsx( {
			'has-icon-color': iconColor,
			[ `has-${ iconColor }-color` ]:
				! isHexColor( iconColor ) && iconColor,
		} ),
		style: {
			width,
			color:
				! isHexColor( iconColor ) && iconColor ? undefined : iconColor,
			'--hover-background-color': isHexColor( hoverBackgroundColor )
				? hoverBackgroundColor
				: `var(--wp--preset--color--${ hoverBackgroundColor })` ||
				  undefined,
		},
	} );

	return (
		<div { ...blockProps }>
			{ !! url ? (
				<a
					href={ url }
					target={ linkTarget }
					rel={ rel }
					className="wp-block-mone-icon__link"
				>
					<Icon icon={ icon } />
				</a>
			) : (
				<Icon icon={ icon } />
			) }
		</div>
	);
}
