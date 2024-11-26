import { addFilter } from '@wordpress/hooks';
import './style.scss';
import { registerBlockStyle, registerBlockVariation } from '@wordpress/blocks';

export function registerBlockTypeQueryPagination( settings, name ) {
	if ( name !== 'core/query-pagination' ) {
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
	'mone/blocks/register-block-type/query-pagination',
	registerBlockTypeQueryPagination
);

registerBlockStyle( 'core/query-pagination', {
	name: 'mone-query-pagination',
	label: 'Mone',
} );

registerBlockVariation( 'core/query-pagination', {
	name: 'mone/query-pagination-default',
	attributes: {
		className: 'is-style-mone-query-pagination',
	},
	isDefault: true,
	scope: [ 'inserter' ],
} );
