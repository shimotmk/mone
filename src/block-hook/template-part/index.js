import { addFilter } from '@wordpress/hooks';
import './style.scss';

export function registerBlockTypeList( settings, name ) {
	if ( name !== 'core/template-part' ) {
		return settings;
	}

	settings.supports = {
		...settings.supports,
		position: {
			sticky: true,
		},
		spacing: {
			margin: true,
		},
	};

	return settings;
}

addFilter(
	'blocks.registerBlockType',
	'mone/blocks/register-block-type/template',
	registerBlockTypeList
);
