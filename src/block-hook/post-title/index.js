import { addFilter } from '@wordpress/hooks';

export function registerBlockTypePostTitle( settings, name ) {
	if ( name !== 'core/post-title' ) {
		return settings;
	}

	settings.supports = {
		...settings.supports,
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
	'mone/blocks/register-block-type/post-title',
	registerBlockTypePostTitle
);
