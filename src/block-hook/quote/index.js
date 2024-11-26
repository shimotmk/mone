import { addFilter } from '@wordpress/hooks';

export function registerBlockTypeQuote( settings, name ) {
	if ( name !== 'core/quote' ) {
		return settings;
	}

	settings.supports = {
		...settings.supports,
		background: {
			backgroundImage: true,
			backgroundSize: true,
			__experimentalDefaultControls: {
				backgroundImage: true,
			},
		},
		spacing: {
			blockGap: true,
			padding: true,
			margin: true,
		},
	};

	return settings;
}

addFilter(
	'blocks.registerBlockType',
	'mone/blocks/register-block-type/quote',
	registerBlockTypeQuote
);
