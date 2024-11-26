/**
 * WordPress dependencies
 */
import { getPath } from '@wordpress/url';
import { addFilter } from '@wordpress/hooks';

const isSiteEditor = getPath( window.location.href )?.includes(
	'site-editor.php'
);

export function registerBlockTypeStyleSwitcher( settings, name ) {
	if ( name !== 'mone/styles-switcher' ) {
		return settings;
	}

	settings.supports = {
		...settings.supports,
		inserter: isSiteEditor ? true : false,
	};

	return settings;
}

addFilter(
	'blocks.registerBlockType',
	'mone/blocks/register-block-type/mone/styles-switcher',
	registerBlockTypeStyleSwitcher
);
