import { addFilter } from '@wordpress/hooks';
import './style.scss';

export function registerBlockTypeList( settings, name ) {
	if ( name !== 'core/list-item' ) {
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
	'mone/blocks/register-block-type/list-item',
	registerBlockTypeList
);
