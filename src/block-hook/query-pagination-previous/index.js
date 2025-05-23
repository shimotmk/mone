import { __ } from '@wordpress/i18n';
import { addFilter } from '@wordpress/hooks';
import './style.scss';
import { registerBlockVariation } from '@wordpress/blocks';

export function registerBlockTypeQueryPaginationNext( settings, name ) {
	if ( name !== 'core/query-pagination-previous' ) {
		return settings;
	}

	settings.supports = {
		...settings.supports,
		color: {
			text: true,
		},
		spacing: {
			margin: true,
			padding: true,
			__experimentalDefaultControls: {
				margin: false,
				padding: false,
			},
		},
		__experimentalBorder: {
			radius: true,
			color: true,
			width: true,
			style: true,
		},
	};

	return settings;
}

addFilter(
	'blocks.registerBlockType',
	'mone/blocks/register-block-type/query-pagination-previous',
	registerBlockTypeQueryPaginationNext
);

registerBlockVariation( 'core/query-pagination-previous', {
	name: 'mone/query-pagination-previous-default',
	attributes: {
		label: __( 'Previous article', 'mone' ),
		style: {
			border: {
				width: '1px',
			},
			spacing: {
				padding: {
					right: 'var:preset|spacing|10',
					left: 'var:preset|spacing|10',
					top: '0.75rem',
					bottom: '0.75rem',
				},
			},
			elements: {
				link: {
					color: {
						text: 'var:preset|color|content-contrast-2',
					},
				},
			},
		},
		textColor: 'content-contrast-2',
		fontSize: 'small',
		borderColor: 'mone-border',
	},
	isDefault: true,
	scope: [ 'inserter' ],
} );
