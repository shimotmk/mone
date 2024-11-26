import { addFilter } from '@wordpress/hooks';
import './style.scss';

export function registerBlockTypeList( settings, name ) {
	if ( name !== 'core/list' ) {
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

	settings.selectors = {
		border: '.wp-block-list:not(.wp-block-list .wp-block-list)',
	};

	return settings;
}

addFilter(
	'blocks.registerBlockType',
	'mone/blocks/register-block-type/list',
	registerBlockTypeList
);
