import { addFilter } from '@wordpress/hooks';
import './style.scss';
import { registerBlockStyle, registerBlockVariation } from '@wordpress/blocks';

export function registerBlockTypeCommentsPagination( settings, name ) {
	if ( name !== 'core/comments-pagination' ) {
		return settings;
	}

	settings.supports = {
		...settings.supports,
		spacing: {
			margin: true,
			padding: true,
			blockGap: true,
			__experimentalDefaultControls: {
				margin: false,
				padding: false,
				blockGap: true,
			},
		},
	};

	return settings;
}

addFilter(
	'blocks.registerBlockType',
	'mone/blocks/register-block-type/comments-pagination',
	registerBlockTypeCommentsPagination
);

registerBlockStyle( 'core/comments-pagination', {
	name: 'mone-comments-pagination',
	label: 'Mone',
} );

registerBlockVariation( 'core/comments-pagination', {
	name: 'mone/comments-pagination-default',
	attributes: {
		className: 'is-style-mone-comments-pagination',
	},
	isDefault: true,
	scope: [ 'inserter' ],
} );
