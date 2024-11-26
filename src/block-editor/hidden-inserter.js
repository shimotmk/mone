import { addFilter } from '@wordpress/hooks';

export function registerBlockTypeHideInserter( settings, name ) {
	const deprecatedBlocks = [
		'core/freeform',
		'core/verse',
		'core/pullquote',
	];
	if ( deprecatedBlocks.includes( name ) ) {
		settings.supports = {
			...settings.supports,
			inserter: false,
		};
	}

	return settings;
}
addFilter(
	'blocks.registerBlockType',
	'mone/blocks/register-block-type/hide-inserter',
	registerBlockTypeHideInserter
);
