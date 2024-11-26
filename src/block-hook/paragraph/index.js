import { addFilter } from '@wordpress/hooks';

export function registerBlockTypeParagraph( settings, name ) {
	if ( name !== 'core/paragraph' ) {
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
	'mone/blocks/register-block-type/paragraph',
	registerBlockTypeParagraph
);
